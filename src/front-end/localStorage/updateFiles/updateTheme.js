import { readUser } from "../userOperations";

/**
 * Finds and update the theme passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {String} theme The theme to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateThemePouch (db, theme, callback) {
	/* istanbul ignore next */
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {
			let newUser = {
				_id: "0000",
				_rev: user._rev,
				email: user.email,
				theme: theme,
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
				if (res) {
					callback(null);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
