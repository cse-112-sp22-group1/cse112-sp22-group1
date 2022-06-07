/**
 * Create functions
 * @namespace createFunctions
 */
/**
 * Update functions
 * @namespace updateFunctions
 */
/**
 * Delete functions
 * @namespace deleteFunctions
 */
/**
 * Read functions
 * @namespace readFunctions
 */
/**
 * Local Storage
 * @module localStorage
 */
import { api, origin } from "../constants.js";
// -------------importing from create-----------------------------------------
import {createAudioBlockPouch} from "./createFiles/createAudioBlock.js";
import {createCollectionPouch} from "./createFiles/createCollection.js";
import {createDailyLogPouch} from "./createFiles/createDailyLog.js";
import {createEventPouch} from "./createFiles/createEvent.js";
import {createFutureLogPouch} from "./createFiles/createFutureLog.js";
import {createImageBlockPouch} from "./createFiles/createImageBlock.js";
import {createMonthlyLogPouch} from "./createFiles/createMonthlyLog.js";
import {createSignifierPouch} from "./createFiles/createSignifier.js";
import {createTaskPouch} from "./createFiles/createTask.js";
import {createTextBlockPouch} from "./createFiles/createTextBlock.js";
import {createTrackerPouch} from "./createFiles/createTracker.js";
import {createUserPouch} from "./createFiles/createUser.js";
// ---------------importing from delete-------------------------------------------
import {deleteAudioBlockPouch} from "./deleteFiles/deleteAudioBlock.js";
import {deleteCollectionPouch} from "./deleteFiles/deleteCollection.js";
import {deleteDailyLogPouch} from "./deleteFiles/deleteDailyLog.js";
import {deleteEventPouch} from "./deleteFiles/deleteEvent.js";
import {deleteFutureLogPouch} from "./deleteFiles/deleteFutureLog.js";
import {deleteImageBlockPouch} from "./deleteFiles/deleteImageBlock.js";
import {deleteMonthlyLogPouch} from "./deleteFiles/deleteMonthlyLog.js";
import {deleteSignifierPouch} from "./deleteFiles/deleteSignifier.js";
import {deleteTaskPouch} from "./deleteFiles/deleteTask.js";
import {deleteTextBlockPouch} from "./deleteFiles/deleteTextBlock.js";
import {deleteTrackerPouch} from "./deleteFiles/deleteTracker.js";
import {deleteUserPouch} from "./deleteFiles/deleteUser.js";
// ---------------importing from read---------------------------------------------
import {readUserPouch} from "./readFiles/readUser.js";
// ---------------importing from update-------------------------------------------
import {updateAudioBlockPouch} from "./updateFiles/updateAudioBlock.js";
import {updateCollectionPouch} from "./updateFiles/updateCollection.js";
import {updateDailyLogPouch} from "./updateFiles/updateDailyLog.js";
import {updateEventPouch} from "./updateFiles/updateEvent.js";
import {updateFutureLogPouch} from "./updateFiles/updateFutureLog.js";
import {updateImageBlockPouch} from "./updateFiles/updateImageBlock.js";
import {updateMonthlyLogPouch} from "./updateFiles/updateMonthlyLog.js";
import {updateSignifierPouch} from "./updateFiles/updateSignifier.js";
import {updateTaskPouch} from "./updateFiles/updateTask.js";
import {updateTextBlockPouch} from "./updateFiles/updateTextBlock.js";
import {updateThemePouch} from "./updateFiles/updateTheme.js";
import {updateTrackerPouch} from "./updateFiles/updateTracker.js";
import {updateUserOnline} from "./updateFiles/updateUser.js";

/* eslint-disable */
export let db = null;

try {
	db = new PouchDB("Users");
} catch (error) {
	db = null;
}

/**
 * Sets up the local storage
 * @param {PouchDB} database
 */
export let setupStorage = (database) => {
	if (database) {
		db = database;
	} else {
		db = new PouchDB("Users");
	}
}
/* eslint-enable */

/**
 * Single parameter callback
 * @callback singleParameterCallback
 * @param {Object} res - object or null if successful, error otherwise
 */

/**
 * Double parameter callback
 * @callback doubleParameterCallback
 * @param {Object} err - error if failed, null otherwise
 * @param {Object} res - created / updated object if successful, null otherwise
 */

