import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
  ],
  server: {
    baseUrl: '/modern-js-deploy-csr',
  },
  output: {
    minify: false,
    assetPrefix: '/modern-js-deploy-csr/',
  },
});
