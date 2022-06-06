import { readUser } from "../userOperations";

/**
 * Finds and update the audioBlock passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} audioBlock The audioBlock to be updated.
 * @param {Object} parent The parent of the audioBlock being updated
 * @param {Object} addParent The new parent of the audioBlock
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateAudioBlockPouch (db, audioBlock, parent, addParent, callback) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			if (parent && addParent && audioBlock.parent !== parent.id) {
				parent.content = parent.content.filter((block) => block !== audioBlock.id);
				user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
				user[`${parent.objectType}s`].push(parent);
				addParent.content.push(audioBlock.id);
				user[`${addParent.objectType}s`] = user[`${addParent.objectType}s`].filter((object) => object.id !== addParent.id);
				user[`${addParent.objectType}s`].push(addParent);
			} else if (user.audioBlocks.filter((block) => block.id === audioBlock.id)[0].parent !== audioBlock.parent) {
				callback("You are changing the parent without providing the original and old one");
				return;
			}

			user.audioBlocks = user.audioBlocks.filter((element) => element.id !== audioBlock.id);
			user.audioBlocks.push(audioBlock);

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
				tasks: user.tasks,
				events: user.events,
				signifiers: user.signifiers
			};

			return db.put(newUser).then((res) => {
				/* istanbul ignore next */
				if (res.ok) {
					callback(null);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	});
}
