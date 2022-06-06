/* eslint-disable */
module.exports = async () => ({
    "verbose": true,
	"rootDir": "./",
    "roots": ["./__tests__", "./"],
    "transform": {
		"\\.[jt]sx?$": "babel-jest"
	},
	"globals": {
		"window": {
			"location": {
				"hostname": "localhost:8080"
			}
		}
	}
});
/* eslint-enable */
