/**
 * Mongo Update Functions
 * @namespace mongoUpdate
 */
require("dotenv").config();
const security = require(`${__dirname}/../security/securityFunctions.js`);
const schema = require(`${__dirname}/../schema.js`);

/**
 * Updated the user from the local db to send to the online db.
 * @memberof mongoUpdate
 * @param {String} email The email of the user to update.
 * @param {String} key The encryption key of the user's data.
 * @param {Object} userObject The new version of user to replace in the online db.
 * @resolve The updated user.
 * @reject An error.
 */
const updateUser = async (email, key, userObject) => {
	let newCollections = [];
	for (let i = 0; i < userObject.collections.length; i++) {
		let collection = userObject.collections[i];
		collection.title = security.encrypt(collection.title, key);
		newCollections.push(collection);
	}
	let newTextBlocks = [];
	for (let i = 0; i < userObject.textBlocks.length; i++) {
		let block = userObject.textBlocks[i];
		block.text = security.encrypt(block.text, key);
		newTextBlocks.push(block);
	}
	let newTasks = [];
	for (let i = 0; i < userObject.tasks.length; i++) {
		let block = userObject.tasks[i];
		block.text = security.encrypt(block.text, key);
		newTasks.push(block);
	}
	let newEvents = [];
	for (let i = 0; i < userObject.events.length; i++) {
		let block = userObject.events[i];
		block.title = security.encrypt(block.title, key);
		newEvents.push(block);
	}
	let newSignifiers = [];
	for (let i = 0; i < userObject.signifiers.length; i++) {
		let signifier = userObject.signifiers[i];
		signifier.meaning = security.encrypt(signifier.meaning, key);
		newSignifiers.push(signifier);
	}
	let newImageBlocks = [];
	for (let i = 0; i < userObject.imageBlocks.length; i++) {
		let imageBlock = userObject.imageBlocks[i];
		imageBlock.data = security.encrypt(imageBlock.data, key);
		newImageBlocks.push(imageBlock);
	}
	let newAudioBlocks = [];
	for (let i = 0; i < userObject.audioBlocks.length; i++) {
		let audioBlock = userObject.audioBlocks[i];
		audioBlock.data = security.encrypt(audioBlock.data, key);
		newAudioBlocks.push(audioBlock);
	}
	let newTrackers = [];
	for (let i = 0; i < userObject.trackers.length; i++) {
		let tracker = userObject.trackers[i];
		tracker.title = security.encrypt(tracker.title, key);
		newTrackers.push(tracker);
	}

	const user = await schema.User.findOne({ email: email }).exec();
	if (user === null) {
		throw new Error("User does not exist");
	}
	user.index = userObject.index;
	user.theme = userObject.theme;
	user.dailyLogs = userObject.dailyLogs;
	user.monthlyLogs = userObject.monthlyLogs;
	user.futureLogs = userObject.futureLogs;
	user.collections = newCollections;
	user.trackers = newTrackers;
	user.imageBlocks = newImageBlocks;
	user.audioBlocks = newAudioBlocks;
	user.textBlocks = newTextBlocks;
	user.tasks = newTasks;
	user.events = newEvents;
	user.signifiers = newSignifiers;

	const newUser = await user.save();
	delete newUser.pwd;
	return newUser;
};

module.exports = {
	updateUser: updateUser
};
