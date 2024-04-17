const path = require("path");

module.exports = {
  entry: {
    background: './src/background.ts',
    content: './src/index.tsx',
    dialog: './src/Dialog/dialog.ts',
    shared: './src/shared.ts',
    parser: './src/Parsers/Parser.ts',
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