import { consumetApi } from '@/config/config';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError, isAxiosError } from 'axios';
import { getRandom } from 'random-useragent';

export const config = {
  api: {
    responseLimit: false,
  },
};

const trending: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { page, perPage } = req.query;
    const params = new URLSearchParams();

    if (page) {
      params.append('page', String(page));
    }

    if (perPage) {
      params.append('perPage', String(perPage));
    }

    const url = `${consumetApi}/trending?${params.toString()}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': getRandom() },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error:', error);
    if (isAxiosError(error)) {
      const err = error as AxiosError;

      return res.status(err.response?.status as number).json({
        message: 'Internal Server Error',
        error: {
          name: `${err.name}`,
          body: JSON.parse(JSON.stringify(err.response?.data)),
        },
      });
    } else {
      const err = error as Error;

      return res.status(500).json({
        message: 'Internal Server Error',
        error: {
          name: `${err.name}`,
          message: `${err.message}`,
        },
      });
    }
  }
};

export default trending;
