/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Prisma needs to be bundled on the server in Next.js 14
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
