import * as aux from "./deleteAuxiliarFunctions.js";
import * as localStorage from "../userOperations.js";

/**
 * Deletes all days in a monthlyLog
 *
 * @param {Object} futureLog
 * @param {doubleParameterCallback} callback
 */
 function deleteMonths (futureLog, callback) {
	if (futureLog.months.length === 0) {
		callback(null, futureLog);
	} else {
		localStorage.readUser((err, user) => {
			if (err) {
				callback(err, null);
			} else {
				console.log(futureLog.months);
				localStorage.deleteMonthlyLog(user.monthlyLogs.filter((reference) => reference.id === futureLog.months[0].id)[0], futureLog, false, (error) => {
					if (error) {
						callback(error, null);
					} else {
						deleteMonths(futureLog, callback);
					}
				});
			}
		});
	}
}

/**
 * Finds and deletes the futureLog and deletes all children associated.
 * @memberof deleteFunctions
 * @param {Database} db The local pouch database.
 * @param {Object} log The object to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteFutureLogPouch (db, log, callback) {

	deleteMonths(log, (failedDeleteMonths, preProcessedLog) => {
		if (failedDeleteMonths) {
			callback(failedDeleteMonths);
		} else {
			console.log("hello there")
			aux.handleContent(preProcessedLog, (failedContentHandle, processedLog) => {
				if (failedContentHandle) {
					callback(failedContentHandle);
				} else {
					aux.handleTrackers(processedLog, (failedTrackerHandle, futureLog) => {
						if (failedTrackerHandle) {
							callback(failedTrackerHandle);
						} else {
							localStorage.readUser((err, user) => {
								if (err) {
									callback(err);
								} else {
									user.index.futureLogs = user.index.futureLogs.filter((reference) => reference !== futureLog.id);
									user.futureLogs = user.futureLogs.filter((reference) => reference.id !== futureLog.id);
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
									}

									return db.put(newUser).then((res) => {
										if (res.ok) {
											callback(null);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}
