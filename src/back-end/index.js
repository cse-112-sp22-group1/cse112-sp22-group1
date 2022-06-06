require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const constants = require(`${__dirname}/constants.js`)
const deleteUser = require(`${__dirname}/deleteFiles/deleteUser.js`);
const createUser = require(`${__dirname}/createFiles/createUser.js`);
const updateUser = require(`${__dirname}/updateFiles/updateUser.js`);
const readUser = require(`${__dirname}/readFiles/readUser.js`);
const security = require(`${__dirname}/security/securityFunctions.js`);

/* Initialize Express */
const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", constants.accessControlOrigin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#cors_and_caching */
    if (constants.accessControlOrigin !== "*") {
        res.header("Vary", "Origin");
    }
    next();
});
app.use(session({
    secret: constants.sessionSecret,
    saveUninitialized: false,
    cookie: constants.sessionCookieObject,
    resave: false,
    name: "sessionAuth"
}));

/* Connect to the database once in our startup code */
mongoose.connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

/* Listen for connection on port 2827 */
app.listen("2827", () => {
    console.log("server has started listening to port 2827");
});

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
const sendForbiddenError = (res) => {
    res.status(403);
    res.json({ error: "User is not authorized to access this resource." });
};

/* Defines the route for authenticating a user */
app.post("/auth", express.json({ type: "*/*" }), (req, res) => {
    security.authenticate(req.body).
        then((success) => {
            req.session.authed = success;
            if (req.session.authed) {
                req.session.email = req.body.email;
                req.session.key = security.passHash(security.encrypt(req.body.pwd, constants.sessionSecret));
                res.json({ error: null });
            } else {
                res.status(400);
                res.json({ error: "Authentication failed!" });
            }
        }).catch((err) => {
            sendServerError(res, err);
        });
});

/* Defines the /user route for creating users */
app.post("/user", express.json({ type: "*/*" }), (req, res) => {
    const passHash = security.passHash(req.body.pwd);
    const key = security.passHash(security.encrypt(passHash, constants.sessionSecret));
    createUser.createUser(req.body.email, req.body.pwd, key).
        then((user) => res.json(user)).
        catch((err) => sendServerError(res, err));
});

/* Defines the /user route for querying user info */
app.get("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        readUser.readUser(req.session.email, req.session.key).
            then((user) => res.json(user)).
            catch((err) => sendServerError(res, err));
    } else {
        sendForbiddenError(res);
    }
});

/* Defines the /user route for updating user information */
app.put("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        updateUser.updateUser(req.session.email, req.session.key, req.body).
            then((user) => res.json(user)).
            catch((err) => sendServerError(res, err))
    } else {
        sendForbiddenError(res);
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
        sendForbiddenError(res);
    }
});
