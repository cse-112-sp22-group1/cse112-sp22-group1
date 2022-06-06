import { makeid } from "./makeId.js";
import { readUser } from "../userOperations.js";

/**
 * Creates and stores a new monthlyLog created from the given parameters.
 * @memberof createFunctions
 * @param {Database} db The local pouch database.
 * @param {String} parent The id of the parent of the new monthlyLog.
 * @param {Array} days The ids of the days included in the monthlyLog.
 * @param {Array} content The ids for the blocks included in the monthlyLog
 * @param {Array} collections The ids for the collections included in the monthlyLog
 * @param {Array} trackers The ids of the trackers included in the monthlyLog.
 * @param {Date} startDate The start date for the month
 * @param {Date} endDate The end date for the month
 * @param {doubleParameterCallback} callback Eihter sends the newly created monthlyLog or an error if there is one to the callback.
 */
export function createMonthlyLogPouch (db, parent, days, content, collections, trackers, startDate, endDate, callback) {
	let monthlyObject = null;
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
		} else {
			let id = makeid(user);
			monthlyObject = {
				id: id,
				objectType: "monthlyLog",
				parent: parent,
				startDate: startDate,
				endDate: endDate,
				content: content,
				collections: collections,
				days: days,
				trackers: trackers,
				recurringTrackers: []
			};
			user.monthlyLogs.push(monthlyObject);
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
				if (res) {
					callback(null, monthlyObject);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
			});
		}
	});
}