/**
 * Attempts to authenticate a user session.
 * (needs both front-end and back-end servers to be running)
 * @param {String} email The new user's email.
 * @param {String} pwd The new user's pwd.
 * @param {singleParameterCallback} callback Sends an object containing an error on error, null on success.
 */
export function loginUser (email, pwd, callback) {
	fetch(`${api}/auth`, {
        credentials: "include",
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Origin": origin
		},
		body: JSON.stringify({
			email: email.toLowerCase(),
			pwd: pwd
		}),
		method: "POST"
	}).then((data) => data.json()).then((res) => {
		callback(res);
	});
}

/**
 * Retrieves the information from the currently logged in user from the server.
 * (needs both front-end and back-end servers to be running)
 * @param {singleParameterCallback} callback The user object on success, an error on failure.
 */
export function getUser (callback) {
	fetch(`${api}/user`, {
        credentials: "include",
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Origin": origin
		},
		method: "GET"
	}).then((data) => data.json()).then((res) => {
		callback(res);
	});
}

/**
 * Updates the user from the online db.
 */
export function updateUserFromMongo (callback) {
	updateUserOnline(callback);
}

// -------------------------------Create Functions----------------------------------

/**
 * Creates a new audioBlock from the parameters passed in and updates the online db.
 *
 * @param {Object} parent The parent of the new audioBlock.
 * @param {Number} index the index of insertion in parent
 * @param {String} arrangement The arrangement of the audio.
 * @param {Buffer} data The audio data stored as a buffer.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the audioBlock or an error, if there is one, to the callback.
 */
export function createAudioBlock (parent, index, arrangement, data, shouldUpdate, callback) {
	createAudioBlockPouch(db, parent, index, arrangement, data, (err, audio) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, audio);
			});
		} else {
			callback(err, audio);
		}
	});
}

/**
 * Creates a new collection from the parameters passed in and updates the online db.
 *
 * @param {String} title The title of the new collection.
 * @param {String} parent The id of the parent of the new collection.
 * @param {Array} content The array of textBlocks included in the collection.
 * @param {Array} collections Nested collections
 * @param {Array} trackers Trackers in collections
 * @param {Object} addToParent Object to which to add collection (dailyLog, monthlyLog, futureLog, collection)
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the collection or an error, if there is one, to the callback.
 */
export function createCollection (title, parent, content, collections, trackers, addToParent, shouldUpdate, callback) {
	createCollectionPouch(db, title, parent, content, collections, trackers, addToParent, (err, collection) => {
		if (shouldUpdate && !err) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, collection);
			});
		} else {
			callback(err, collection);
		}
	});
}

/**
 * Creates a new dailyLog from the parameters passed in and updates the online db.
 *
 * @param {Object} parent The id of the parent of the new dailyLog.
 * @param {Array} content The array of textBlocks included in the dailyLog.
 * @param {Array} collections The array of collections included in the dailyLog
 * @param {Array} trackers The array of trackers included in the dailyLog.
 * @param {Date} date The date of the dailyLog
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the dailyLog or an error, if there is one, to the callback.
 */
export function createDailyLog (parent, content, collections, trackers, date, shouldUpdate, callback) {
	createDailyLogPouch(db, parent, content, collections, trackers, date, (err, day) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, day);
			});
		} else {
			callback(err, day);
		}
	});
}

/**
 * Creates a new event from the parameters passed in and updates the online db.
 *
 * @param {String} title The title of the event.
 * @param {Array<String>} references The id of the references of the new event.
 * @param {Date} date The date of the event. (optional)
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the event or an error, if there is one, to the callback.
 */
export function createEvent (title, references, date, shouldUpdate, callback) {
	createEventPouch(db, title, references, date, (error, event) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, event);
			});
		} else {
			callback(error, event);
		}
	});
}

/**
 * Creates a new futureLog from the parameters passed in and updates the online db.
 *
 * @param {String} title The title of the future log.
 * @param {Date} startDate The start date of the new futureLog.
 * @param {Date} endDate The end date of the new futureLog.
 * @param {Array} months The id's of the monthlyLogs included in the new futureLog.
 * @param {Array} content The ids of the textBlocks included in the futureLog.
 * @param {Array} collections The ids of the collections included in the futureLog.
 * @param {Array} trackers The id's of the trackers included in the new futureLog.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the futureLog or an error, if there is one, to the callback.
 */
