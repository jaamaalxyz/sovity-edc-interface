/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker
  output: "standalone",
  async rewrites() {
    // Only add rewrites when using real API (not mock API)
    const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

    if (useMockApi) {
      // No rewrites needed for mock API
      return [];
    }

    // Rewrites for real API
    return [
      {
        source: "/api/management/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/management/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
