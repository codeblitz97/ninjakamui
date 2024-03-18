import Player from '@/app/components/Player/VidstackPlayer';
import {
  type SeasonType,
  decodeNumber,
  encodeNumber,
  generateColorBySeason,
  generateColorByStatus,
  StatusType,
} from '@/utils/functions';
import {
  Anime,
  ConsumetAnimeData,
  ServerAnime,
  VideoInfo,
} from '@/utils/types';
import axios from 'axios';
import type { Metadata } from 'next';
import { FaShare, FaSmile } from 'react-icons/fa';
import CopyToClipboard from './copy';
import Image from 'next/image';
import type { Viewport } from 'next';
import Sidebar from '@/app/components/Sidebar';
import { consumetApi } from '@/config/config';
import SearchComponent from '@/app/components/Search';
import Episodes from './episodes';

type Props = {
  params: {
    id: string;
    episodeNumber: string;
  };
};

const fetchInfo = async (id: string): Promise<Anime | undefined> => {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_THIS_URL as string;
    const response = await axios.get(`${baseUrl}/api/info?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const fetchConsumetInfo = async (
  id: string
): Promise<ConsumetAnimeData | undefined> => {
  try {
    const response = await axios.get(`${consumetApi}/info/${id}`);
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

const fetchEpisodeImage = async (id: string, episodeNumber: number) => {
  try {
    let baseUrl = process.env.NEXT_PUBLIC_THIS_URL as string;

    const response: ServerAnime[] = (
      await axios.get(`${baseUrl}/api/episode/${id}`)
    ).data;

    const episodeImage = response[0].episodes.sub.find(
      (i) => i.number === episodeNumber
    )?.image;
    return episodeImage;
  } catch (error) {
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
      images: info ? info.coverImage : 'No image',
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
  const j = await fetchConsumetInfo(
    String(
      decodeNumber(
        decodeURIComponent(params.id),
        process.env.NEXT_PUBLIC_SECRET_KEY as string
      )
    )
  );

  const episodeId =
    // i?.episodes.data
    //   .find((p) => p.providerId === 'zoro')
    //   ?.episodes.find(
    //     (i) => i.number === Number(params.episodeNumber.split('-')[1])
    //   )?.id ??
    i?.episodes.data
      .find((p) => p.providerId === 'gogoanime')
      ?.episodes.find(
        (i) => i.number === Number(params.episodeNumber.split('-')[1])
      )
      ?.id.replace(/\//g, '');
  let stream: VideoInfo | undefined;

  if (episodeId) stream = await fetchEpisode(String(episodeId));

  const episodeImage = await fetchEpisodeImage(
    String(
      decodeNumber(
        decodeURIComponent(params.id),
        process.env.NEXT_PUBLIC_SECRET_KEY as string
      )
    ),
    Number(params.episodeNumber.split('-')[1])
  );

  return (
    <div>
      <div className="relative z-[312]">
        <Sidebar />
        <div className="ml-[650px] -mt-12">
          <SearchComponent />
        </div>
      </div>

      {i && j ? (
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
                  cover={episodeImage as string}
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
                                }/watch/${encodeURIComponent(
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
                    <h1>{i.averagePopularity}</h1>
                    <span>•</span>
                    <h1>{i.status}</h1>
                    <span>•</span>
                    <h1>{i.year}</h1>
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
                      <FaSmile /> <span>{i.rating.anilist}</span>
                    </p>
                  </section>
                </div>
              </div>
            </div>
            <div className="absolute left-[1000px] top-14">
              <Episodes
                i={i}
                id={String(
                  decodeNumber(
                    decodeURIComponent(params.id),
                    process.env.NEXT_PUBLIC_SECRET_KEY as string
                  )
                )}
              />
              <div className="mt-10">
                <h1 className="font-semibold text-2xl mb-3">Recommendations</h1>
                {j.recommendations.map((r) => {
                  return (
                    <div key={r.id} className="mb-2">
                      <a
                        href={`/watch/${encodeURIComponent(
                          encodeNumber(
                            Number(r.id),
                            process.env.NEXT_PUBLIC_SECRET_KEY as string
                          )
                        )}/episode-1`}
                      >
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
                      </a>
                    </div>
                  );
                })}
                E
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
