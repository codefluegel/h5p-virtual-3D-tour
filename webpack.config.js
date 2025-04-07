import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve as _resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.argv.includes('--mode=production') ? 'production' : 'development';
const libraryName = process.env.npm_package_name;

export default {
  mode: mode,
  entry: {
    dist: './entries/dist.js',
  },
  resolve: {
    alias: {
      '@components': _resolve(__dirname, 'scripts/components'),
      '@utils': _resolve(__dirname, 'scripts/utils'),
      '@h5phelpers': _resolve(__dirname, 'scripts/h5phelpers'),
      '@context': _resolve(__dirname, 'scripts/context'),
      '@styles': _resolve(__dirname, 'scripts/styles'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // if using TS
  },
  output: {
    path: _resolve(__dirname, 'dist'),
    filename: `${libraryName}.js`,
    clean: true,
  },
  target: ['browserslist'],
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${libraryName}.css`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: _resolve(__dirname, 'scripts'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s[ac]ss|css)$/,
        include: _resolve(__dirname, 'scripts'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: [_resolve(__dirname, 'scripts'), _resolve(__dirname, 'assets')],
        type: 'asset/resource',
      },
    ],
  },
  stats: {
    colors: true,
  },
  ...(mode !== 'production' && { devtool: 'eval-cheap-module-source-map' }),
};
