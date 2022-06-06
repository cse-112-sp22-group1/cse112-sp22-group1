import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

let eventObject = {};

/**
 * Creates and stores a new event created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {String} title The title of the event.
 * @param {Array<String>} references The id of the references of the new dailyLog.
 * @param {Date} date The date of the event (optional).
 * @param {doubleParameterCallback} callback Eihter sends the newly created dailyLog or an error if there is one to the callback.
 */
export function createEventPouch (db, title, references, date, callback) {
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
		} else {
			let id = makeid(user);

			eventObject = {
				id: id,
				objectType: "event",
				title: title,
				references: references,
				date: date
			};


			user.events.push(eventObject);

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
					callback(null, eventObject);
				}
				/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
			});
		}
	});
}
