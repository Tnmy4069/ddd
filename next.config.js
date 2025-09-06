/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['socket.io'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/socket.io/:path*',
        destination: '/api/socketio/:path*',
      },
    ];
  },
};

export default nextConfig;
