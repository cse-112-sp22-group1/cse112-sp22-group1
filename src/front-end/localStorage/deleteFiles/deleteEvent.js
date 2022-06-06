import { readUser } from "../userOperations";

/**
 * Finds and deletes the event.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {String} id The event of the object to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteEventPouch (db, id, callback) {
	readUser((err, user) => {
		if (err) {
			callback(err);
		} else {
			user.events = user.events.filter((event) => event.id !== id);
			let newUser = {
				_id: "0000",
				_rev: user._rev,
				email: user.email,
				theme: user.theme,
				index: user.index,
				dailyLogs: user.dailyLogs,
				monthlyLogs: user.monthlyLogs,
				futureLogs: user.futureLogs,
				trackers: user.trackers,
				collections: user.collections,
				imageBlocks: user.imageBlocks,
				audioBlocks: user.audioBlocks,
				textBlocks: user.textBlocks,
				tasks: user.tasks,
				events: user.events,
				signifiers: user.signifiers
			};

			return db.put(newUser).then((res) => {
				if (res.ok) {
					callback(null);
				}
			});
		}
	})
}
