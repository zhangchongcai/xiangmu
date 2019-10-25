module.exports = {
	//入口文件的配置项
    entry: {
        entry:'./src/entry.js'
    },
    //模块：例如解读css，图片如何转换，压缩
    module: {
        /**
         * {loader: 'css-loader',options: {importLoaders: 2}},  //2代表css-loader后还需要几个loader
         * {loader: 'postcss-loader',options:{plugins:[require("autoprefixer")("last 100 versions")]}},
         */
        rules:[
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,   
                    {
                        loader: 'css-loader',
                        options:{
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options:{
                            plugins: [require('autoprefixer')('last 100 versions')]
                        }
                    },
                    'sass-loader'
                    ]
            }, { //图片打包base64
                test:/\.(png|jpg}gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        name: '[name]_[hash].[ext]',
                        limit:5000,
                        outputPath:'images/'
                    }
                }]
            }, {  //用于html标签引用路径问题
                test: /\.(html|htm)$/i,
                use: ['html-withimg-loader']
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            }, {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
                exclude:/node_modules/
            }, {  //用于iconfont
                test: /\.(eot|woff|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath:'css/'
                    }
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}