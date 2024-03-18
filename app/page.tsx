import { use } from 'react';
import axios from 'axios';
import SlidingCard from './components/SlidingCard';
import { AnimeInfo, AnimeResult } from '@/utils/types';
import SearchComponent from './components/Search';
import Sidebar from './components/Sidebar';

const fetchResult = async (type: 'popular' | 'trending') => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_THIS_URL}/api/${
        type === 'popular' ? 'popular' : 'trending'
      }?perPage=30`
    );
    const data: AnimeInfo = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default function Home() {
  const trending: AnimeResult[] = use(fetchResult('trending'))
    ?.results as AnimeResult[];
  const popular: AnimeResult[] = use(fetchResult('popular'))
    ?.results as AnimeResult[];

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
