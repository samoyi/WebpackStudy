"use strict";

module.exports = {
  devtool: 'source-map',
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  
  module:{
	loaders:[
		{
			test: /\.json$/,
			loader: "json-loader",
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
		},
	]  
  },
  
  devServer:{
	  contentBase: "./public",
	  colors: true,
	  historyApiFallback: true,
	  inline: true,
  },
}