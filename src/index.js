import { createFilter, createLogger } from 'vite';
import { promises as fsp } from 'node:fs';

const queryRE = /\?.*$/s;
const hashRE = /#.*$/s;
const cleanUrl = (url) => url.replace(hashRE, '').replace(queryRE, '');

const isDebug = process.env.DEBUG;
const logger = createLogger('info', { prefix: '[vite-raw-assets]', allowClearScreen: false });

export default function rawAssetsPlugin({ enforce = 'pre', include, exclude } = {}) {
  let config;

  const filter = createFilter(include, exclude)

  return {
    name: 'vite-raw-assets',
    enforce,
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },
    async load(id) {
      if (id.startsWith('\0')) {
        // Rollup convention, this id should be handled by the
        // plugin that marked it with \0
        return null;
      }

      const file = cleanUrl(id);

      if (!config.assetsInclude(file) || !filter(file)) {
        // Nothing to do if it's not an asset or doesn't pass the filter
        return null;
      }

      if (isDebug) {
        logger.info(`loading ${file}`, { timestamp: true });
      }

      // raw query, read file and return as string
      return `export default ${JSON.stringify(await fsp.readFile(file, 'utf-8'))}`;
    }
  }
}
