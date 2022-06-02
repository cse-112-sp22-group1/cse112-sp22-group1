/**
 * Mongo Read Functions
 * @namespace mongoRead
 */
require("dotenv").config();
const schema = require(`${__dirname}/../schema.js`);
const security = require(`${__dirname}/../security/securityFunctions.js`);

/**
 * Reads the user from the online db and sends it to the callback.
 * @memberof mongoRead
 * @param {String} email The email of the user to read.
 * @param {String} key The decryption key to the user's data.
 * @resolve A decoded user object.
 * @reject An error.
 */
const readUser = async (email, key) => {
	const user = await schema.User.findOne({ email: email }).exec();
	if (user === null) {
		throw new Error("User does not exist!");
	}
	let newCollections = [];
	for (let i = 0; i < user.collections.length; i++) {
		let collection = user.collections[i];
		collection.title = security.decrypt(collection.title, key);
		newCollections.push(collection);
	}
	let newTextBlocks = [];
	for (let i = 0; i < user.textBlocks.length; i++) {
		let block = user.textBlocks[i];
		block.text = security.decrypt(block.text, key);
		newTextBlocks.push(block);
	}
	let newTasks = [];
	for (let i = 0; i < user.tasks.length; i++) {
		let block = user.tasks[i];
		block.text = security.decrypt(block.text, key);
		newTasks.push(block);
	}
	let newEvents = [];
	for (let i = 0; i < user.events.length; i++) {
		let block = user.events[i];
		block.title = security.decrypt(block.title, key);
		newEvents.push(block);
	}
	let newSignifiers = [];
	for (let i = 0; i < user.signifiers.length; i++) {
		let signifier = user.signifiers[i];
		signifier.meaning = security.decrypt(signifier.meaning, key);
		newSignifiers.push(signifier);
	}
	let newImageBlocks = [];
	for (let i = 0; i < user.imageBlocks.length; i++) {
		let imageBlock = user.imageBlocks[i];
		imageBlock.data = security.decrypt(imageBlock.data, key);
		newImageBlocks.push(imageBlock);
	}
	let newAudioBlocks = [];
	for (let i = 0; i < user.audioBlocks.length; i++) {
		let audioBlock = user.audioBlocks[i];
		audioBlock.data = security.decrypt(audioBlock.data, key);
		newAudioBlocks.push(audioBlock);
	}
	let newTrackers = [];
	for (let i = 0; i < user.trackers.length; i++) {
		let tracker = user.trackers[i];
		tracker.title = security.decrypt(tracker.title, key);
		newTrackers.push(tracker);
	}
	let decodedUser = {
		email: user.email,
		index: user.index,
		theme: user.theme,
		dailyLogs: user.dailyLogs,
		monthlyLogs: user.monthlyLogs,
		futureLogs: user.futureLogs,
		trackers: user.trackers,
		collections: newCollections,
		imageBlocks: newImageBlocks,
		audioBlocks: newAudioBlocks,
		textBlocks: newTextBlocks,
		events: newEvents,
		tasks: newTasks,
		signifiers: newSignifiers
	}
	return decodedUser;
};

module.exports = {
	readUser: readUser
}