export function createFutureLog (title, startDate, endDate, months, content, collections, trackers, shouldUpdate, callback) {
	createFutureLogPouch(db, title, startDate, endDate, months, content, collections, trackers, (err, futureLog) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, futureLog);
			});
		} else {
			callback(err, futureLog);
		}
	});
}

/**
 * Creates a new imageBlock from the parameters passed in and updates the online db.
 * @function createImageBlock
 * @param {Object} parent The parent of the new imageBlock.
 * @param {Number} index the index of insetion in parent
 * @param {String} arrangement The arrangement of the image.
 * @param {Buffer} data The image data stored as a buffer.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParamterCallback} callback Either sends the imageBlock or an error, if there is one, to the callback.
 */
export function createImageBlock (parent, index, arrangement, data, shouldUpdate, callback) {
	createImageBlockPouch(db, parent, index, arrangement, data, (err, image) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, image);
			});
		} else {
			callback(err, image);
		}
	});
}

/**
 * Creates a new monthlyLog from the parameters passed in and updates the online db.
 *
 * @param {String} parent The id of the parent of the new monthlyLog.
 * @param {Array} days The daily Logs in the new monthlyLog
 * @param {Array} content the content for the new monthlyLog
 * @param {Array} collections The ids for the collections included in the monthlyLog
 * @param {Array} trackers The array of trackers included in the monthlyLog.
 * @param {Date} startDate The start date of the monthlyLog
 * @param {Date} endDate The end date of the monthlyLog
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the monthlyLog or an error, if there is one, to the callback.
 */
export function createMonthlyLog (parent, days, content, collections, trackers, startDate, endDate, shouldUpdate, callback) {
	createMonthlyLogPouch(db, parent, days, content, collections, trackers, startDate, endDate, (error, month) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, month);
			});
		} else {
			callback(error, month);
		}
	});
}

/**
 * Creates a new signifier from the parameters passed in and updates the online db.
 *
 * @param {String} meaning The meaning of the new signifier.
 * @param {String} symbol The string of the new signifier.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the signifier or an error, if there is one, to the callback.
 */
export function createSignifier (meaning, symbol, shouldUpdate, callback) {
	createSignifierPouch(db, meaning, symbol, (err, signifier) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, signifier);
			});
		} else {
			callback(err, signifier);
		}
	});
}

/**
 * Creates a new task from the parameters passed in and updates the online db.
 *
 * @param {Array<String>} references The id of the references of the new task.
 * @param {String} text The description of the new task.
 * @param {Number} complete The value to see if task is complete or not (zero if not complete and non-zero if complete).
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the dailyLog or an error, if there is one, to the callback.
 */
export function createTask (references, text, complete, shouldUpdate, callback) {
	createTaskPouch(db, references, text, complete, (error, task) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, task);
			});
		} else {
			callback(error, task);
		}
	});
}

/**
 * Creates a new textBlock from the parameters passed in and updates the online db.
 *
 * @param {Object} parent The parent of the new textBlock.
 * @param {Number} index The index at which the textBlock should be placed in parent's content.
 * @param {String} content The task description to be inserted if kind was a task (optional).
 * @param {Number} tabLevel The tablevel the new textBlock should be at.
 * @param {String} kind The type of textBlock the new textBlock should be (taks, event, or paragraph).
 * @param {String} objectReference The id of the task or event if kind was kind or event (optional).
 * @param {Array<Object>} signifiers The id of the signifier that should be used by this textBlock.
 * @param {Date} date The date to be inserted if kind was an event (optional).
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the textBlock or an error, if there is one, to the callback.
 */
export function createTextBlock (parent, index, content, tabLevel, kind, objectReference, signifiers, date, shouldUpdate, callback) {
	createTextBlockPouch(db, parent, index, content, tabLevel, kind, objectReference, signifiers, date, (error, textBlock) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, textBlock);
			});
		} else {
			callback(error, textBlock);
		}
	});
}

