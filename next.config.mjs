/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote logos/screenshots. Loosened for MVP; tighten to specific hosts before scale.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // Do not fail production builds on lint; lint runs separately in CI / `npm run lint`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
