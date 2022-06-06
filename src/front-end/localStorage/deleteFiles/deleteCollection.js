import * as aux from "./deleteAuxiliarFunctions.js";
import * as localStorage from "../userOperations";

/**
 * Finds and deletes the collection.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {Object} collection The object to be deleted.
 * @param {Object} parent The parent of the collection
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteCollectionPouch (db, collection, parent, callback) {
	aux.handleContent(collection, (failContentHandle, preProcessedCollection) => {
		if (failContentHandle) {
			callback(failContentHandle);
		} else {
			aux.handleTrackers(preProcessedCollection, (failedTrackerHandle, processedCollection) => {
				if (failedTrackerHandle) {
					callback(failedTrackerHandle);
				} else {
					localStorage.readUser((error, user) => {
						if (error) {
							callback(error);
						} else {
							if (processedCollection.parent === null) {
								user.index.collections = user.index.collections.filter((id) => id !== processedCollection.id);
							} else {
								if (parent === null) {
									let userArr = [];
									Array.prototype.push.apply(userArr, user.dailyLogs);
									Array.prototype.push.apply(userArr, user.monthlyLogs);
									Array.prototype.push.apply(userArr, user.futureLogs);
									Array.prototype.push.apply(userArr, user.collections);

									let parentArr = userArr.filter((object) => object.id === processedCollection.parent);
									if (parentArr.length > 0) {
										parent = parentArr[0];
										parent.collections = parent.collections.filter((id) => id !== processedCollection.id);
									}

								} else {
									parent.collections = parent.collections.filter((id) => id !== processedCollection.id);
								}
								user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
								user[`${parent.objectType}s`].push(parent);
							}

							user.collections = user.collections.filter((newCollection) => newCollection.id !== processedCollection.id);

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
					});
				}
			})
		}
	});
}
