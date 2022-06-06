const express = require("express");
const session = require("express-session");

let user = null;

/* Initialize Express */
const app = express();
app.use(express.json({limit: "50mb", extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    next();
});
app.use(session({
    secret: "wA531Y0qA3dhU8lxHElEhmomOM7P42WA",
    saveUninitialized: false,
    proxy: false,
    cookie: {
        path: "/",
        httpOnly: false,
        secure: false,
        maxAge: null
    },
    resave: false,
    name: "sessionAuth"
}));


/* Listen for connection on port 2827 */
let server = app.listen("2827", () => {
	console.log("server has started listening to port 2827");
});

/* Defines the route for authenticating a user */
app.post("/auth", express.json({ type: "*/*" }), (req, res) => {
	if (req.body.email === user.email && req.body.pwd === user.pwd) {
		req.session.email = req.body.email;
		req.session.key = user.pwd;
		req.session.authed = true;
		res.send(JSON.stringify({error: null}));
	} else {
		res.send(JSON.stringify({error: "failed authentication"}));
	}
});

/* Defines the /user route for creating users */
app.post("/user", express.json({ type: "*/*" }), (req, res) => {
	user = {
		email: req.body.email,
		pwd: req.body.pwd,
		theme: "lightmode",
		index: {
			objectType: "index",
			futureLogs: [],
			collections: []

		},
		dailyLogs: [],
		monthlyLogs: [],
		futureLogs: [],
		trackers: [],
		collections: [],
		imageBlocks: [],
		audioBlocks: [],
		textBlocks: [],
		events: [],
		tasks: [],
		signifiers: [
			{
				id: "kflnsdlkfnsdklnflkanlkfdnsa",
				objectType: "signifier",
				meaning: "general",
				symbol: "&#x1F7E0;"
			}
		]
	};
	req.session.authed = true;
	req.session.email = req.body.email;
	req.session.key = req.body.pwd;
	res.send(JSON.stringify(user));
});

/* Defines the /user route for querying user info */
app.get("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
        res.send(JSON.stringify(user));
    } else {
        res.send(JSON.stringify({ error: "failed authentication" }));
    }
});

/* Defines the /user route for updating user information */
app.put("/user", express.json({ type: "*/*" }), (req, res) => {
    if (req.session.authed) {
		res.send(JSON.stringify(user));
    } else {
        res.send(JSON.stringify({ error: "failed authentication" }));
    }
});

/* Defines the /user route for deleting a user */
app.delete("/user", express.json({ type: "*/*" }), (req, res) => {
    console.log("Started Deleting");
    if (req.session.authed) {
        res.send(JSON.stringify(user));
		user = null;
		server.close();
    } else {
        res.send(JSON.stringify({ error: "failed authentication" }));
    }
});