/**
 * Creates a new tracker from the parameters passed in and updates the online db.
 *
 * @param {String} title The title of the new tracker.
 * @param {Array} content The array of ids of textBlocks that are included in the new tracker.
 * @param {String} parent The id of the parent of the new tracker.
 * @param {Object} addToParent A parent object to update
 * @param {Object} recurring  Tells if it should be recurring in parent
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {doubleParameterCallback} callback Either sends the tracker or an error, if there is one, to the callback.
 */
export function createTracker (title, content, parent, addToParent, recurring, shouldUpdate, callback) {
	createTrackerPouch(db, title, content, parent, addToParent, recurring, (err, tracker) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				if (couldNotUpdate) {
					callback(couldNotUpdate, null);
					return;
				}
				callback(couldNotUpdate, tracker);
			});
		} else {
			callback(err, tracker);
		}
	});
}

/**
 * Creates a user in the local db.
 * (needs both front-end and back-end servers to be running)
 * @param {String} email The new user's email.
 * @param {String} pwd The new user's password.
 * @param {singleParameterCallback} callback Sends the new user object to the callback.
 */
export function createUser (email, pwd, callback) {
	fetch(`${api}/user`, {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Origin": origin
		},
		body: JSON.stringify({
			email: email,
			pwd: pwd
		}),
		credentials: "include",
		method: "POST"
	}).then((data) => data.json()).then((userData) => {
		if (userData.error) {
			callback(userData);
		} else {
			createUserPouch(db, userData, (user) => {
				callback(user);
			});
		}
	});
}

// -------------------------------Read Functions----------------------------------

/**
 * Reads the user in the local db and updates the online db.
 *
 * @param {doubleParameterCallback} callback Either sends the user or an error, if there is one, to the callback.
 */
export function readUser (callback) {
	readUserPouch(db, (err, user) => {
		callback(err, user);
	});
}

// -------------------------------Delete Functions----------------------------------

/**
 * Deletes the audioBlock passed in.
 *
 * @param {Object} audioBlock The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteAudioBlock (audioBlock, shouldUpdate, callback) {
	deleteAudioBlockPouch(db, audioBlock.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the audioBlock with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteAudioBlockByID (id, shouldUpdate, callback) {
	deleteAudioBlockPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the collection passed in.
 *
 * @param {Object} collection The object to be deleted.
 * @param {Object} parent The parent of the collection
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteCollection (collection, parent, shouldUpdate, callback) {
	deleteCollectionPouch(db, collection, parent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the collection with the id passed in.
 *
 * @param {Object} imageBlock The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteCollectionByID (id, shouldUpdate, callback) {
	readUser((err, user) => {
		if (err) {
			callback(err);
		} else {
			deleteCollectionPouch(db, user.collections.filter((collection) => collection.id === id)[0], (errDel) => {
				if (shouldUpdate) {
					updateUserFromMongo((couldNotUpdate) => {
						callback(couldNotUpdate);
					});
				} else {
					callback(errDel);
				}
			});
		}
	})
}

/**
 * Deletes the collection passed in.
 *
 * @param {Object} dailyLog The object to be deleted.
 * @param {Object} parent The parent of the dailyLog
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
 export function deleteDailyLog (dailyLog, parent, shouldUpdate, callback) {
	deleteDailyLogPouch(db, dailyLog, parent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes all the data in the local db and prints all info of the db.
 *
 * @param {Bool} cloud tells if should delete
 */
