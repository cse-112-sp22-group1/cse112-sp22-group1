import * as localStorage from "../userOperations.js";
import {makeid} from "./makeId.js";

/**
 * Recursive function that adds monthlyLogs between start and end dates to futureLog
 * @static
 * @memberof createFunctions
 * @param {Date} startDate The starting date of the futureLog.
 * @param {Date} end The ending date of the futureLog.
 * @param {FutureLog} futureLog The futureLog to add the monthlyLogs to.
 * @param {singleParameterCallback} callback Either sends an array of the monthlyLogs added or sends an error, if ther is one, to the callback.
 */
function addMonths (startDate, end, futureLog, callback) {
	let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
	let nextMonth = new Date(endDate);
	if (startDate > end) {
		callback([]);
		return;
	} else if (nextMonth.setMonth(nextMonth.getMonth() + 1, 1) > end) {
		endDate = end;
	}
	localStorage.createMonthlyLog(futureLog.id, [], [], [], futureLog.recurringTrackers, startDate, endDate, false, (err, month) => {
		/* istanbul ignore next */
		if (err === null) {
			let newStart = new Date(startDate.getTime());
			newStart.setDate(1);
			newStart.setMonth(newStart.getMonth() + 1);
			addMonths(newStart, end, futureLog, (monthsIDArray) => {
				monthsIDArray.push({id: month.id, date: month.startDate});
				callback(monthsIDArray);
			});
		} else {
			/* istanbul ignore next */
			console.log(err);
		}
	});
}

/**
 * Creates and stores a new futureLog created from the given parameters.
 * @memberof createFunctions
 * @param {database} db The local pouch database.
 * @param {String} title The title of the future log.
 * @param {Date} startDate The start date of the futureLog.
 * @param {Date} endDate The end date of the futureLog.
 * @param {Array} months The ids of the months that are included by the futureLog.
 * @param {Array} content The ids of the textBlocks included in the futureLog.
 * @param {Array} collections The ids of the collections included in the futureLog.
 * @param {Array} trackers The ids of the trackers included by the futureLog.
 * @param {doubleParameterCallback} callback Eihter sends the newly created futureLog or an error if there is one to the callback.
 */
export function createFutureLogPouch (db, title, startDate, endDate, months, content, collections, trackers, callback) {
	let futureObject = {};
	localStorage.readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
			/* istanbul ignore next */
		} else {
			let id = makeid(user);

			futureObject = {
				id: id,
				objectType: "futureLog",
				title: title,
				startDate: startDate,
				endDate: endDate,
				months: months,
				content: content,
				collections: collections,
				trackers: trackers,
				recurringTrackers: []
			};

			user.futureLogs.push(futureObject);
			user.index.futureLogs.splice(0, 0, futureObject.id);

			return db.put({_id: "0000",
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
			}).then((res) => {
				/* istanbul ignore next */
				if (res.ok && months.length === 0) {
					addMonths(new Date(futureObject.startDate), new Date(futureObject.endDate), futureObject, (monthsIDArray) => {
						localStorage.readUser((error, loadedUser) => {
							/* istanbul ignore next */
							if (error) {
								/* istanbul ignore next */
								callback(err, null);
								/* istanbul ignore next */
							} else {
								monthsIDArray.reverse();
								futureObject.months = monthsIDArray;
								loadedUser.futureLogs[loadedUser.futureLogs.length - 1] = futureObject;
								let newUser = {
									_id: "0000",
									_rev: loadedUser._rev,
									email: loadedUser.email,
									theme: loadedUser.theme,
									index: loadedUser.index,
									dailyLogs: loadedUser.dailyLogs,
									monthlyLogs: loadedUser.monthlyLogs,
									futureLogs: loadedUser.futureLogs,
									collections: loadedUser.collections,
									trackers: loadedUser.trackers,
									imageBlocks: loadedUser.imageBlocks,
									audioBlocks: loadedUser.audioBlocks,
									textBlocks: loadedUser.textBlocks,
									tasks: loadedUser.tasks,
									events: loadedUser.events,
									signifiers: loadedUser.signifiers
								};

								db.put(newUser).then((monthCreate) => {
									/* istanbul ignore next */
									if (monthCreate.ok) {
										callback(null, futureObject);
									}
									/* istanbul ignore next */
								}).catch((noUpdate) => {
									/* istanbul ignore next */
									callback(noUpdate, null);
									/* istanbul ignore next */

								});
							}
						});
					});
				}
			/* istanbul ignore next */
			}).catch((error) => {
				/* istanbul ignore next */
				callback(error, null);
			});
			/* istanbul ignore next */
		}

	});
}
