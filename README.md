# vite-plugin-raw-assets

Vite plugin to load assets as strings.

Usefull to deal with third-party libraries that expect to import assets as strings but doesn't add `?raw` to import URL.

It's similar to [raw-loader](https://www.npmjs.com/package/raw-loader) in Webpack.

[![NPM version](https://img.shields.io/npm/v/vite-plugin-raw-assets.svg)](https://www.npmjs.com/package/vite-plugin-raw-assets)
[![NPM Downloads](https://img.shields.io/npm/dm/vite-plugin-raw-assets.svg)](https://www.npmjs.com/package/vite-plugin-raw-assets)

## Why vite-plugin-raw-assets

Suppose we have a library called `some-lib` with the following import:

```
import refreshSvgstr from './style/icons/refresh.svg';
```

The library expect `refreshSvgstr` to be a string but vite will assign the asset URL.

This plugin helps to deal with this situation.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v16.0.0+) and Vite v3.0.0+.

## Install

```sh
npm i vite-plugin-raw-assets -D
```

## Usage

vite.config.ts

```js
import rawAssets from 'vite-plugin-raw-assets';

export default {
  plugins: [
    rawAssets({
      include: '**/some-lib/**/*.svg'
    }),
  ],
}
```

## Considerations

This plugin only work on assets. It uses [assetsInclude](https://vitejs.dev/config/shared-options.html#assetsinclude) to decide if a file is an asset or not.

## Options

`rawAssets(config: Configuration)`

```ts
export interface Configuration {
  /**
   * Options passed to @rollup/pluginutils's createFilter.
   * The plugin only load files that pass the created filter.
   *
   * See https://github.com/rollup/plugins/tree/master/packages/pluginutils#include-and-exclude
   */
  include?: String | RegExp | Array[...String|RegExp]
  exclude?: String | RegExp | Array[...String|RegExp]
}
```
