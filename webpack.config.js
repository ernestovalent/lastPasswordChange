const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
/** @type {import('webpack').Configuration} */

module.exports = {
  entry: './src/run.js',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'lassPassword',
      type: 'commonjs'
    }
  },
  node: {
    __dirname: true,
  },
  optimization: {
    minimize: false,
  },
/*    module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }, */
  plugins: [
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true
        },
        output: {
          comments: false
        }
      }
    }),
  ]
}