import { MetadataRoute } from 'next';

import {
  Top100AnilistForSitemaps,
  encodeNumber,
  getTrendingAnimeForSitemap,
} from '@/utils/functions';
import { AnimeResult } from '@/utils/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const anime = await getTrendingAnimeForSitemap();
  const animeEntries: MetadataRoute.Sitemap = (anime as AnimeResult[]).map(
    ({ id, title }: AnimeResult) => ({
      url: `${process.env.NEXT_PUBLIC_THIS_URL}/watch/${encodeURIComponent(
        encodeNumber(Number(id), process.env.NEXT_PUBLIC_SECRET_KEY as string)
      )}/episode-1`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
  );

  const top100Trending = await Top100AnilistForSitemaps();

  const top100: MetadataRoute.Sitemap = (top100Trending as AnimeResult[]).map(
    (a) => {
      return {
        url: `${process.env.NEXT_PUBLIC_THIS_URL}/watch/${encodeURIComponent(
          encodeNumber(
            Number(a.id),
            process.env.NEXT_PUBLIC_SECRET_KEY as string
          )
        )}/episode-1`,
        lastModified: new Date(),
      };
    }
  );

  return [
    {
      url: `${process.env.NEXT_PUBLIC_THIS_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...animeEntries,
    ...top100,
  ];
}
