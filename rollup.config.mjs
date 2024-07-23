import aliasPlugin from "@rollup/plugin-alias";
import commonjsPlugin from "@rollup/plugin-commonjs";
import injectPlugin from "@rollup/plugin-inject";
import jsonPlugin from "@rollup/plugin-json";
import nodeResolvePlugin from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { importMetaUrlAssets as importMetaUrlAssetsPlugin } from "./scripts/import-meta-url-asset.mjs";
// import cleanPlugin from "@rollup-extras/plugin-clean";
import { fileURLToPath } from "node:url";

function resolve(specifier) {
  return fileURLToPath(new URL(specifier, import.meta.url));
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "./index.js",
  output: {
    dir: "dist",
    entryFileNames: "[name].mjs",
    chunkFileNames: "[name].mjs",
    assetFileNames: "[name][extname]",
    format: "es",
    sourcemap: true,
    plugins: [
      terser({
        ecma: 2020,
        module: true,
        compress: { passes: 5 },
        mangle: false,
      }),
    ],
    preserveModules: true,
  },
  external: [
    "assert",
    "browserify-zlib",
    "buffer",
    "events",
    "jssha",
    "pako",
    "pako/*",
    "readable-stream",
    "string_decoder",
    "util",
    "util/support/types",
  ],
  plugins: [
    // cleanPlugin(),
    commonjsPlugin({
      ignoreTryCatch: false,
      ignoreGlobal: true,
      esmExternals: true,
      requireReturnsDefault: "auto",
      transformMixedEsModules: true,
    }),
    replace({
      values: {
        "process.env.BROWSER": JSON.stringify(true),
        "process.version": JSON.stringify("v20.0.0"),
        "process.versions.node": JSON.stringify("20.0.0"),
        "process.versions.icu": JSON.stringify("75.1"),
      },
      preventAssignment: true,
      delimiters: ["", ""],
    }),
    aliasPlugin({
      entries: [
        {
          find: /^(node:)?assert$/,
          replacement: resolve("./browser/assert.js"),
        },
        {
          find: /^(node:)?buffer$/,
          replacement: resolve("./browser/buffer.js"),
        },
        {
          find: /^node:async_hooks$/,
          replacement: resolve("./browser/async_hooks.js"),
        },
        {
          find: /^node:crypto$/,
          replacement: resolve("./browser/crypto.js"),
        },
        {
          find: /^node:diagnostics_channel$/,
          replacement: resolve("./browser/diagnostics_channel.js"),
        },
        {
          find: /^node:events$/,
          replacement: resolve("./browser/events.js"),
        },
        {
          find: /^node:http$/,
          replacement: resolve("./browser/http.js"),
        },
        {
          find: /^node:http2$/,
          replacement: resolve("./browser/http2.js"),
        },
        {
          find: /^node:net$/,
          replacement: resolve("./browser/net.js"),
        },
        {
          find: /^node:perf_hooks$/,
          replacement: resolve("./browser/perf_hooks.js"),
        },
        {
          find: /^node:querystring$/,
          replacement: resolve("./browser/querystring.js"),
        },
        {
          find: /^(node:)?stream\/web$/,
          replacement: resolve("./browser/stream/web.js"),
        },
        {
          find: /^node:tls$/,
          replacement: resolve("./browser/tls.js"),
        },
        {
          find: /^node:url$/,
          replacement: resolve("./browser/url.js"),
        },
        {
          find: /^node:worker_threads$/,
          replacement: resolve("./browser/worker_threads.js"),
        },
        {
          find: /^node:zlib$/,
          replacement: resolve("./browser/zlib.js"),
        },
        {
          find: /^(node:)?stream$/,
          replacement: "readable-stream",
        },
        {
          find: /^node:string_decoder$/,
          replacement: "string_decoder",
        },
        {
          find: /^node:util$/,
          replacement: "util",
        },
        {
          find: /^node:util\/types$/,
          replacement: "util/support/types",
        },
      ],
    }),
    nodeResolvePlugin({ browser: true, preferBuiltins: false }),
    injectPlugin({
      modules: {
        Buffer: ["buffer", "Buffer"],
        process: resolve("./browser/process.js"),
        global: resolve("./browser/global.js"),
        setImmediate: resolve("./browser/set-immediate.js"),
        clearImmediate: resolve("./browser/clear-immediate.js"),
      },
    }),
    jsonPlugin({ preferConst: true, compact: true }),
    importMetaUrlAssetsPlugin(),
  ],
};
