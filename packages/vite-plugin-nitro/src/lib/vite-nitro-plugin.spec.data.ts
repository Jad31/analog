import { NitroConfig } from 'nitropack';
import { ConfigEnv, UserConfig, Plugin } from 'vite';
import { Mock, vi } from 'vitest';
import * as path from 'path';

export const mockViteDevServer = {
  middlewares: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    use: () => {},
  },
};

export const mockNitroConfig: NitroConfig = {
  buildDir: path.resolve('./dist/.nitro'),
  handlers: [],
  logLevel: 0,
  output: {
    dir: path.resolve('dist/analog'),
    publicDir: path.resolve('dist/analog/public'),
  },
  rootDir: '.',
  runtimeConfig: {},
  scanDirs: ['src/server'],
  srcDir: 'src/server',
  prerender: {
    crawlLinks: undefined,
  },
  typescript: {
    generateTsConfig: false,
  },
  rollupConfig: {
    plugins: [
      {
        name: 'analogjs-vite-plugin-nitro-rollup-page-endpoint',
        transform() {},
      },
    ],
  },
};

export async function mockBuildFunctions() {
  const buildServerImport = await import('./build-server');
  const buildServerImportSpy = vi.fn();
  buildServerImport.buildServer = buildServerImportSpy;

  const buildSSRAppImport = await import('./build-ssr');
  const buildSSRAppImportSpy = vi.fn();
  buildSSRAppImport.buildSSRApp = buildSSRAppImportSpy;

  const buildSitemapImport = await import('./build-sitemap');
  const buildSitemapImportSpy = vi.fn();
  buildSitemapImport.buildSitemap = buildSitemapImportSpy;

  return { buildSSRAppImportSpy, buildServerImportSpy, buildSitemapImportSpy };
}

export async function runConfigAndCloseBundle(plugin: Plugin[]): Promise<void> {
  await (
    plugin[1].config as (
      config: UserConfig,
      env: ConfigEnv
    ) => Promise<UserConfig>
  )({}, { command: 'build' } as ConfigEnv);
  await (plugin[1].closeBundle as () => Promise<void>)();
}
