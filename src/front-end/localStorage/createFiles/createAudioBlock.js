import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

/**
 * Creates and stores a new audioBlock created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {Object} parent The parent of new audioBlock.
 * @param {Number} index The index at which to put block in parent
 * @param {String} arrangement Arrangement of the audioBlock.
 * @param {Buffer} data audio of the audioBlock stored as a buffer.
 * @param {doubleParameterCallback} callback Eihter sends the newly created audioBlock or an error if there is one to the callback.
 */
export function createAudioBlockPouch (db, parent, index, arrangement, data, callback) {
	let audioBlockObject = {};
	/* istanbul ignore next */
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
			/* istanbul ignore next */
		} else {
			let id = makeid(user);
			audioBlockObject = {
				id: id,
				objectType: "audioBlock",
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
			user.audioBlocks.push(audioBlockObject);

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
					callback(null, audioBlockObject);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
			});
		}
	});
}
