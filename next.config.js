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
    },
    async headers() {
        return [
            {
                "source": "/",
                "headers": [
                    { "key": "Access-Control-Allow-Credentials", "value": "true" },
                    { "key": "Access-Control-Allow-Origin", "value": "http://localhost:50021" },
                    { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
                ]
            }
        ]
    },
}

module.exports = nextConfig
