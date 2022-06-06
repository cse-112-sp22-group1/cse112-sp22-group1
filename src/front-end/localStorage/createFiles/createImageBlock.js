import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

let imageBlockObject = {};

/**
 * Creates and stores a new imageBlock created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {Object} parent The parent of the new imageBlock.
 * @param {Number} index The insert index in parent for block
 * @param {String} arrangement arrangement of the imageBlock.
 * @param {String} data image of the imageBlock stored as a buffer.
 * @param {doubleParameterCallback} callback Eihter sends the newly created imageBlock or an error if there is one to the callback.
 */
export function createImageBlockPouch (db, parent, index, arrangement, data, callback) {
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
		} else {
			let id = makeid(user);

			imageBlockObject = {
				id: id,
				objectType: "imageBlock",
				parent: parent.id,
				arrangement: arrangement,
				data: data
			};

			if (index) {
				parent.content.splice(index, 0, id);
			} else {
				parent.content.push(id);
			}
			user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
			user[`${parent.objectType}s`].push(parent);
			user.imageBlocks.push(imageBlockObject);

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
				/* istanbul ignore next */
				if (res.ok) {
					callback(null, imageBlockObject);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);

			});
		}
	});
}
