'use client';

import { Anime, ServerAnime } from '@/utils/types';
import Image from 'next/image';
import {
  SeasonType,
  encodeNumber,
  generateColorBySeason,
} from '@/utils/functions';
import axios from 'axios';
import { useState, useEffect } from 'react';

type Props = {
  i: Anime;
  id: string;
};

export default function Episodes({ i, id }: Readonly<Props>) {
  const [imageData, setImageData] = useState<ServerAnime[] | null>(null);

  useEffect(() => {
    const fetchEpisodeImage = async () => {
      try {
        let baseUrl = process.env.NEXT_PUBLIC_THIS_URL as string;

        console.log(id);

        const response: ServerAnime[] = (
          await axios.get(`${baseUrl}/api/episode/${id}`)
        ).data;

        setImageData(response);
      } catch (error) {
        return undefined;
      }
    };

    fetchEpisodeImage();
  }, []);

  return (
    <div>
      <div className="bg-gray-800  w-[430px] rounded-lg">
        <h1 className="ml-4 font-semibold text-2xl mb-2">More episodes</h1>
        <div className="max-h-[500px] overflow-y-auto min-w-[400px]">
          {(
            i.episodes.data.find((e) => e.providerId === 'zoro') ??
            i.episodes.data.find((e) => e.providerId === 'gogoanime')
          )?.episodes.map((e, ind) => {
            return (
              <a
                key={e.id}
                href={`/watch/${encodeURIComponent(
                  encodeNumber(
                    Number(i.id),
                    process.env.NEXT_PUBLIC_SECRET_KEY as string
                  )
                )}/episode-${e.number}`}
              >
                <div className="hover:bg-slate-500/20 duration-200 h-32 rounded-md flex items-center mt-4">
                  <div className="flex gap-2 ml-2">
                    <Image
                      src={
                        imageData?.[0].episodes.sub.find(
                          (ip) => ip.number === e.number
                        )?.image ?? i.coverImage
                      }
                      alt={e.title ?? `Episode ${ind + 1}`}
                      width={2024}
                      height={2024}
                      className="object-cover max-h-[110px] max-w-[170px] rounded-md"
                    />
                    <div className="min-w-[40px]">
                      <h1 className="flex gap-2">
                        <span>{e.title ?? 'Episode 1'}</span>
                      </h1>
                      <h1 className="text-sm text-gray-400">
                        {e.description ?? e.rating}
                      </h1>
                      <h1
                        className="text-sm"
                        style={{
                          color: generateColorBySeason(
                            (i.season.slice(0, 1) +
                              i.season.slice(1).toLowerCase()) as SeasonType
                          ),
                        }}
                      >
                        {i.status}
                      </h1>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
