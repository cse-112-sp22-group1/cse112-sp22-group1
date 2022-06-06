import { readUser } from "../userOperations";

/**
 * Finds and deletes the signifier.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {String} id The id of the object to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteSignifierPouch (db, id, callback) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			let newTextBlocks = user.textBlocks;
			newTextBlocks.forEach((block) => {
				block.signifiers = block.signifiers.filter((signifier) => signifier.id !== id);
			});
			user.textBlocks = newTextBlocks;

			user.signifiers = user.signifiers.filter((signifier) => signifier.id !== id);
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
					callback(null);
				}
			});
		}
	})
}
