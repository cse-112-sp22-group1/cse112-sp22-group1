import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

let collectionObject = {};

/**
 * Creates and stores a new collection created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {String} title The title to give to the collection.
 * @param {String} parent The id of the parent of the new collection.
 * @param {Array} content An array of textBlocks to add to the collection.
 * @param {Array} collections An array of collections to add to the collection
 * @param {Array} trackers
 * @param {Object} addToParent A parent object that contains where collection should be added.
 * @param {doubleParameterCallback} callback Eihter sends the newly created collection or an error if there is one to the callback.
 */
export function createCollectionPouch (db, title, parent, content, collections, trackers, addToParent, callback) {
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
		} else {
			let id = makeid(user);

			collectionObject = {
				id: id,
				objectType: "collection",
				title: title,
				parent: parent,
				content: content,
				collections: collections,
				trackers: trackers
			};

			user.collections.push(collectionObject);
			console.log(addToParent);
			console.log(parent);
			if (addToParent && addToParent.objectType !== "index") {
				addToParent.collections.push(collectionObject.id);
				user[`${addToParent.objectType}s`] = user[`${addToParent.objectType}s`].filter((element) => element.id !== addToParent.id);
				user[`${addToParent.objectType}s`].push(addToParent);
			} else if (!parent) {
				console.log("here");
				user.index.collections.push(collectionObject.id);
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
					callback(null, collectionObject);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
				/* istanbul ignore next */

			});
		}
	});
}
