import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "ichab-pro-production-e3e8.up.railway.app",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "ichab-pro.onrender.com",
        pathname: "/media/**",
      },
      {
        // Cloudflare R2 public bucket domain (media storage)
        protocol: "https",
        hostname: "pub-2a9e79f8cd1948a0adad7ea2ef7b40c7.r2.dev",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api"}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
