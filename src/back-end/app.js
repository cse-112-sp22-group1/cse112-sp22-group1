require("dotenv").config();
const express = require("express");
const session = require("express-session");
const constants = require(`${__dirname}/constants.js`)
const deleteUser = require(`${__dirname}/deleteFiles/deleteUser.js`);
const createUser = require(`${__dirname}/createFiles/createUser.js`);
const updateUser = require(`${__dirname}/updateFiles/updateUser.js`);
const readUser = require(`${__dirname}/readFiles/readUser.js`);
const security = require(`${__dirname}/security/securityFunctions.js`);

/* Initialize Express */
const app = express();
app.use(express.json({limit: "50mb", extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", constants.accessControlOrigin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#cors_and_caching */
    if (constants.accessControlOrigin !== "*") {
        res.header("Vary", "Origin");
    }
    next();
});
app.use(session({
    secret: constants.sessionSecret,
    saveUninitialized: false,
    proxy: constants.reverseProxy,
    cookie: constants.sessionCookieObject,
    resave: false,
    name: "sessionAuth"
}));

/**
 * Sends a server error.
 * @param {Response<any, Record<string, any>, number>} res The response to send on.
 * @param {*} err The error to send back.
 */
const sendServerError = (res, err) => {
    res.status(500);
    let errorObject = { error: "Something happened!" };
    if (err instanceof Error) {
        errorObject.error = err.message;
    }
    res.json(errorObject);
};

/**
 * Sends a forbidden error.
 *
 * @param {Response<any, Record<string, any>, number>} res The response to send on.
 */
const sendUnauthorizedError = (res) => {
    res.status(401);
    res.json({ error: "User is not authorized to access this resource." });
};

/* Defines the route for authenticating a user */
app.post("/auth", express.json({ type: "*/*" }), (req, res) => {
    security.authenticate(req.body).
        then((success) => {
            req.session.authed = success;
            if (req.session.authed) {
                req.session.email = req.body.email;
                try {
                    req.session.key = security.passHash(req.body.email + req.body.pwd);
                    res.json({ error: null });
                } catch (err) {
                    sendServerError(res, err);
                }
            } else {
                res.status(401);
                res.json({ error: "Authentication failed!" });
            }
        }).catch((err) => {
            sendServerError(res, err);
        });
});

/* Defines the /user route for creating users */
app.post("/user", express.json({ type: "*/*" }), (req, res) => {
    try {
        const key = security.passHash(req.body.email + req.body.pwd);
        createUser.createUser(req.body.email, req.body.pwd, key).
            then((user) => res.json(user)).
            catch((err) => sendServerError(res, err));
    } catch (err) {
        sendServerError(res, err);
    }
});

/* Defines the /user route for querying user info */
app.get("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        readUser.readUser(req.session.email, req.session.key).
            then((user) => res.json(user)).
            catch((err) => sendServerError(res, err));
    } else {
        sendUnauthorizedError(res);
    }
});

/* Defines the /user route for updating user information */
app.put("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        updateUser.updateUser(req.session.email, req.session.key, req.body).
            then((user) => res.json(user)).
            catch((err) => sendServerError(res, err))
    } else {
        sendUnauthorizedError(res);
    }
});

/* Defines the /user route for deleting a user */
app.delete("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        deleteUser.deleteUser(req.session.email).
            then((user) => {
                req.session.authed = false;
                delete req.session.email;
                delete req.session.key;
                res.json(user);
            }).catch((err) => sendServerError(res, err));
    } else {
        sendUnauthorizedError(res);
    }
});

/* Exports */
module.exports = app;
