/**
 * Online Delete Functions
 * @namespace mongoDelete
 */
require("dotenv").config();
const schema = require(`${__dirname}/../schema.js`);

/**
 * Deletes the user from the online db.
 * @memberof mongoDelete
 * @param {String} email The email of the user to delete.
 * @resolve The deleted user.
 * @reject An error.
 */
const deleteUser = async (email) => {
	let user = await schema.User.findOneAndDelete({ email: email }).lean();
	if (user === null) {
		throw new Error("User does not exist!");
	}
	delete user.pwd;
	return user;
};

module.exports = {
	deleteUser: deleteUser
}
