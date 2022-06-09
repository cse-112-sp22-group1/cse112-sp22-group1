import * as aux from "./deleteAuxiliarFunctions.js";
import * as localStorage from "../userOperations.js";

/**
 * Deletes all days in a monthlyLog
 *
 * @param {Object} monthlyLog
 * @param {doubleParameterCallback} callback
 */
function deleteDays (monthlyLog, callback) {
	localStorage.readUser((err, user) => {
		if (err) {
			callback(err, null);
		} else if (monthlyLog.days.length === 0) {
			callback(null, monthlyLog);
		} else {
			localStorage.deleteDailyLog(user.dailyLogs.filter((reference) => reference.id === monthlyLog.days[0].id)[0], monthlyLog, false, (error) => {
				if (error) {
					callback(error, null);
				} else {
					deleteDays(monthlyLog, callback);
				}
			});
		}
	})
}

/**
 * Finds and deletes the monthlyLog and all children associated
 * @memberof deleteFunctions
 * @param {Database} db
 * @param {Object} log
 * @param {Object} parent
 * @param {singleParameterCallback} callback
 */
export function deleteMonthlyLogPouch (db, log, parent, callback) {
	deleteDays(log, (failedDeleteDays, preProcessedMonth) => {
		console.log("deleted days");
		if (failedDeleteDays) {
			console.log(failedDeleteDays);
			callback(failedDeleteDays);
		} else {
			aux.handleContent(preProcessedMonth, (failedContentHandle, processedMonth) => {
				if (failedContentHandle) {
					console.log(failedContentHandle);
					callback(failedContentHandle);
				} else {
					aux.handleTrackers(processedMonth, (failedTrackerHandle, monthlyLog) => {
						if (failedTrackerHandle) {
							console.log(failedTrackerHandle);
							callback(failedTrackerHandle);
						} else {
							console.log("we break trhough");
							localStorage.readUser((err, updatedUser) => {
								if (err) {
									callback(err);
								} else {
									if (parent) {
										parent.months = parent.months.filter((reference) => reference.id !== monthlyLog.id);
										updatedUser.futureLogs = updatedUser.futureLogs.filter((futureLog) => futureLog.id !== parent.id);
										updatedUser.futureLogs.push(parent);
									}
									updatedUser.monthlyLogs = updatedUser.monthlyLogs.filter((month) => month.id !== monthlyLog.id);
									let newUser = {
										_id: "0000",
										_rev: updatedUser._rev,
										email: updatedUser.email,
										theme: updatedUser.theme,
										index: updatedUser.index,
										dailyLogs: updatedUser.dailyLogs,
										monthlyLogs: updatedUser.monthlyLogs,
										futureLogs: updatedUser.futureLogs,
										collections: updatedUser.collections,
										trackers: updatedUser.trackers,
										imageBlocks: updatedUser.imageBlocks,
										audioBlocks: updatedUser.audioBlocks,
										textBlocks: updatedUser.textBlocks,
										tasks: updatedUser.tasks,
										events: updatedUser.events,
										signifiers: updatedUser.signifiers
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
