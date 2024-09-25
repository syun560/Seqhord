const { hostname } = require('os')
const { protocols } = require('superagent')

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
    }
}

module.exports = nextConfig
