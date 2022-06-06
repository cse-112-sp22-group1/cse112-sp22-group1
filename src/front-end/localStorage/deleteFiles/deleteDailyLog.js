import * as aux from "./deleteAuxiliarFunctions.js";
import * as localStorage from "../userOperations.js";

/**
 * Finds and deletes the monthlyLog and all children associated
 * @memberof deleteFunctions
 * @param {Database} db
 * @param {Object} log
 * @param {Object} parent
 * @param {singleParameterCallback} callback
 */
export function deleteDailyLogPouch (db, log, parent, callback) {
	aux.handleContent(log, (failedContent, preProcessedLog) => {
		if (failedContent) {
			callback(failedContent);
		} else {
			aux.handleTrackers(preProcessedLog, (failedTrackerHandle, processedLog) => {
				if (failedTrackerHandle) {
					callback(failedTrackerHandle);
				} else {
					localStorage.readUser((err, updatedUser) => {
						if (err) {
							callback(err);
						} else {
							if (parent) {
								parent.days = parent.days.filter((reference) => reference.id !== processedLog.id);
								updatedUser.monthlyLogs = updatedUser.monthlyLogs.filter((month) => month.id !== parent.id);
								updatedUser.monthlyLogs.push(parent);
							}

							updatedUser.dailyLogs = updatedUser.dailyLogs.filter((dailyLog) => dailyLog.id !== processedLog.id);
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
			})
		}
	});
}
