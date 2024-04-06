const path = require("path");

module.exports = {
  entry: {
    content: './src/index.tsx',
    investingParser: './src/Investing/InvestingParser.ts',
    parser: './src/Parser.ts',
    dialog: './src/dialog.ts',
    header: './src/header.ts',
    seekingAlphaParser: './src/SeekingAlpha/SeekingAlphaParser.ts',
    shared: './src/shared.ts',
    messageBroker: './src/messageBroker.ts',
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "..", "ext"),
  },
};