/**
 * User Creation Functions
 * @namespace createUser
 */
require("dotenv").config();
const security = require(`${__dirname}/../security/securityFunctions.js`);
const schema = require(`${__dirname}/../schema.js`);

/**
 * Makes and returns a randomly generated id of length 30.
 * @return Returns the randome generated id of length 30.
 */
const makeid = () => {
	let length = 30;
	let result = [];
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join("");
}

/* eslint-disable no-useless-escape */
/**
 * Validates a string if it is a proper email
 *
 * @param {String} email The email of the user
 * @returns true if valid email, otherwise false
 */
const validateEmail = (email) => email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
/* eslint-enable no-useless-escape */

/**
 * Creates a user in the remote db.
 *
 * @param {String} email The email of the new user.
 * @param {String} pwd The user's password.
 * @param {String} key The encryption key for this user.
 * @resolve The newly created user.
 * @reject An error.
 */
const createUser = async (email, pwd, key) => {
	if (!validateEmail(email)) {
		throw new Error("Invalid email!");
	}
	if (pwd.length === 0) {
		throw new Error("Password is empty!");
	}
	let user = await schema.User.findOne({ email: email }).exec();
	if (user !== null) {
		throw new Error("This email already has an account!");
	}
	user = new schema.User({
		email: email,
		pwd: security.passHash(pwd),
		theme: "lightmode",
		index: {
			objectType: "index",
			contents: []
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
				id: makeid(),
				objectType: "signifier",
				meaning: security.encrypt("general", key),
				symbol: "&#x1F7E0;"
			}
		]
	});
	user = await user.save();
	user = user.toObject();
	user.signifiers[0].meaning = "general";
	delete user.pwd;
	return user;
};

/* For exporting */
module.exports = {
	createUser: createUser
}
