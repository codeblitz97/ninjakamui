import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import {
  AnifyEpisodeDetail,
  AnimeData,
  AnimeResult,
  ConsumetEpisode,
} from './types';
import { consumetApi } from '@/config/config';

export function encodeNumber(
  numberToEncode: number,
  secretKey: string
): string {
  const encodedString = CryptoJS.AES.encrypt(
    numberToEncode.toString(),
    secretKey
  ).toString();
  return encodedString;
}

export function decodeNumber(encodedString: string, secretKey: string): number {
  const bytes = CryptoJS.AES.decrypt(encodedString, secretKey);
  const decodedNumber = parseInt(bytes.toString(CryptoJS.enc.Utf8), 10);
  return decodedNumber;
}

export function generateIndex(start: number, end: number): number {
  if (start > end) {
    throw new Error('Start value must be less than or equal to end value');
  }

  const randomIndex = Math.floor(Math.random() * (end - start + 1)) + start;
  return randomIndex;
}

export type SeasonType = 'Winter' | 'Summer' | 'Spring' | 'Autumn';
export type StatusType =
  | 'Ongoing'
  | 'Completed'
  | 'Unknown'
  | 'Not yet aired'
  | 'Hiatus'
  | 'Cancelled';

export function generateColorBySeason(season: SeasonType) {
  let color: string;
  switch (season) {
    case 'Winter':
      color = '#b4e0db';
      break;
    case 'Summer':
      color = '#e0b4b4';
      break;
    case 'Autumn':
      color = '#f2baa7';
      break;
    case 'Spring':
      color = '#e8b7e5';
      break;
    default:
      color = '#b4e0db';
      break;
  }

  return color;
}

export function generateColorByStatus(status: StatusType) {
  let color: string;
  switch (status) {
    case 'Completed':
      color = '#b4e0db';
      break;
    case 'Cancelled':
      color = '#e0b4b4';
      break;
    case 'Unknown':
      color = '#f2baa7';
      break;
    case 'Hiatus':
      color = '#e8b7e5';
      break;
    case 'Ongoing':
      color = '#8fdbb9';
      break;
    case 'Not yet aired':
      color = '#bddb8f';
      break;
    default:
      color = '#b4e0db';
      break;
  }

  return color;
}

export const getTrendingAnimeForSitemap = async (): Promise<
  AnimeResult[] | undefined
> => {
  try {
    const response = await axios.get(`${consumetApi}/trending?perPage=34`);
    return response.data.results as AnimeResult[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export async function CombineEpisodeMeta(
  episodeData: any | ConsumetEpisode,
  imageData: any
) {
  const episodeImages: any = {};

  imageData.forEach((image: any) => {
    episodeImages[image.number || image.episode] = image;
  });

  for (const providerEpisodes of episodeData) {
    const episodesArray = Array.isArray(providerEpisodes.episodes)
      ? providerEpisodes.episodes
      : [
          ...(providerEpisodes.episodes.sub || []),
          ...(providerEpisodes.episodes.dub || []),
        ];

    for (const episode of episodesArray) {
      const episodeNum = episode.number;

      if (episodeImages[episodeNum]) {
        const img =
          episodeImages[episodeNum].img || episodeImages[episodeNum].image;
        const title =
          episodeImages[episodeNum]?.title?.en ||
          episodeImages[episodeNum].title;
        const description =
          episodeImages[episodeNum].description ||
          episodeImages[episodeNum].overview ||
          episodeImages[episodeNum].summary;
        Object.assign(episode, { img, title, description });
      }
    }
  }

  return episodeData;
}

export function ProvidersMap(
  episodeData: any,
  defaultProvider: any,
  setdefaultProvider: any
) {
  let subProviders;

  if (episodeData) {
    subProviders = episodeData?.map((i: any) => {
      if (i?.providerId === 'gogoanime' && i?.consumet !== true) {
        return {
          episodes: i.episodes,
          providerId: 'gogobackup',
        };
      }
      return i;
    });
  }

  const dubProviders = subProviders?.filter(
    (i: any) =>
      (Array.isArray(i?.episodes) &&
        i?.episodes?.some((epi: any) => epi?.hasDub === true)) ||
      (i.consumet === true && i?.episodes?.dub.length > 0)
  );

  if (subProviders?.length > 0) {
    const dprovider = subProviders?.find(
      (x: any) => x.providerId === 'gogoanime' || x.providerId === 'zoro'
    );

    if (!defaultProvider) {
      setdefaultProvider(dprovider?.providerId || subProviders[0].providerId);
    }
  }

  return { subProviders, dubProviders };
}

export const Top100AnilistForSitemaps = async () => {
  try {
    const response = await fetch(
      'https://graphql.anilist.co',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `query($perPage: Int, $page: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        perPage
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media (sort :SCORE_DESC, type : ANIME){
                        id
                        idMal
                        title {
                            romaji
                            english
                            userPreferred
                        }
                        coverImage {
                            large
                            extraLarge
                            color
                        }
                        episodes
                        status
                        duration
                        genres
                        season
                        format
                        averageScore
                        popularity
                        nextAiringEpisode {
                            airingAt
                            episode
                          }
                          seasonYear
                          startDate {
                            year
                            month
                            day
                          }
                          endDate {
                            year
                            month
                            day
                          }
                    }
                }
            }`,
          variables: {
            page: 1,
            perPage: 10,
          },
        }),
      },
      // @ts-ignore
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching data from AniList:', error);
  }
};
