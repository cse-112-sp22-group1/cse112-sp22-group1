import * as localStorage from "../userOperations.js";

/**
 *
 * @param {Object} collection Any collection (futureLog, monthlyLog, dailyLog, trackers, etc);
 * @param {doubleParameterCallback} callback
 */
export function handleContent (collection, callback) {
	if (collection.content.length === 0) {
		callback(null, collection);
	} else {
		localStorage.readUser((err, user) => {
			/* istanbul ignore next */
			if (err) {
				/* istanbul ignore next */
				callback(err, null);
				/* istanbul ignore next */
			} else {
				localStorage.deleteTextBlock(user.textBlocks.filter((block) => block.id === collection.content[0])[0], collection, false, (failedDeleteBlock) => {
					/* istanbul ignore next */
					if (failedDeleteBlock) {
						/* istanbul ignore next */
						callback(failedDeleteBlock, null);
						/* istanbul ignore next */
					} else {
						handleContent(collection, callback);
					}
				});
			}
		});
	}
}

export function handleTrackers (collection, callback) {
	localStorage.readUser((failedRead, user) => {
		if (failedRead) {
			callback(failedRead);
		} else {
			collection = user[`${collection.objectType}s`].filter((reference) => reference.id === collection.id)[0];
			let isNotRecurringTracker = !collection.recurringTrackers
			let isRecurringTrackerEmpty = collection.recurringTrackers && collection.recurringTrackers.length === 0;
			let doneRecurring = isNotRecurringTracker || isRecurringTrackerEmpty;
			if (collection.trackers.length === 0 && doneRecurring) {
				console.log("finished this");
				callback(null, collection);
			} else {
				localStorage.deleteTrackerByID(collection.trackers[0], false, (failedDeleteTracker) => {
					/* istanbul ignore next */
					if (failedDeleteTracker) {
						/* istanbul ignore next */
						console.log("failed original");
						callback(failedDeleteTracker, null);
						/* istanbul ignore next */
					} else if (collection.recurringTrackers && collection.recurringTrackers.length > 0) {
						localStorage.deleteTrackerByID(collection.recurringTrackers[0], false, (failedDeleteRecurringTracker) => {
							/* istanbul ignore next */
							if (failedDeleteRecurringTracker) {
								/* istanbul ignore next */
								console.log("failed recurring");
								callback(failedDeleteRecurringTracker, null);
								/* istanbul ignore next */
							} else {
								console.log("handling next iteration");
								handleTrackers(collection, callback);
							}
						});
					} else {
						console.log("handling next iteration without recurring")
						handleTrackers(collection, callback);
					}
				});
			}
		}
	})
}
