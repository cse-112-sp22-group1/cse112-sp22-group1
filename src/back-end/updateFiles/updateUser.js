/**
 * Mongo Update Functions
 * @namespace mongoUpdate
 */
require("dotenv").config();
const readUser = require(`${__dirname}/../readFiles/readUser`);
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
	let userCopy = JSON.parse(JSON.stringify(userObject));
	let newCollections = [];
	for (let i = 0; i < userCopy.collections.length; i++) {
		let collection = userCopy.collections[i];
		collection.title = security.encrypt(collection.title, key);
		newCollections.push(collection);
	}
	let newTextBlocks = [];
	for (let i = 0; i < userCopy.textBlocks.length; i++) {
		let block = userCopy.textBlocks[i];
		block.text = security.encrypt(block.text, key);
		newTextBlocks.push(block);
	}
	let newTasks = [];
	for (let i = 0; i < userCopy.tasks.length; i++) {
		let block = userCopy.tasks[i];
		block.text = security.encrypt(block.text, key);
		newTasks.push(block);
	}
	let newEvents = [];
	for (let i = 0; i < userCopy.events.length; i++) {
		let block = userCopy.events[i];
		block.title = security.encrypt(block.title, key);
		newEvents.push(block);
	}
	let newSignifiers = [];
	for (let i = 0; i < userCopy.signifiers.length; i++) {
		let signifier = userCopy.signifiers[i];
		signifier.meaning = security.encrypt(signifier.meaning, key);
		newSignifiers.push(signifier);
	}
	let newImageBlocks = [];
	for (let i = 0; i < userCopy.imageBlocks.length; i++) {
		let imageBlock = userCopy.imageBlocks[i];
		imageBlock.data = security.encrypt(imageBlock.data, key);
		newImageBlocks.push(imageBlock);
	}
	let newAudioBlocks = [];
	for (let i = 0; i < userCopy.audioBlocks.length; i++) {
		let audioBlock = userCopy.audioBlocks[i];
		audioBlock.data = security.encrypt(audioBlock.data, key);
		newAudioBlocks.push(audioBlock);
	}
	let newTrackers = [];
	for (let i = 0; i < userCopy.trackers.length; i++) {
		let tracker = userCopy.trackers[i];
		tracker.title = security.encrypt(tracker.title, key);
		newTrackers.push(tracker);
	}

	let user = await schema.User.findOne({ email: email }).exec();
	if (user === null) {
		throw new Error("User does not exist!");
	}
	user.index = userCopy.index;
	user.theme = userCopy.theme;
	user.dailyLogs = userCopy.dailyLogs;
	user.monthlyLogs = userCopy.monthlyLogs;
	user.futureLogs = userCopy.futureLogs;
	user.collections = newCollections;
	user.trackers = newTrackers;
	user.imageBlocks = newImageBlocks;
	user.audioBlocks = newAudioBlocks;
	user.textBlocks = newTextBlocks;
	user.tasks = newTasks;
	user.events = newEvents;
	user.signifiers = newSignifiers;

	await user.save();
	user = await readUser.readUser(user.email, key);
	return user;
};

module.exports = {
	updateUser: updateUser
};
