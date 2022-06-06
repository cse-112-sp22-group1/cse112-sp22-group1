import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

let trackerObject = {};

/**
 * Creates and stores a new tracker created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {String} title The title of the tracker.
 * @param {Array} content The id's of the textBlocks of the new tracker.
 * @param {String} parent The id of the parent of the tracker.
 * @param {Object} addToParent A parent object to which to add tracker
 * @param {Object} recurring  Tells if it should be recurring in parent
 * @param {doubleParameterCallback} callback Eihter sends the newly created tracker or an error if there is one to the callback.
 */
export function createTrackerPouch (db, title, content, parent, addToParent, recurring, callback) {
	/* istanbul ignore next */
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
			/* istanbul ignore next */
		} else {
			let id = makeid(user);

			trackerObject = {
				id: id,
				objectType: "tracker",
				title: title,
				content: content,
				parent: parent
			};

			user.trackers.push(trackerObject);

			if (addToParent) {
				if (recurring) {
					addToParent.recurringTrackers.push(trackerObject.id);
					recurring.trackers.push(trackerObject.id);
					user[`${recurring.objectType}s`] = user[`${recurring.objectType}s`].filter((element) => element.id !== recurring.id);
					user[`${recurring.objectType}s`].push(recurring);
				} else {
					addToParent.trackers.push(trackerObject.id);
				}
				user[`${addToParent.objectType}s`] = user[`${addToParent.objectType}s`].filter((element) => element.id !== addToParent.id);
				user[`${addToParent.objectType}s`].push(addToParent);
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
					callback(null, trackerObject);
				}
			}).catch((error) => {
				callback(error, null);

			});
		}
	});
}
