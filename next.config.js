const { hostname } = require('os')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ]
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(txt|md)$/,
            type: "asset/source"
        })
        return config
    }
}

module.exports = nextConfig
