const webpack = require('webpack')
const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
var website = {
    publicPath: "./"   
}
module.exports = {
    mode: 'production',
    // 线上 production cheap-module-source-map
    // 开发 development cheap-module-eval-source-map
    devtool: 'cheap-module-source-map',
    //出口文件的配置
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js',
        publicPath:website.publicPath
    },
    //插件，用于生产模板和各项功能,
    plugins:[
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        })
        // new PurifyCSSPlugin({
        //     // Give paths to parse for rules. These should be absolute!
        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),
        // })
    ],
    
}