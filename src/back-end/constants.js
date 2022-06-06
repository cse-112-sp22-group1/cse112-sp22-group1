/**
 * Module defining constants to be used in test environments.
 */
module.exports = {
    accessControlOrigin: "http://localhost:8080",
    sessionSecret: "wA531Y0qA3dhU8lxHElEhmomOM7P42WA",
    reverseProxy: false,
    sessionCookieObject: {
        path: "/",
        httpOnly: false,
        secure: false,
        maxAge: null
    }
};
