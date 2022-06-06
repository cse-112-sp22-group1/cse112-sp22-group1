import { readUser } from "../userOperations";

/**
 * Finds and update the collection passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} collection The collection to be deleted.
 * @param {Object} parent The original parent
 * @param {Object} addParent The new parent
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateCollectionPouch (db, collection, parent, addParent, callback) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
		} else {

			if (parent && addParent && collection.parent !== parent.id) {
				parent.collections = parent.collections.filter((block) => block !== collection.id);
				user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
				user[`${parent.objectType}s`].push(parent);
				addParent.collections.push(collection.id);
				user[`${addParent.objectType}s`] = user[`${addParent.objectType}s`].filter((object) => object.id !== addParent.id);
				user[`${addParent.objectType}s`].push(addParent);
			} else if (user.collections.filter((block) => block.id === collection.id)[0].parent !== collection.parent) {
				callback("You are changing the parent without providing the original and old one");
				return;
			}

			let collectionArr = user.collections.filter((element) => element.id !== collection.id);
			collectionArr.push(collection);
			user.collections = collectionArr;
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
				if (res) {
					callback(null);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
