var path = require("path");

module.exports = {
	entry: {
		"index": "./src/index.js"
	},
	output: {
		libraryTarget: "commonjs",
		path: path.join(__dirname, "lib/"),
		filename: "[name].js"
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
		]
	}
};