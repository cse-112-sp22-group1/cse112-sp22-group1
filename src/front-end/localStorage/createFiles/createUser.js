/**
 * Creates and stores a new user created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {Object} userObject The user as an object.
 * @param {singleParameterCallback} callback Eihter sends the newly created user or an error if there is one to the callback.
 */
export function createUserPouch (db, userObject, callback) {
	console.log(userObject);
	let newUser = {
		_id: "0000",
		email: userObject.email,
		theme: userObject.theme,
		index: userObject.index,
		dailyLogs: userObject.dailyLogs,
		monthlyLogs: userObject.monthlyLogs,
		futureLogs: userObject.futureLogs,
		collections: userObject.collections,
		trackers: userObject.trackers,
		imageBlocks: userObject.imageBlocks,
		audioBlocks: userObject.audioBlocks,
		textBlocks: userObject.textBlocks,
		tasks: userObject.tasks,
		events: userObject.events,
		signifiers: userObject.signifiers
	};

	return db.put(newUser).then(() => {
		callback(userObject);
	}).catch((err) => {
		callback(err);
	});
}
