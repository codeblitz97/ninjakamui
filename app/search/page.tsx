'use client';

import { consumetApi } from '@/config/config';
import {
  encodeNumber,
  generateColorByStatus,
  StatusType,
} from '@/utils/functions';
import { AnimeInfo, AnimeResult } from '@/utils/types';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const fetchSearch = async (
  query?: string,
  genre?: string,
  page = 1,
  perPage = 24
): Promise<AnimeInfo | undefined> => {
  try {
    let params = new URLSearchParams();
    if (query) {
      params.append('query', query);
    }
    if (genre) {
      const formattedGenre = genre.includes(',')
        ? JSON.stringify(genre.split(',').map((item) => item.trim()))
        : `["${genre.trim()}"]`;
      params.append('genres', `${formattedGenre}`);
    }
    if (page) {
      params.append('page', String(page));
    }
    if (perPage) {
      params.append('perPage', String(perPage));
    }

    const url = `${consumetApi}/advanced-search?${params.toString()}`;

    console.log(url);

    const response = await axios.get(url);

    return response.data as AnimeInfo;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

function S() {
  let [data, setData] = useState<AnimeResult[] | null | undefined>(null);
  const [pg, setPg] = useState<AnimeInfo | null | undefined>(null);
  let searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchSearch(
        searchParams.get('query') ?? undefined,
        searchParams.get('genre') ?? undefined,
        pg?.currentPage ?? 1
      );
      setData(fetchedData?.results ?? null);
      setPg(fetchedData);
    };

    fetchData();
  }, [searchParams, pg?.currentPage]);

  const handlePageChange = async (page: number) => {
    // @ts-ignore
    setPg((prevState) => ({ ...prevState, currentPage: page }));
  };

  const renderPagination = () => {
    if (!pg || !pg.totalPages || pg.totalPages === 1) return null;

    const pages = [];
    for (let i = 1; i <= pg.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`btn ${pg.currentPage === i ? 'btn-active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="pagination w-full max-w-xs overflow-auto">{pages}</div>
    );
  };
  return (
    <div className="ml-4">
      <Sidebar />
      <h1 className="text-4xl font-semibold mb-8">
        Search results for &quot;
        {searchParams.get('query')
          ? searchParams.get('query')
          : searchParams.get('genre')}
        &quot;
      </h1>
      {data ? (
        <div className="flex flex-col gap-4">
          {data?.map((r) => {
            return (
              <a
                key={r.id}
                className="cursor-pointer"
                href={`/watch/${encodeURIComponent(
                  encodeNumber(
                    Number(r.id),
                    process.env.NEXT_PUBLIC_SECRET_KEY as string
                  )
                )}/episode-1`}
              >
                <div className="flex gap-2 hover:bg-slate-400/30 rounded-md duration-200">
                  {r.cover ? (
                    <Image
                      src={r.cover}
                      alt={r.title.english}
                      height={2024}
                      width={2024}
                      className="object-cover h-[130px] max-h-[130px] w-[200px] rounded-md"
                    />
                  ) : null}
                  <div>
                    <h1 className="font-medium text-xl">
                      {(r.title.english
                        ? r.title.english
                        : r.title.romaji
                        ? r.title.romaji
                        : r.title.native
                      )?.slice(0, 30)}
                      {(r.title.english
                        ? r.title.english
                        : r.title.romaji
                        ? r.title.romaji
                        : r.title.native
                      )?.length > 30
                        ? '...'
                        : ''}
                    </h1>
                    <h1 className="text-lg text-gray-300">
                      {r.title.romaji?.slice(0, 30)}
                      {r.title.romaji?.length > 30 ? '...' : ''}
                    </h1>
                    <h1>
                      {r.type} •{' '}
                      <span
                        style={{
                          color: generateColorByStatus(r.status as StatusType),
                        }}
                      >
                        {r.status}
                      </span>{' '}
                      • {r.totalEpisodes}
                    </h1>
                  </div>
                </div>
              </a>
            );
          })}
          {renderPagination()}
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <Suspense>
      <S />
    </Suspense>
  );
}
