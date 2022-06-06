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

/**
 * Creates a user in the remote db.
 *
 * @param {String} email The email of the new user.
 * @param {String} pwdHash The hash of the user's password.
 * @param {String} key The encryption key for this user.
 * @callback (error) Sends an error if there is one.
 */
const createUser = (email, pwdHash, key, callback) => {
	schema.User.findOne({
		email: email
	}, (error, user) => {
		if (error) {
			callback(error);
		} else if (user === null) {
			const newUser = new schema.User({
				email: email,
				pwd: pwdHash,
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
						id: makeid(),
						objectType: "signifier",
						meaning: security.encrypt("general", key),
						symbol: "&#x1F7E0;"
					}
				]
			});

			newUser.save((err, createdUser) => {
				if (err) {
					callback(err);
				} else {
					createdUser.signifiers[0].meaning = "general";
					callback(createdUser);
				}
			});
		} else {
			callback({ error: "This email already has an account!" });
		}
	});
}

module.exports = {
	createUser: createUser
}
