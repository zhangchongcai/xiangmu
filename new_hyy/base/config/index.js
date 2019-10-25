'use strict';
// Template version: 1.2.8
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {
    // assetsSubDirectory: '/',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    host: '127.0.0.1',
    port: 8021,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    env: require('./prod.env'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    // assetsPublicPath: '/',
    assetsPublicPath: './',
    assetsSubDirectory: 'static',
    // assetsSubDirectory: '/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
