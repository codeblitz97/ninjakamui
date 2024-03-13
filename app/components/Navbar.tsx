'use client';

import Link from 'next/link';
import { useState } from 'react';

type Props = {
  colors: {
    popular: string;
    trending: string;
    home: string;
  };
};

export default function LeftNavbar({ colors }: Readonly<Props>) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-56">
      <h1 className="text-3xl font-bold mb-9">
        <Link href="/">
          Ninja<span className="text-blue-500">Kamui</span>
        </Link>
      </h1>
      <div className="flex flex-col text-xl font-semibold">
        <Link
          href="/"
          onMouseEnter={() => setHoveredId('home')}
          onMouseLeave={() => setHoveredId(null)}
          className={`rounded-md h-12 w-52 flex items-center duration-200 ${
            hoveredId === 'home' ? 'bg-slate-500/10' : ''
          }`}
        >
          <span style={{ color: hoveredId === 'home' ? colors.home : '' }}>
            Home
          </span>
        </Link>
        <Link
          href="/trending"
          onMouseEnter={() => setHoveredId('trending')}
          onMouseLeave={() => setHoveredId(null)}
          className={`rounded-md h-12 w-52 flex items-center duration-200 ${
            hoveredId === 'trending' ? 'bg-slate-500/10' : ''
          }`}
        >
          <span
            style={{ color: hoveredId === 'trending' ? colors.trending : '' }}
          >
            Trending
          </span>
        </Link>
        <Link
          href="/popular"
          onMouseEnter={() => setHoveredId('popular')}
          onMouseLeave={() => setHoveredId(null)}
          className={`rounded-md h-12 w-52 flex items-center duration-200 ${
            hoveredId === 'popular' ? 'bg-slate-500/10' : ''
          }`}
        >
          <span
            style={{ color: hoveredId === 'popular' ? colors.popular : '' }}
          >
            Popular
          </span>
        </Link>
      </div>
    </div>
  );
}
