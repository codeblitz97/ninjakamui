import axios, { AxiosRequestConfig } from 'axios';
import { NextResponse } from 'next/server';
import { CombineEpisodeMeta } from '@/utils/functions';
import { consumetApi } from '@/config/config';

// @ts-ignore
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.timeout = 9000;
  return config;
});

async function fetchConsumetEpisodes(id: string) {
  try {
    const fetchData = async (dub = false) => {
      const { data } = await axios.get(
        `${consumetApi}/episodes/${id}${dub ? '?dub=true' : ''}`
      );
      if (data?.message === 'Anime not found' && data?.length < 1) {
        return [];
      }
      return data;
    };

    const [subData, dubData] = await Promise.all([
      fetchData(),
      fetchData(true),
    ]);

    const array = [
      {
        consumet: true,
        providerId: 'gogoanime',
        episodes: {
          sub: subData,
          dub: dubData,
        },
      },
    ];

    return array;
  } catch (error) {
    console.error(
      'Error fetching and processing consumet:',
      (error as Error).message
    );
    return [];
  }
}

async function fetchAnifyEpisodes(id: string) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/info/${id}?fields=[episodes]`
    );

    const epdata = data.episodes.data;
    if (!data) {
      return [];
    }

    const filtereddata = epdata.filter(
      (episodes: any) => episodes.providerId !== '9anime'
    );
    return filtereddata;
  } catch (error) {
    console.error(
      'Error fetching and processing anify:',
      (error as Error).message
    );
    return [];
  }
}

async function fetchEpisodeImages(id: string, available = false) {
  try {
    if (available) {
      return null;
    }
    const { data } = await axios.get(
      `https://api.anify.tv/content-metadata/${id}`
    );

    if (!data) {
      return [];
    }
    const metadata = data?.find((i: any) => i.providerId === 'tvdb') || data[0];
    return metadata?.data;
  } catch (error) {
    console.error(
      'Error fetching and processing meta:',
      (error as Error).message
    );
    return [];
  }
}

const fetchAndCacheData = async (
  id: string,
  meta: string | null,
  cacheTime: number | null,
  refresh: boolean
) => {
  const [consumet, anify, cover] = await Promise.all([
    fetchConsumetEpisodes(id),
    fetchAnifyEpisodes(id),
    fetchEpisodeImages(id, !refresh),
  ]);

  const combinedData = [...consumet, ...anify];
  let data = combinedData;
  if (refresh) {
    if (cover && cover?.length > 0) {
      try {
        data = await CombineEpisodeMeta(combinedData, cover);
      } catch (error) {
        console.error('Error serializing cover:', (error as Error).message);
      }
    } else if (meta) {
      data = await CombineEpisodeMeta(combinedData, JSON.parse(meta));
    }
  } else if (meta) {
    data = await CombineEpisodeMeta(combinedData, JSON.parse(meta));
  }

  return data;
};

export const GET = async (req: any, { params }: any) => {
  const url = new URL(req.url);
  const id = params.animeid[0];
  const releasing = url.searchParams.get('releasing') || false;
  const refresh = url.searchParams.get('refresh') === 'true' || false;

  let cacheTime = null;
  if (releasing === 'true') {
    cacheTime = 60 * 60 * 3;
  } else if (releasing === 'false') {
    cacheTime = 60 * 60 * 24 * 45;
  }

  let meta: string | null = null;

  if (refresh) {
    meta = null;
  }

  const fetchdata = await fetchAndCacheData(id, meta, cacheTime, refresh);
  return NextResponse.json(fetchdata);
};
