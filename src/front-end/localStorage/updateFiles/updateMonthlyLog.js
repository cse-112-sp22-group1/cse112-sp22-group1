import { readUser } from "../userOperations";

/**
 * Finds and update the monthlyLog passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} log The monthlyLog to be deleted.
 * @param {Object} parent The parent of the monthlyLog being updated
 * @param {Object} addParent The new parent of the monthlyLog
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateMonthlyLogPouch (db, log, parent, addParent, callback) {
	/* istanbul ignore next */
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			if (parent && addParent && log.parent !== parent.id) {
				parent.months = parent.months.filter((month) => month.id !== log.id);
				user.futureLogs = user.futureLogs.filter((object) => object.id !== parent.id);
				user.futureLogs.push(parent);
				addParent.months.push({
					id: log.id,
					date: log.date
				});
				user.futureLogs = user.futureLogs.filter((object) => object.id !== addParent.id);
				user.futureLogs.push(addParent);
			} else if (user.monthlyLogs.filter((block) => block.id === log.id)[0].parent !== log.parent) {
				callback("You are changing the parent without providing the original and old one");
				return;
			}

			user.monthlyLogs = user.monthlyLogs.filter((element) => element.id !== log.id);
			user.monthlyLogs.push(log);
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
				events: user.events,
				tasks: user.tasks,
				signifiers: user.signifiers
			};

			return db.put(newUser).then((res) => {
				/* istanbul ignore next */
				if (res) {
					callback(null, log);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
