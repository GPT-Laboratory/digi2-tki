/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/sites',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    npm_package_name: process.env.npm_package_name,
    npm_package_version: process.env.npm_package_version,
  },
  basePath: '',
}

module.exports = nextConfig
