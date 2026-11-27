import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlugFromDb, getRelatedProductsFromDb } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  if (!product) {
    return {
      title: "Product Not Found | Silk Mode Fashion",
    };
  }

  return {
    title: `${product.name} | Silk Mode Fashion Surat`,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Silk Mode Fashion`,
      description: product.description,
      images: [
        {
          url: product.images[0] || "/images/hero-banner-2.jpg",
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProductsFromDb(product.slug, product.category, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
