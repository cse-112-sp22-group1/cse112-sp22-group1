import * as localStorage from "../userOperations.js";

function handleSubComponent (textBlock, callback) {
	if (textBlock.objectReference) {
		localStorage.readUser((err, user) => {
			if (err) {
				callback(err);
			} else if (textBlock.kind === "event") {
					let event = user.events.filter((reference) => reference.id === textBlock.objectReference)[0];
					event.references = event.references.filter((reference) => reference !== textBlock.id);
					localStorage.updateEvent(event, null, null, false, (error) => {
						callback(error, textBlock);
					});
				} else if (textBlock.kind === "task") {
					let task = user.tasks.filter((reference) => reference.id === textBlock.objectReference)[0];
					task.references = task.references.filter((reference) => reference !== textBlock.id);
					localStorage.updateTask(task, null, null, false, (error) => {
						callback(error, textBlock);
					});
				}
		});
	} else {
		callback(null, textBlock);
	}
}

/**
 * Finds and deletes the textBlock.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {Object} textBlock The id of the object to be deleted.
 * @param {Object} parent The parent of the textBlock
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteTextBlockPouch (db, textBlock, parent, callback) {
	handleSubComponent(textBlock, (failedSubComponent, updatedBlock) => {
		if (failedSubComponent) {
			callback(failedSubComponent);
		} else {
			localStorage.readUser((error, user) => {
				if (error) {
					callback(error);
				} else {
					if (parent) {
						parent.content = parent.content.filter((reference) => reference !== updatedBlock.id);
						user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((month) => month.id !== parent.id);
						user[`${parent.objectType}s`].push(parent);
					}
					user.textBlocks = user.textBlocks.filter((block) => block.id !== updatedBlock.id);
					return db.put({
						_id: "0000",
						_rev: user._rev,
						email: user.email,
						theme: user.theme,
						index: user.index,
						dailyLogs: user.dailyLogs,
						monthlyLogs: user.monthlyLogs,
						futureLogs: user.futureLogs,
						collections: user.collections,
						trackers: user.trackers,
						imageBlocks: user.imageBlocks,
						audioBlocks: user.audioBlocks,
						textBlocks: user.textBlocks,
						tasks: user.tasks,
						events: user.events,
						signifiers: user.signifiers
					}).then(() => {
						callback(null);
					}).catch((err) => {
						callback(err);
					});
				}
			})
		}
	});
}
