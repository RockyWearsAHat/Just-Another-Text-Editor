const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: "development",
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    output: {
      filename: "[name].bundle.js",
      publicPath: "",
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "assets/[name].[hash][ext]",
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./index.html",
        title: "JATE",
        favicon: "./favicon.ico",
      }),
      new WebpackPwaManifest({
        name: "JATE",
        short_name: "JATE",
        description: "Just Another Text Editor",
        background_color: "#212426",
        theme_color: "#212426",
        start_url: "/",
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512, 1024],
            destination: path.join("icons"),
          },
        ],
        runtimeCaching: [
          {
            urlPattern: [/\/icons\/.*/i, /\/assets\/.*/i],
            handler: "CacheFirst",
            options: {
              cacheName: "local-images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      }),
      new InjectManifest({
        swSrc: path.join(__dirname, "./src-sw.js"),
        swDest: path.join(__dirname, "./dist/src-sw.js"),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.html$/i,
          exclude: /node_modules/,
          loader: "html-loader",
        },
        {
          test: /\.m?js$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.png$/i,
          type: "asset/resource",
        },
      ],
    },
  };
};
