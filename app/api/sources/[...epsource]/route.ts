import { consumetApi } from '@/config/config';
import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

async function consumetEpisode(id: string) {
  try {
    const { data } = await axios.get(`${consumetApi}/watch/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function anifyEpisode(
  provider: string,
  episodeid: string,
  epnum: string,
  id: string,
  subtype: string
) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/sources?providerId=${provider}&watchId=${encodeURIComponent(
        episodeid
      )}&episodeNumber=${epnum}&id=${id}&subType=${subtype}`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const POST = async (req: NextRequest, { params }: any) => {
  const id: string = params.epsource[0];
  const { source, provider, episodeid, episodenum, subtype } = await req.json();

  let data;

  if (source === 'consumet') {
    data = await consumetEpisode(episodeid);
  }

  if (source === 'anify') {
    data = await anifyEpisode(provider, episodeid, episodenum, id, subtype);
  }

  return NextResponse.json(data);
};
