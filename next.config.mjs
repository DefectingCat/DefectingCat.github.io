// import NextBundleAnalyzer from '@next/bundle-analyzer';
//
// const withBundleAnalyzer = NextBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

const urlLoaderPath = 'url-loader';
const urlLoaderPathUrl = new URL(urlLoaderPath, import.meta.url).href;

const fileLoaderPath = 'file-loader';
const fileLoaderPathUrl = new URL(fileLoaderPath, import.meta.url).href;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone',
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.31.158',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/image.ts',
  },
  experimental: {
    webpackBuildWorker: true,
    mdxRs: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  webpack(config, { isServer }) {
    if (!isServer) {
      // We're in the browser build, so we can safely exclude the sharp module
      config.externals.push('sharp');
    }
    // audio support
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: urlLoaderPathUrl,
          options: {
            limit: config.inlineImageLimit,
            fallback: fileLoaderPathUrl,
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    });

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
};

const KEYS_TO_OMIT = [
  'webpackDevMiddleware',
  'configOrigin',
  'target',
  'analyticsId',
  'webpack5',
  'amp',
  'assetPrefix',
];

export default function finalConfig(_phase, { defaultConfig }) {
  // const plugins = [[withBundleAnalyzer, {}]];
  const plugins = [[(config) => config, {}]];

  const wConfig = plugins.reduce(
    (acc, [plugin, config]) => plugin({ ...acc, ...config }),
    {
      ...defaultConfig,
      ...nextConfig,
    },
  );

  const finalConfig = {};
  Object.keys(wConfig).forEach((key) => {
    if (!KEYS_TO_OMIT.includes(key)) {
      finalConfig[key] = wConfig[key];
    }
  });

  return finalConfig;
}
