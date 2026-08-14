/// <reference types="node" />

import aliasPlugin from '@rollup/plugin-alias'
import commonjsPlugin from '@rollup/plugin-commonjs'
import injectPlugin from '@rollup/plugin-inject'
import jsonPlugin from '@rollup/plugin-json'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { importMetaUrlAssets as importMetaUrlAssetsPlugin } from './scripts/import-meta-url-asset.mjs'
import cleanPlugin from '@rollup-extras/plugin-clean'
import { fileURLToPath } from 'node:url'
import { relative } from 'node:path'

/**
 * @param {string | URL} specifier
 */
function resolve(specifier) {
  return fileURLToPath(new URL(specifier, import.meta.url))
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: './index.js',
  output: {
    dir: 'dist',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
    assetFileNames: '[name][extname]',
    format: 'es',
    sourcemap: true,
    plugins: [
      terser({
        ecma: 2020,
        module: true,
        format: { comments: false },
        compress: { passes: 5 },
        mangle: true
      })
    ],
    // preserveModules: true
  },
  external: [
    'jssha',
    'readable-stream',
    'unenv/node/buffer',
    'unenv/node/events',
    'unenv/node/net',
  ],
  plugins: [
    cleanPlugin(),
    commonjsPlugin({
      ignoreTryCatch: (id) => {
        console.log('ignoreTryCatch', id)
        return false
      },
      ignoreGlobal: true,
      esmExternals: (id) => {
        if (id.startsWith('unenv/')) {
          return true;
        }

        console.log('esmExternals', id)
        return false
      },
      requireReturnsDefault: (id) => {
        if (id === 'unenv/node/events') {
          return true;
        }

        if (id.startsWith('unenv/')) {
          return 'namespace';
        }

        const relativePath = relative(import.meta.dirname, id).replaceAll('\\', '/')
        if (relativePath === 'browser/assert.js') {
          return true;
        }

        if (
          relativePath.startsWith('browser/') ||
          relativePath.startsWith('lib/') ||
          relativePath.startsWith('index.js') ||
          relativePath.includes('node_modules/unenv')
        ) {
          return 'namespace'
        }

        console.log('requireReturnsDefault', id, relativePath)
        return false
      },
      transformMixedEsModules: true,
      defaultIsModuleExports: false,
      strictRequires: false
    }),
    replace({
      values: {
        __filename: JSON.stringify(undefined),

        'process.env.BROWSER': JSON.stringify(true),

        // web/websocket/util.js
        'process.versions.icu': JSON.stringify('75.1')
      },
      preventAssignment: true,
      delimiters: ['', '']
    }),
    aliasPlugin({
      entries: [
        {
          find: /^(node:)?assert$/,
          replacement: resolve('./browser/assert.js')
        },
        {
          find: /^(node:)?buffer$/,
          replacement: 'unenv/node/buffer'
        },
        {
          find: /^node:async_hooks$/,
          replacement: resolve('./browser/async_hooks.js')
        },
        {
          find: /^node:crypto$/,
          replacement: resolve('./browser/crypto.js')
        },
        {
          find: /^node:diagnostics_channel$/,
          replacement: resolve('./browser/diagnostics_channel.js')
        },
        {
          find: /^(node:)?events$/,
          replacement: 'unenv/node/events'
        },
        {
          find: /^node:http$/,
          replacement: resolve('./browser/http.js')
        },
        {
          find: /^node:net$/,
          replacement: 'unenv/node/net'
        },
        {
          find: /^node:perf_hooks$/,
          replacement: resolve('./browser/perf_hooks.js')
        },
        {
          find: /^node:querystring$/,
          replacement: resolve('./browser/querystring.js')
        },
        {
          find: /^(node:)?stream\/web$/,
          replacement: resolve('./browser/stream/web.js')
        },
        {
          find: /^node:tls$/,
          replacement: resolve('./browser/tls.js')
        },
        {
          find: /^node:url$/,
          replacement: resolve('./browser/url.js')
        },
        {
          find: /^node:worker_threads$/,
          replacement: resolve('./browser/worker_threads.js')
        },
        {
          find: /^node:zlib$/,
          replacement: resolve('./browser/zlib.js')
        },
        {
          find: /^(node:)?stream$/,
          replacement: 'readable-stream'
        },
        {
          find: /^node:util$/,
          replacement: resolve('./browser/util.js')
        },
        {
          find: /^node:util\/types$/,
          replacement: resolve('./browser/util_types.js')
        }
      ]
    }),
    nodeResolvePlugin({ browser: true, preferBuiltins: false }),
    injectPlugin({
      modules: {
        Buffer: ['unenv/node/buffer', 'Buffer'],
        process: resolve('./browser/process.js'),
        global: resolve('./browser/global.js'),
        setTimeout: [resolve('./browser/set-timeout.js'), 'setTimeout'],
        clearTimeout: [resolve('./browser/set-timeout.js'), 'clearTimeout'],
        setImmediate: [resolve('./browser/set-immediate.js'), 'setImmediate'],
        clearImmediate: [resolve('./browser/set-immediate.js'), 'clearImmediate']
      }
    }),
    jsonPlugin({ preferConst: true, compact: true }),
    importMetaUrlAssetsPlugin()
  ]
}
