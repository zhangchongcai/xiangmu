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
    mode: 'development',
    // 线上 production cheap-module-source-map
    // 开发 development cheap-module-eval-source-map
    devtool: 'cheap-module-eval-source-map',
    
    //出口文件的配置
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js',
        publicPath:website.publicPath
    },
    optimization: {
        usedExports: true
    },
    //插件，用于生产模板和各项功能,
    plugins:[
        new CleanWebpackPlugin(),
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
        }),
        new webpack.HotModuleReplacementPlugin([
            
        ]) //热模块替换
        // new PurifyCSSPlugin({
        //     // Give paths to parse for rules. These should be absolute!
        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),
        // })
    ],
    //配置webpack开发服务功能,
    devServer:{
        //设置基本目录结构
        contentBase: path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 8010,
        //默认打开浏览器
        open: true,
        hot: true,  
    },
    
}