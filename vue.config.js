const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')

const { gitDescribe, gitDescribeSync } = require('git-describe')
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILDTIME = (new Date()).toISOString()
process.env.VUE_APP_BUILD = `v${process.env.VUE_APP_VERSION}-${process.env.VUE_APP_GIT_HASH}-${process.env.VUE_APP_BUILDTIME}`
const injectStr = `const BUILD_VERSION = '${process.env.VUE_APP_BUILD}';\n`;

module.exports = {
    configureWebpack: config => {},
    chainWebpack: config => {

        if (process.env.NODE_ENV === 'production') {
            config.plugins.delete('preload');
            config.plugins.delete('prefetch');
            config.optimization.minimize(true);
            config.optimization.splitChunks({
                chunks: 'async'
            })

            config.plugin('InjectManifest')
                .use(InjectManifest, [{
                    swSrc: './src/sw-manifest.js',
                    compileSrc: false,
                    maximumFileSizeToCacheInBytes: 99999999
                }])

            config.plugin('sw-copy')
                .use(require('copy-webpack-plugin'), [
                    [{
                        from: 'src/sw.js',
                        to: 'sw.js',
                        transform(content, path) {
                            return injectStr + content;
                        },
                    }]
                ])

            config.plugin('FaviconsWebpackPlugin')
                .use(FaviconsWebpackPlugin, [{
                    inject: true,
                    cache: true,
                    mode: 'webapp',
                    devMode: 'webapp',
                    prefix: './img/icons',
                    outputPath: './img/icons',
                    publicPath: './',
                    logo: "./src/assets/logoOCA.png",
                    favicons: {
                        appName: "海域整合資訊",
                        appShortName: "海域整合資訊",
                        appDescription: "海域遊憩活動一站式資訊平臺",
                        lang: "zh-Hant",
                        developerName: "詮華",
                        display: "standalone",
                        manifestRelativePaths: "./",
                        start_url: `../../`,
                        scope: `../../`, // because 'prefix' == './img/icons'
                        icons: {
                            // Platform Options:
                            // - offset - offset in percentage
                            // - background:
                            //   * false - use default
                            //   * true - force use default, e.g. set background for Android icons
                            //   * color - set background for the specified icons
                            //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
                            //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
                            //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
                            //
                            android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            coast: false,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                            yandex: false,                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                        },
                    }
                }])
        }
        config.module.rule('pug')
            .test(/\.pug$/)
            .use('pug-html-loader')
            .loader('pug-html-loader')
            .end()
        config.module.rule('worker')
            .test(/\.worker\.ts$/)
            .use('worker-loader')
            .loader('worker-loader')
            .end()
    },
    devServer: {
        disableHostCheck: true, // fix socket err
        writeToDisk: true
    },
    css: {
        loaderOptions: {
            sass: { // global style
                data: `@import "~@/custom.scss";`
            }
        }
    },
    publicPath: './',
}
