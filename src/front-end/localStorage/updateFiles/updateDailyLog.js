import { readUser } from "../userOperations";

/**
 * Finds and update the dailyLog passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} dailyLog The dailyLog to be updated.
 * @param {Object} parent The parent of the dailyLog being updated
 * @param {Object} addParent The new parent of the dailyLog
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function updateDailyLogPouch (db, dailyLog, parent, addParent, callback) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			if (parent && addParent && dailyLog.parent !== parent.id) {
				parent.days = parent.days.filter((day) => day.id !== dailyLog.id);
				user.monthlyLogs = user.monthlyLogs.filter((object) => object.id !== parent.id);
				user.monthlyLogs.push(parent);
				addParent.days.push({
					id: dailyLog.id,
					date: dailyLog.date
				});
				user.monthlyLogs = user.monthlyLogs.filter((object) => object.id !== addParent.id);
				user.monthlyLogs.push(addParent);
			} else if (user.dailyLogs.filter((block) => block.id === dailyLog.id)[0].parent !== dailyLog.parent) {
				callback("You are changing the parent without providing the original and old one");
				return;
			}

			let dailyLogArr = user.dailyLogs.filter((element) => element.id !== dailyLog.id);
			dailyLogArr.push(dailyLog);
			let newUser = {
				_id: "0000",
				_rev: user._rev,
				email: user.email,
				theme: user.theme,
				index: user.index,
				dailyLogs: dailyLogArr,
				monthlyLogs: user.monthlyLogs,
				futureLogs: user.futureLogs,
				collections: user.collections,
				trackers: user.trackers,
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
					callback(null);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
