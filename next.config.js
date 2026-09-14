/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/clips/:path*',
        destination: 'http://127.0.0.1:8000/clips/:path*',
      },
      {
        source: '/thumbnails/:path*',
        destination: 'http://127.0.0.1:8000/thumbnails/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:8000/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig
