const CopyPlugin = require("copy-webpack-plugin");

/* eslint-disable */
module.exports = {
    entry: {
		"index": "./index.js",
		"login": "./login/login.js"
	},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.(otf|svg|png|jpe?g|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "public/resources/imported"
                    }
                }
            }
        ]
    },
	plugins: [
		new CopyPlugin({
            patterns: [{ from: "./localStorage/pouchdb-7.2.1.min.js" }, { from: "./components/datepicker.min.js" }, { from: "./public/resources", to: "public/resources"}, { from: "./public/fonts", to: "public/fonts" }]
        })
	]
}
/* eslint-enable */
