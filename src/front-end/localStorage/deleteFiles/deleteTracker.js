import { readUser } from "../userOperations";

/**
 * Finds and deletes the tracker.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {String} id The id of the object to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteTrackerPouch (db, id, callback) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {
			let trackerArr = user.trackers.filter((tracker) => tracker.id === id);
			console.log(trackerArr);
			console.log(id);
			let block = null;
			if (trackerArr.length > 0) {
				block = trackerArr[0];
				let userArr = [];
				Array.prototype.push.apply(userArr, user.dailyLogs);
				Array.prototype.push.apply(userArr, user.monthlyLogs);
				Array.prototype.push.apply(userArr, user.futureLogs);
				Array.prototype.push.apply(userArr, user.collections);

				let parentArr = userArr.filter((object) => object.id === block.parent);
				let parent = parentArr[0];
				parent.trackers = parent.trackers.filter((obj) => obj !== block.id);
				if (parent.recurringTrackers) {
					parent.recurringTrackers = parent.recurringTrackers.filter((obj) => obj !== block.id);
				}
				user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
				user[`${parent.objectType}s`].push(parent);
				let allReferences = userArr.filter((reference) => reference.trackers.includes(id));
				for (let i = 0; i < allReferences.length; i++) {
					let reference = allReferences[i];
					reference.trackers = reference.trackers.filter((tracker) => tracker !== id);
					user[`${reference.objectType}s`] = user[`${reference.objectType}s`].filter((object) => object.id !== reference.id);
					user[`${reference.objectType}s`].push(reference);
				}
				user.trackers = user.trackers.filter((tracker) => tracker.id !== id);

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
					} else {
						callback("something happen");
					}
				});
			}
				callback(null);


		}
	});
}
