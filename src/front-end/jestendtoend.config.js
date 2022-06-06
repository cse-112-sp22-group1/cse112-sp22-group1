module.exports = async () => ({
        "preset": "jest-puppeteer",
        "verbose": true,
        "rootDir": "./__tests__",
        "transform": {
            "\\.[jt]sx?$": "babel-jest"
        }
    });
