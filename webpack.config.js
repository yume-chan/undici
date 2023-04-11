const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    main: "./index.js",
  },
  target: "web",
  // mode: "development",
  mode: "production",
  devtool: "source-map",
  output: {
    clean: true,
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "umd",
    },
  },
  resolve: {
    alias: {
      buffer: require.resolve("./browser/buffer.js"),
    },
    fallback: {
      async_hooks: require.resolve("./browser/async_hooks.js"),
      diagnostics_channel: require.resolve("./browser/diagnostics_channel.js"),
      net: require.resolve("./browser/net.js"),
      perf_hooks: require.resolve("./browser/perf_hooks.js"),
      // "stream/web" must be before "stream"
      "stream/web": require.resolve("./browser/stream/web.js"),
      tls: require.resolve("./browser/tls.js"),
      worker_threads: require.resolve("./browser/worker_threads.js"),
      zlib: require.resolve("./browser/zlib.js"),

      console: require.resolve("console-browserify"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      "node-buffer": require.resolve("buffer/"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("readable-stream"),
      string_decoder: require.resolve("string_decoder"),
      "util/types": require.resolve("util/support/types"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("./browser/process.js"),
    }),
  ],
};
