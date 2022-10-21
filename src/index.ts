import { createFilter, createLogger, Plugin, FilterPattern, ResolvedConfig } from 'vite';
import { promises as fsp } from 'node:fs';

const queryRE = /\?.*$/s;
const hashRE = /#.*$/s;
const cleanUrl = (url: string): string => url.replace(hashRE, '').replace(queryRE, '');

const isDebug = Boolean(process.env.DEBUG);
const logger = createLogger('info', { prefix: '[vite-raw-assets]', allowClearScreen: false });

interface InternalPluginConfig {
  enforce?: Plugin['enforce'],
  include?: FilterPattern,
  exclude?: FilterPattern,
}

export default function rawAssetsPlugin({ enforce = 'pre', include, exclude }: InternalPluginConfig = {}): Plugin {
  let config: ResolvedConfig;

  const filter = createFilter(include, exclude)

  return {
    name: 'vite-raw-assets',
    enforce,
    configResolved(resolvedConfig: ResolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },
    async load(id: string) {
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
