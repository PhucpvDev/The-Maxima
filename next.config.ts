const withNextIntl = require('next-intl/plugin')('./src/i18n.config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'maximagoldhedging.com', 
        }],
        unoptimized: true,
      },
}

module.exports = withNextIntl(nextConfig)