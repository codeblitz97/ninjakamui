import { MetadataRoute } from 'next';

import { encodeNumber, getTrendingAnimeForSitemap } from '@/utils/functions';
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

  return [
    {
      url: `${process.env.NEXT_PUBLIC_THIS_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...animeEntries,
  ];
}
