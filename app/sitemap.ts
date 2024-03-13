import { ConsumetAnimeData } from '@/utils/types';
import axios from 'axios';
import { MetadataRoute } from 'next';

const getTrendingAnime = async () => {
  const response = await axios.get('/api/trending?perPage=24');
  const data = response.data;
  return data.results;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const anime = await getTrendingAnime();
  const animeEntries: MetadataRoute.Sitemap = anime.map(
    ({ id, title }: ConsumetAnimeData) => ({
      url: `${process.env.NEXT_PUBLIC_THIS_URL}/watch/${title.english}/${id}`,
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
