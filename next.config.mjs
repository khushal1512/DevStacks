/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        mdxRs: true,
        serverComponentsExternalPackages: ['mongoose'],
    }
};
module.exports = {
    eslint: {
      ignoreDuringBuilds: true,
    },
  };

export default nextConfig;
