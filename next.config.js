/** @type {import('next').NextConfig} */
const isStaticExport = process.env.BUILD_STATIC_EXPORT === "true";
const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

const nextConfig = {
  reactStrictMode: true,

  // Use 'export' for Cloudflare Pages, 'standalone' for Docker/production with real API
  output: isStaticExport ? "export" : "standalone",

  // Disable image optimization for static export
  ...(isStaticExport && {
    images: {
      unoptimized: true,
    },
  }),

  // Only set outputFileTracingRoot for standalone builds
  ...(!isStaticExport && {
    outputFileTracingRoot: undefined,
  }),

  // Rewrites only work in standalone mode, not in static export
  ...(!isStaticExport && {
    async rewrites() {
      if (useMockApi) {
        return [];
      }

      return [
        {
          source: "/api/management/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/management/:path*`,
        },
      ];
    },
  }),
};

module.exports = nextConfig;
