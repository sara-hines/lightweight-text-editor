const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');


module.exports = () => {
    return {
        mode: 'development',
        entry: {
            main: './src/js/index.js',
            install: './src/js/install.js',
            database: './src/js/database.js',
            editor: './src/js/editor.js',
            header: './src/js/header.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            // I ADDED THIS AND GAVE IT title: 'JATE'.
            new HtmlWebpackPlugin({
                template: './index.html',
                title: 'JATE'
            }),

            // Adds workbox plugin for a service worker
            new InjectManifest({
                swSrc: './src-sw.js',
                swDest: 'src-sw.js',
            }),

            // Adds workbox plugin for a manifest file.
            new WebpackPwaManifest({
                fingerprints: false,
                inject: true,
                name: 'JATE Text Editor',
                short_name: 'JATE',
                description: 'Light, fast, PWA text editor',
                background_color: '#225ca3',
                theme_color: '#225ca3',
                start_url: './',
                publicPath: './',
                icons: [
                    {
                        src: path.resolve('src/images/logo.png'),
                        sizes: [96, 128, 192, 256, 384, 512],
                        destination: path.join('assets', 'icons'),
                    },
                ],
            }),

        ],

        module: {
            // CSS loaders
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    // Use babel-loader in order to use ES6.
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
                        },
                    },
                },
            ],
        },
    };
};
