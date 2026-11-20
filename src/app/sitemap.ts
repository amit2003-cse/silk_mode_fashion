import type { MetadataRoute } from 'next';
import { PRODUCTS_DATA } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.silkmodefashion.in';

  // 1. Important public static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 2. Individual public product detail pages (75 unique products)
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS_DATA.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
