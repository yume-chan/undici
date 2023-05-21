import commonjsPlugin from "@rollup/plugin-commonjs";
import nodeResolvePlugin from "@rollup/plugin-node-resolve";
import aliasPlugin from "@rollup/plugin-alias";
import injectPlugin from "@rollup/plugin-inject";
import jsonPlugin from "@rollup/plugin-json";
import terserPlugin from "@rollup/plugin-terser";
import { fileURLToPath } from "node:url";

function resolve(specifier) {
  return fileURLToPath(new URL(specifier, import.meta.url));
}

export default {
  input: { main: "./index.js" },
  output: {
    dir: "dist",
    // entryFileNames: "[name].mjs",
    // chunkFileNames: "[name].mjs",
    preserveModules: true,
    format: "es",
    sourcemap: true,
    plugins: [
      terserPlugin({
        ecma: 2020,
        compress: { ecma: 2020, toplevel: true, passes: 5, module: true },
        mangle: { module: true, toplevel: true },
        format: { comments: false, shorthand: true, indent_level: 4 },
      }),
    ],
  },
  plugins: [
    commonjsPlugin({
      ignoreTryCatch: false,
      ignoreGlobal: true,
      esmExternals: true,
      requireReturnsDefault: "auto",
      transformMixedEsModules: true,
    }),
    aliasPlugin({
      entries: [
        { find: /^buffer$/, replacement: resolve("./browser/buffer.js") },
        {
          find: /^async_hooks$/,
          replacement: resolve("./browser/async_hooks.js"),
        },
        {
          find: /^diagnostics_channel$/,
          replacement: resolve("./browser/diagnostics_channel.js"),
        },
        {
          find: /^net$/,
          replacement: resolve("./browser/net.js"),
        },
        {
          find: /^perf_hooks$/,
          replacement: resolve("./browser/perf_hooks.js"),
        },
        {
          find: /^stream\/web$/,
          replacement: resolve("./browser/stream/web.js"),
        },
        {
          find: /^tls$/,
          replacement: resolve("./browser/tls.js"),
        },
        {
          find: /^worker_threads$/,
          replacement: resolve("./browser/worker_threads.js"),
        },
        {
          find: /^zlib$/,
          replacement: resolve("./browser/zlib.js"),
        },
        {
          find: /^crypto$/,
          replacement: "crypto-browserify",
        },
        {
          find: /^http$/,
          replacement: "stream-http",
        },
        {
          find: /^querystring$/,
          replacement: "querystring-es3",
        },
        {
          find: /^stream$/,
          replacement: "readable-stream",
        },
        {
          find: /^string_decoder$/,
          replacement: "string_decoder",
        },
        {
          find: /^util\/types$/,
          replacement: "util/support/types",
        },
      ],
    }),
    nodeResolvePlugin({ browser: true, preferBuiltins: false }),
    injectPlugin({
      modules: {
        Buffer: ["buffer-es6", "Buffer"],
        process: resolve("./browser/process.js"),
        global: resolve("./browser/global.js"),
      },
    }),
    jsonPlugin({ preferConst: true, compact: true }),
  ],
};
