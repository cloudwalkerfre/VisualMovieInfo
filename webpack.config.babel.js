import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const stylusLoader = ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!stylus-loader"});

export default {
  entry: [
    './entry.js'
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new ExtractTextPlugin("style.css"),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   comments: false
    // })
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query:{
          presets: ['es2015', 'react', 'stage-1'],
          plugins:[
            'transform-decorators-legacy',
            [
              'import',
              {
                "libraryName": "antd",
                "style": true,
              }
            ]
          ]
        },
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.styl$/,
        loader: stylusLoader
      },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'url-loader'
      }
  ]}
};
