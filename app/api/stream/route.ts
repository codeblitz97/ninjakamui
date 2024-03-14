import { streamApi } from '@/config/config';
import axios, { type AxiosError, isAxiosError } from 'axios';
import { getRandom } from 'random-useragent';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const response = await axios.get(
      `${streamApi}/gogoanime/watch/${searchParams.get('episodeId')}?server=${
        searchParams.get('server') ?? 'gogocdn'
      }`,
      {
        headers: { 'User-Agent': getRandom() },
      }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Error', error);

    if (isAxiosError(error)) {
      const err = error as AxiosError;

      return NextResponse.json(
        {
          message: 'Internal Server Error',
          error: {
            name: `${err.name}`,
            body: JSON.parse(JSON.stringify(err.response?.data)),
          },
        },
        { status: err.response?.status as number }
      );
    } else {
      const err = error as Error;

      return NextResponse.json(
        {
          message: 'Internal Server Error',
          error: {
            name: `${err.name}`,
            message: `${err.message}`,
          },
        },
        { status: 500 }
      );
    }
  }
}
