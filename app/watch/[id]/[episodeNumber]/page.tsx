import { Player } from '@/app/components/Player/VidstackPlayer';
import {
  type SeasonType,
  decodeNumber,
  encodeNumber,
  generateColorBySeason,
  generateColorByStatus,
  StatusType,
} from '@/utils/functions';
import { ConsumetAnimeData, VideoInfo } from '@/utils/types';
import axios from 'axios';
import type { Metadata } from 'next';
import { FaShare, FaSmile } from 'react-icons/fa';
import CopyToClipboard from './copy';
import Image from 'next/image';
import type { Viewport } from 'next';

type Props = {
  params: {
    id: string;
    episodeNumber: string;
  };
};

const fetchInfo = async (
  id: string
): Promise<ConsumetAnimeData | undefined> => {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_THIS_URL as string;
    const response = await axios.get(`${baseUrl}/api/info?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const fetchEpisode = async (
  episodeId: string
): Promise<VideoInfo | undefined> => {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_THIS_URL as string;
    const response = await axios.get(
      `${baseUrl}/api/stream?episodeId=${encodeURIComponent(episodeId)}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export async function generateMetadata({
  params,
}: Readonly<Props>): Promise<Metadata> {
  const decodedId = String(
    decodeNumber(
      decodeURIComponent(params.id),
      process.env.NEXT_PUBLIC_SECRET_KEY as string
    )
  );
  const info = await fetchInfo(decodedId);
  const episodeNumber = params.episodeNumber.split('-')[1];

  return {
    title: info
      ? `Episode ${episodeNumber} of ${info?.title.english}`
      : 'Loading...',
    description: info
      ? `${info.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 180)}...`
      : 'Loading...',
    openGraph: {
      images: info ? info.cover : 'No image',
    },
  };
}

export async function generateViewport({
  params,
}: Readonly<Props>): Promise<Viewport> {
  const decodedId = String(
    decodeNumber(
      decodeURIComponent(params.id),
      process.env.NEXT_PUBLIC_SECRET_KEY as string
    )
  );
  const info = await fetchInfo(decodedId);

  return {
    themeColor: info ? `${info.color}` : '#0394fc',
  };
}

export default async function Watch({ params }: Readonly<Props>) {
  const i = await fetchInfo(
    String(
      decodeNumber(
        decodeURIComponent(params.id),
        process.env.NEXT_PUBLIC_SECRET_KEY as string
      )
    )
  );

  const episodeId = i?.episodes.find(
    (i) => i.number === Number(params.episodeNumber.split('-')[1])
  )?.id;

  const stream = await fetchEpisode(String(episodeId));

  return (
    <div>
      {i ? (
        <div className="absolute left-5">
          <div className="w-full flex flex-col lg:flex-row lg:max-w-[900px] mx-auto  lg:gap-[6px] mt-[70px]">
            <div className="flex-grow w-full h-full">
              <div>
                <Player
                  hsl={
                    stream?.sources.find((v) => v.quality === 'default')
                      ?.url as string
                  }
                  title={`${i.title.english} Episode ${
                    params.episodeNumber.split('-')[1]
                  }`}
                  cover={`${i.cover}`}
                />
                <h1 className="text-xl font-semibold max-w-[900px]">
                  {i.title.english} Episode {params.episodeNumber.split('-')[1]}
                </h1>
                <div className="mt-4 flex gap-16">
                  <div>
                    <p className="text-gray-300 text-[16px]">
                      {i.title.romaji}
                    </p>
                    <p className="text-gray-400 text-sm">{i.title.native}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="tooltip tooltip-top" data-tooltip="Share">
                      <div>
                        <label
                          className="btn btn-circle btn-solid-primary"
                          htmlFor="shareModal"
                        >
                          <FaShare />
                        </label>
                        <input
                          className="modal-state"
                          id="shareModal"
                          type="checkbox"
                        />
                        <div className="modal">
                          <label
                            className="modal-overlay"
                            htmlFor="shareModal"
                          ></label>
                          <div className="modal-content flex flex-col gap-5">
                            <label
                              htmlFor="shareModal"
                              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                              ✕
                            </label>
                            <h2 className="text-xl">Share with your friends</h2>
                            <span>
                              To share{' '}
                              <span className="font-semibold">
                                {i.title.english}
                              </span>{' '}
                              with your friends copy the link below.
                            </span>

                            <div className="flex gap-3 items-center">
                              <input
                                id="linkInput"
                                className="input input-primary"
                                value={`${
                                  process.env.NEXT_PUBLIC_THIS_URL
                                }/${encodeURIComponent(
                                  encodeNumber(
                                    Number(i.id),
                                    process.env.NEXT_PUBLIC_SECRET_KEY as string
                                  )
                                )}/${params.episodeNumber}`}
                                readOnly={true}
                              />
                              <CopyToClipboard />
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
                <div className="bg-slate-600 mt-5 rounded-md">
                  <section className="flex gap-1 ml-2">
                    <h1>{i.popularity}</h1>
                    <span>•</span>
                    <h1>{i.status}</h1>
                    <span>•</span>
                    <h1>{i.releaseDate}</h1>
                    <div className="flex ml-3 gap-1">
                      {i.genres.map((i) => {
                        return (
                          <a
                            className="text-blue-500"
                            key={i}
                            href={`${process.env.NEXT_PUBLIC_THIS_URL}/search?genre=${i}`}
                          >
                            #{i}
                          </a>
                        );
                      })}
                    </div>
                  </section>
                  <section className="mt-4 ml-2">
                    <p dangerouslySetInnerHTML={{ __html: i.description }} />
                  </section>
                  <section className="mt-4 ml-2">
                    <p>Studios: {i.studios.join(', ')}</p>
                    <p>
                      Season:{' '}
                      <span
                        style={{
                          color: generateColorBySeason(
                            (i.season.slice(0, 1) +
                              i.season.slice(1).toLowerCase()) as SeasonType
                          ),
                        }}
                      >
                        {i.season.slice(0, 1) + i.season.slice(1).toLowerCase()}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaSmile /> <span>{i.rating}%</span>
                    </p>
                  </section>
                </div>
              </div>
            </div>
            <div className="absolute left-[1000px] top-14">
              <div className="bg-gray-800  w-[430px] rounded-lg">
                <h1 className="ml-4 font-semibold text-2xl mb-2">
                  More episodes
                </h1>
                <div className="max-h-[500px] overflow-y-auto min-w-[400px]">
                  {i.episodes.map((e, ind) => {
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
                              src={e.image}
                              alt={e.title ?? `Episode ${ind + 1}`}
                              width={2024}
                              height={2024}
                              className="object-cover max-h-[110px] max-w-[170px] rounded-md"
                            />
                            <div className="min-w-[40px]">
                              <h1 className="flex gap-2">
                                <span>Episode</span>
                                <span>{e.number}</span>
                              </h1>
                              <h1 className="text-sm text-gray-400">
                                {i.title.romaji}
                              </h1>
                              <h1
                                className="text-sm"
                                style={{
                                  color: generateColorBySeason(
                                    (i.season.slice(0, 1) +
                                      i.season
                                        .slice(1)
                                        .toLowerCase()) as SeasonType
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
              <div className="mt-10">
                <h1 className="font-semibold text-2xl mb-3">Recommendations</h1>
                {i.recommendations.map((r) => {
                  return (
                    <div key={r.id} className="mb-2">
                      <div className="flex gap-2">
                        <Image
                          src={r.cover}
                          alt={r.title.english}
                          height={2024}
                          width={2024}
                          className="object-cover h-[150px] w-[200px] rounded-md"
                        />
                        <div>
                          <h1 className="font-medium text-xl">
                            {r.title.english}
                          </h1>
                          <h1 className="text-lg text-gray-300">
                            {r.title.romaji}
                          </h1>
                          <h1>
                            {r.type} •{' '}
                            <span
                              style={{
                                color: generateColorByStatus(
                                  r.status as StatusType
                                ),
                              }}
                            >
                              {r.status}
                            </span>{' '}
                            • {r.episodes}
                          </h1>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