export async function deleteDB (cloud) {
	if (cloud) {
		await fetch(`${api}/user`, {
			headers: {
				"content-type": "application/json; charset=UTF-8",
				"Origin": origin
			},
			credentials: "include",
			method: "DELETE"
		}).then((data) => data.json()).then(async (userData) => {
			await db.destroy((err, res) => {
				if (err || res === null) {
					return err;
				}
					return userData.error;

			});
		});
	} else {
		db.destroy((err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});

		db.info((err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	}
}

/**
 * Deletes the event with the id passed in.
 *
 * @param {Object} event The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteEvent (event, shouldUpdate, callback) {
	deleteEventPouch(db, event.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the event with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteEventByID (id, shouldUpdate, callback) {
	deleteEventPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the event from the container at the index passed in.
 *
 * @param {Array} container The array where event is in.
 * @param {index} index The index in the container to delete the event.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteEventAtIndex (container, index, shouldUpdate, callback) {
	deleteEventPouch(db, container.content[index], (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the futureLog passed in and its children.
 *
 * @param {Object} futureLog The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteFutureLog (futureLog, shouldUpdate, callback) {
	deleteFutureLogPouch(db, futureLog, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the imageBlock passed in.
 *
 * @param {Object} imageBlock The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
 export function deleteImageBlock (imageBlock, shouldUpdate, callback) {
	deleteImageBlockPouch(db, imageBlock.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the imageBlock with the id passed in.
 *
 * @param {String} id The id of object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteImageBlockByID (id, shouldUpdate, callback) {
	deleteImageBlockPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the collection passed in.
 *
 * @param {Object} monthlyLog The object to be deleted.
 * @param {Object} parent The parent of the monthlyLog
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
 export function deleteMonthlyLog (monthlyLog, parent, shouldUpdate, callback) {
	deleteMonthlyLogPouch(db, monthlyLog, parent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the signifier passed in.
 *
 * @param {Object} signifier The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteSignifier (signifier, shouldUpdate, callback) {
	deleteSignifierPouch(db, signifier.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the signifier with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteSignifierByID (id, shouldUpdate, callback) {
	deleteSignifierPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the signifier of the block passed in.
 *
 * @param {Object} block The object to delete the signifier from.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteSignifierAtBlock (block, shouldUpdate, callback) {
	deleteSignifierPouch(db, block.signifier, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the task passed in.
 *
 * @param {Object} task The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTask (task, shouldUpdate, callback) {
	deleteTaskPouch(db, task.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the task with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTaskByID (id, shouldUpdate, callback) {
	deleteTaskPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the textBlock passed in.
 *
 * @param {Object} textBlock The object to be deleted.
 * @param {Object} parent The parent of the textBlock
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTextBlock (block, parent, shouldUpdate, callback) {
	deleteTextBlockPouch(db, block, parent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the textBlock with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Object} parent The parent of the textBlock
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTextBlockByID (id, parent, shouldUpdate, callback) {
	readUser((err, user) => {
		if (err) {
			callback(err);
		} else {
			let block = user.textBlocks.filter((reference) => reference.id === id);
			deleteTextBlockPouch(db, block, parent, (errDel) => {
				if (shouldUpdate) {
					updateUserFromMongo((couldNotUpdate) => {
						callback(couldNotUpdate);
					});
				} else {
					callback(errDel);
				}
			});
		}
	});
}

/**
 * Deletes the textBlock from the container at the index passed in.
 *
 * @param {Array} container The array to delete the textBlock from.
 * @param {Number} index The index in the container of the textBlock to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTextBlockFromContainer (container, index, shouldUpdate, callback) {
	deleteTextBlockPouch(db, container.contents[index], (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the tracker passed in.
 *
 * @param {Object} tracker The object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTracker (tracker, shouldUpdate, callback) {
	deleteTrackerPouch(db, tracker.id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the imageBlock with the id passed in.
 *
 * @param {String} id The id of the object to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTrackerByID (id, shouldUpdate, callback) {
	deleteTrackerPouch(db, id, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the tracker from the container at the index passed in.
 *
 * @param {Array} container The array to delete the tracker from.
 * @param {Number} index The index in the container of the tracker to be deleted.
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Returns an error if there is one.
 */
export function deleteTrackerFromContainer (container, index, shouldUpdate, callback) {
	deleteTrackerPouch(db, container.trackers[index], (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Deletes the user in the local db.
 *
 * @param {singleParameterCallback} callback Returns the user object that was deleted.
 */
export function deleteUser (callback) {
	deleteUserPouch(db, () => {
		updateUserFromMongo((couldNotUpdate) => {
			callback(couldNotUpdate);
		});
	});
}

 // -------------------------------Update Functions----------------------------------

/**
 * Updates the audioBlock given.
 *
 * @param {Object} audioBlock The new version of the audioBlock.
 * @param {Object} parent The original parent of the new version of the audioBlock.
 * @param {Object} addParent The new parent of the block
 * @param {Boolean} shouldUpdate true if we should update the onlin db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateAudioBlock (audioBlock, parent, addParent, shouldUpdate, callback) {
	updateAudioBlockPouch(db, audioBlock, parent, addParent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the collection given.
 *
 * @param {Object} collection The new version of the collection.
 * @param {Object} parent The original parent of the collection
 * @param {Object} addParent The new parent of the collection
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateCollection (collection, parent, addParent, shouldUpdate, callback) {
	updateCollectionPouch(db, collection, parent, addParent, (error) => {
		if (shouldUpdate && !error) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(error);
		}

	});
}

/**
 * Updates the dailyLog given.
 *
 * @param {Object} dailyLog The new version of the dailyLog.
 * @param {Object} parent The original parent of the dailyLog
 * @param {Object} addParent The new parent of the dailyLog
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateDailyLog (dailyLog, parent, addParent, shouldUpdate, callback) {
	updateDailyLogPouch(db, dailyLog, parent, addParent, (err) => {
		if (shouldUpdate && !err) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the event given.
 *
 * @param {Object} event The new version of the event.
 * @param {Object} reference The original reference of the event
 * @param {Object} addReference The new reference of the event
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateEvent (event, reference, addReference, shouldUpdate, callback) {
	updateEventPouch(db, event, reference, addReference, (error) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(error);
		}
	});
}

/**
 * Updates the futureLog given.
 *
 * @param {Object} futureLog The id of the new version of the futureLog.
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateFutureLog (futureLog, shouldUpdate, callback) {
	updateFutureLogPouch(db, futureLog, (error) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(error);
		}
	});
}

/**
 * Updates the imageBlock.
 *
 * @param {Object} imageBlock The new version of the imageBlock.
 * @param {Object} parent The original parent of the imageBlock
 * @param {Object} addParent The new parent of the imageBlock
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateImageBlock (imageBlock, parent, addParent, shouldUpdate, callback) {
	updateImageBlockPouch(db, imageBlock, parent, addParent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the monthlyLog given.
 *
 * @param {Object} monthlyLog The new version of the monthlyLog.
 * @param {Object} parent The original parent of the monthlyLog
 * @param {Object} addParent The new parent of the monthlyLog
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateMonthlyLog (monthlyLog, parent, addParent, shouldUpdate, callback) {
	updateMonthlyLogPouch(db, monthlyLog, parent, addParent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the signifier given.
 *
 * @param {Object} signifier The new version of the signifier.
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateSignifier (signifier, shouldUpdate, callback) {
	updateSignifierPouch(db, signifier, (error) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(error);
		}
	});
}

/**
 * Updates the task given.
 *
 * @param {Object} task The id of the new version of the task.
 * @param {Object} reference The original reference of the task
 * @param {Object} addReference The new reference of the task
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateTask (task, shouldUpdate, reference, addReference, callback) {
	updateTaskPouch(db, task, reference, addReference, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the textBlock given.
 *
 * @param {Object} block The new version of the textBlock.
 * @param {Date} date The date to be inserted if the update is to make the textBlock have an event with a date.
 * @param {Object} parent The original parent of the textBlock
 * @param {Object} addParent The new parent of the textBlock
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateTextBlock (block, date, shouldUpdate, parent, addParent, callback) {
	updateTextBlockPouch(db, block, date, parent, addParent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	});
}

/**
 * Updates the theme of the app.
 *
 * @param {String} theme The name of the theme to switch to.
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateTheme (theme, shouldUpdate, callback) {
	updateThemePouch(db, theme, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
		} else {
			callback(err);
		}
	})
}

/**
 * Updates the tracker given.
 *
 * @param {Object} tracker The new version of the tracker.
 * @param {Object} parent The original parent of the tracker
 * @param {Object} addParent The new parent of the tracker
 * @param {Boolean} shouldUpdate true if we should update the online db
 * @param {singleParameterCallback} callback Sends an error, if there is one, to the callback.
 */
export function updateTracker (tracker, shouldUpdate, parent, addParent, callback) {
	updateTrackerPouch(db, tracker, parent, addParent, (err) => {
		if (shouldUpdate) {
			updateUserFromMongo((couldNotUpdate) => {
				callback(couldNotUpdate);
			});
			/* istanbul ignore next */
		} else {
			/* istanbul ignore next */
			callback(err);
		}
	});
}
