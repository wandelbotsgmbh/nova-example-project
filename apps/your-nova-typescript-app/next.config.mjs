import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: This config file is evaluated at build time, not server runtime.
  // Any env variables used in here will not change after the build is complete.
  output: "standalone",

  // This somewhat cursed construction works around the lack of runtime env
  // variables; see entrypoint.sh
  basePath:
    process.env.NODE_ENV === "production"
      ? "/__REPLACE_ME_BASE_PATH__"
      : process.env.BASE_PATH || "",
  reactStrictMode: false,

  // Little dev niceness thing, redirect from / to base path
  redirects() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/",
            destination: process.env.BASE_PATH,
            basePath: false,
            permanent: false,
          },
        ]
      : []
  },

  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Load SVG as React components, adapted from https://react-svgr.com/docs/next/
    // Why? Because it allows us to style SVGs with CSS (e.g. keeping their color
    // consistent with adjacent text)

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Convert *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // Add the custom loader for .ws files
    config.module.rules.push({
      test: /\.ws$/i,
      type: 'asset/source',
    })

     // Add handling for .glb files
    config.module.rules.push({
      test: /\.glb$/i,
      type: 'asset/resource',
    })

    return config
  },

  // We already check this stuff in a separate pipeline step
  // so we don't want the nextjs build to do it
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
