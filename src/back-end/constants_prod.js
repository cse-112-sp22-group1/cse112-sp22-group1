require("dotenv").config();

/**
 * Module defining constants to be used in production environments.
 */
module.exports = {
    accessControlOrigin: "https://boojo.bitfrost.app",
    sessionSecret: process.env.SESSION_SECRET,
    reverseProxy: true,
    sessionCookieObject: {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
