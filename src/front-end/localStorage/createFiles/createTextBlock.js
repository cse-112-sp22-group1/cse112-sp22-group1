import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

/**
 * Handles sub-component creation for a given block if needed
 * @memberof createFunctions
 * @param {database} db
 * @param {Object} textBlock The textblock parent object
 * @param {Date} date The date in case of event creation
 * @param {doubleParameterCallback} callback Callback after sub-component has been handled
 */
function handleSubComponent (db, textBlock, date, callback) {
	if (textBlock.objectReference === null) {
		if (textBlock.kind === "task") {
			/* istanbul ignore next */
			localStorage.createTask([textBlock.id], textBlock.text, 0, false, (failedCreateTask, task) => {
				/* istanbul ignore next */
				if (failedCreateTask) {
					/* istanbul ignore next */
					callback(failedCreateTask, null);

					/* istanbul ignore next */
				} else {
					textBlock.objectReference = task.id;
					callback(null, textBlock);

				}
			});
		} else if (textBlock.kind === "event") {
			/* istanbul ignore next */
			localStorage.createEvent(textBlock.text, [textBlock.id], date, false, (failedCreateEvent, journalEvent) => {
				/* istanbul ignore next */
				if (failedCreateEvent) {
					/* istanbul ignore next */
					callback(failedCreateEvent, null);

					/* istanbul ignore next */
				} else {
					textBlock.objectReference = journalEvent.id;
					callback(null, textBlock);

				}
			});
		} else {
			/* istanbul ignore next */
			callback(null, textBlock);
		}
		/* istanbul ignore next */
	} else if (textBlock.objectReference) {
		localStorage.readUser((err, user) => {
			/* istanbul ignore next */
			if (err) {
				/* istanbul ignore next */
				callback(err, null);
				/* istanbul ignore next */
				return;
			} else if (textBlock.kind === "task") {
				let task = user.tasks.filter((reference) => reference.id === textBlock.objectReference)[0];
				task.references.push(textBlock.id);
				user.tasks = user.tasks.filter((filterTask) => filterTask.id !== task.id);
				user.tasks.push(task);
			} else if (textBlock.kind === "event") {
				let event = user.events.filter((reference) => reference.id === textBlock.objectReference)[0];
				event.references.push(textBlock.id);
				user.events = user.events.filter((filterevent) => filterevent.id !== event.id);
				user.events.push(event);
			}
			let newUser = {
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
			};
			return db.put(newUser).then((res) => {
				if (res.ok) {
					callback(null, textBlock);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
			});
		});
	} else {
		/* istanbul ignore next */
		callback(null, textBlock);
	}
}

/**
 * Creates and stores a new event created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {Object} parent The id of the parent of the new textBlock.
 * @param {Number} index The index of where the textBlock should be stored in its parent.
 * @param {String} content The task description to be inserted if kind was a task (optional)
 * @param {Number} tablevel The tablevel of the textBlock.
 * @param {String} kind The kind of textBlock (task, event, or paragraph)
 * @param {String} objectReference The id of the task or event linked to the textBlock.
 * @param {Array<Object>} signifiers The signifiers used by the textBlock.
 * @param {Date} date The date of the event if the textBlock kind was an event (opional).
 * @param {doubleParameterCallback} callback Eihter sends the newly created textBlock or an error if there is one to the callback.
 */
export function createTextBlockPouch (db, parent, index, content, tabLevel, kind, objectReference, signifiers, date, callback) {
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
			/* istanbul ignore next */
		} else {
			// Sets up the Text block itself
			let id = makeid(user);
			let textBlockObject = {
				id: id,
				objectType: "textBlock",
				tabLevel: tabLevel,
				parent: parent.id,
				kind: kind,
				objectReference: objectReference,
				text: content,
				signifiers: []
			};
			signifiers.forEach((signifier) => {
				textBlockObject.signifiers.push(signifier.id)
			});

			// Handles sub components if needed
			handleSubComponent(db, textBlockObject, date, (failedSubComponent, textBlock) => {
				/* istanbul ignore next */
				if (failedSubComponent) {
					/* istanbul ignore next */
					callback(failedSubComponent, null);
					/* istanbul ignore next */
				} else {
					localStorage.readUser((error, updatedUser) => {
						if (error) {
							callback(error, null);
						} else {
							if (index === null) {
								parent.content.push(id);
							} else {
								parent.content.splice(index, 0, id);
							}
							updatedUser[`${parent.objectType}s`] = updatedUser[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
							updatedUser[`${parent.objectType}s`].push(parent);
							updatedUser.textBlocks.push(textBlock);
							let newUser = {
								_id: "0000",
								_rev: updatedUser._rev,
								email: updatedUser.email,
								theme: updatedUser.theme,
								index: updatedUser.index,
								dailyLogs: updatedUser.dailyLogs,
								monthlyLogs: updatedUser.monthlyLogs,
								futureLogs: updatedUser.futureLogs,
								collections: updatedUser.collections,
								trackers: updatedUser.trackers,
								imageBlocks: updatedUser.imageBlocks,
								audioBlocks: updatedUser.audioBlocks,
								textBlocks: updatedUser.textBlocks,
								tasks: updatedUser.tasks,
								events: updatedUser.events,
								signifiers: updatedUser.signifiers
							};

							return db.put(newUser).then((res) => {
								if (res.ok) {
									callback(null, textBlock);
								}
								/* istanbul ignore next */
							}).catch((failedSave) => {
								/* istanbul ignore next */
								callback(failedSave, null);
							});
						}
					});
				}
			});

		}
	});
}
