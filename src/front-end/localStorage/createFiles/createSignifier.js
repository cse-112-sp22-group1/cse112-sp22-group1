import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

let signifierObject = {};

/**
 * Creates and stores a new signifier created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {String} meaning The meaning of the signifier.
 * @param {String} symbol The symbol of the signifier.
 * @param {doubleParameterCallback} callback Eihter sends the newly created signifier or an error if there is one to the callback.
 */
export function createSignifierPouch (db, meaning, symbol, callback) {
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {
			let id = makeid(user);

			signifierObject = {
				id: id,
				objectType: "signifier",
				meaning: meaning,
				symbol: symbol
			}

			user.signifiers.push(signifierObject);

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
					callback(null, signifierObject);
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
