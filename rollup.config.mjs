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

const SimulateFullBundle = process.env.SIMULATE_FULL_BUNDLE === 'true'

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
        format: { comments: SimulateFullBundle ? false : true },
        compress: { passes: 5 },
        mangle: SimulateFullBundle ? true : false,
      })
    ],
    preserveModules: true
  },
  external: SimulateFullBundle ? [] : [
    'buffer',
    'events',
    'jssha',
    'readable-stream'
  ],
  plugins: [
    cleanPlugin(),
    commonjsPlugin({
      ignoreTryCatch: (id) => {
        console.log('ignoreTryCatch', id)
        return false
      },
      ignoreGlobal: true,
      esmExternals: false,
      requireReturnsDefault: (id) => {
        const relativePath = relative(import.meta.dirname, id).replaceAll('\\', '/')
        if (relativePath === 'browser/assert.js' || relativePath === 'browser/events.js') {
          return true;
        }

        if (
          relativePath.startsWith('browser/') ||
          relativePath.startsWith('lib/') ||
          relativePath.startsWith('index.js')
        ) {
          return 'namespace'
        }

        return false
      },
      transformMixedEsModules: true,
      defaultIsModuleExports: false,
      strictRequires: 'auto'
    }),
    replace({
      values: {
        __filename: JSON.stringify(undefined),

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
          find: /^node:buffer$/,
          replacement: resolve('./browser/buffer.js')
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
          find: /^node:events$/,
          replacement: resolve('./browser/events.js')
        },
        {
          find: /^node:http$/,
          replacement: resolve('./browser/http.js')
        },
        {
          find: /^node:net$/,
          replacement: resolve('./browser/net.js')
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
        Buffer: ['buffer', 'Buffer'],
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
