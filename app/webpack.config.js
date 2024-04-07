const path = require("path");

module.exports = {
  entry: {
    content: './src/index.tsx',
    dialog: './src/dialog.ts',
    header: './src/header.ts',
    shared: './src/shared.ts',
    parser: './src/Parser.ts',
    seekingAlphaParser: './src/Parsers/SeekingAlphaParser.ts',
    investingParser: './src/Parsers/InvestingParser.ts',
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