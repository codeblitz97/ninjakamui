'use client';

import Link from 'next/link';
import { useState } from 'react';

type Props = {
  colors: {
    popular: string;
    trending: string;
    home: string;
  };
  active: 'Home' | 'Trending' | 'Popular';
};

export default function LeftNavbar({ colors, active }: Readonly<Props>) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="sidebar h-full justify-start -ml-2 bg-transparent">
      <section className="sidebar-title items-center p-4">
        <Link href={'/'} className="text-3xl font-bold">
          Ninja<span className="text-blue-500">Kamui</span>
        </Link>
      </section>
      <section className="sidebar-content h-fit min-h-[20rem] overflow-visible">
        <nav className="menu rounded-md">
          <section className="menu-section px-4">
            <span className="menu-title">Main menu</span>
            <ul className="menu-items">
              <li
                className={`menu-item ${
                  active === 'Home' ? 'menu-active cursor-not-allowed' : ''
                }`}
                onMouseEnter={() => setHoveredId('home')}
                onMouseLeave={() => setHoveredId(null)}
              >
                {active !== 'Home' ? (
                  <Link href={'/home'}>
                    <span
                      style={{
                        color: hoveredId === 'home' ? colors.home : '',
                      }}
                    >
                      Home
                    </span>
                  </Link>
                ) : (
                  <h1>
                    <span
                      style={{
                        color: hoveredId === 'home' ? colors.home : '',
                      }}
                    >
                      Home
                    </span>
                  </h1>
                )}
              </li>

              <li
                className={`menu-item ${
                  active === 'Trending' ? 'menu-active cursor-not-allowed' : ''
                }`}
                onMouseEnter={() => setHoveredId('trending')}
                onMouseLeave={() => setHoveredId(null)}
              >
                {active !== 'Trending' ? (
                  <Link href={'/trending'}>
                    <span
                      style={{
                        color: hoveredId === 'trending' ? colors.trending : '',
                      }}
                    >
                      Trending
                    </span>
                  </Link>
                ) : (
                  <h1>
                    <span
                      style={{
                        color: hoveredId === 'trending' ? colors.trending : '',
                      }}
                    >
                      Trending
                    </span>
                  </h1>
                )}
              </li>
              <li
                className={`menu-item ${
                  active === 'Popular' ? 'menu-active cursor-not-allowed' : ''
                }`}
                onMouseEnter={() => setHoveredId('popular')}
                onMouseLeave={() => setHoveredId(null)}
              >
                {active !== 'Popular' ? (
                  <Link href={'/popular'}>
                    <span
                      style={{
                        color: hoveredId === 'popular' ? colors.popular : '',
                      }}
                    >
                      Popular
                    </span>
                  </Link>
                ) : (
                  <h1>
                    <span
                      style={{
                        color: hoveredId === 'popular' ? colors.popular : '',
                      }}
                    >
                      Popular
                    </span>
                  </h1>
                )}
              </li>
            </ul>
          </section>
        </nav>
      </section>
    </div>
  );
}
