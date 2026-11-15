import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, PRODUCTS_DATA } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return PRODUCTS_DATA.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Silk Mode Fashion",
    };
  }

  return {
    title: `${product.name} | Silk Mode Fashion Surat`,
    description: product.description,
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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.slug, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
