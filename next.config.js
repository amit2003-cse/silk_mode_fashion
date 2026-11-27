/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "vastrang.in",
      },
      {
        protocol: "https",
        hostname: "pub-e469e267b4b049eda6d26e83f2ebe5a7.r2.dev",
      },
    ],
  },
};

export default nextConfig;

