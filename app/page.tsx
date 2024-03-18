'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SlidingCard from './components/SlidingCard';
import { AnimeInfo, AnimeResult } from '@/utils/types';
import { generateIndex } from '@/utils/functions';
import SearchComponent from './components/Search';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [trending, setTrending] = useState<AnimeResult[] | null>(null);
  const [popular, setPopular] = useState<AnimeResult[] | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get('/api/trending?perPage=30');
        const data: AnimeInfo = response.data;
        setTrending(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await axios.get('/api/popular?perPage=30');
        const data: AnimeInfo = response.data;
        setPopular(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrending();
    fetchPopular();
  }, []);

  return (
    <div className="flex gap-[115px]">
      <div className="relative z-[312]">
        <Sidebar />
      </div>
      <div className="fixed">
        <div className="ml-[650px] mt-4">
          <SearchComponent />
        </div>
      </div>

      <div className="divider divider-vertical -ml-28 mx-0 h-screen"></div>

      {trending && popular ? (
        <div className="-ml-28 mt-20">
          <h1 className="text-3xl font-semibold">Trending Now</h1>
          <SlidingCard animeList={trending} />

          <h1 className="text-3xl font-semibold">All Time Popular</h1>
          <SlidingCard animeList={popular} />
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
