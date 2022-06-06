import { readUser } from "../userOperations";

/**
 * Finds and update the imageBlock passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} imageBlock The imageBlock to be deleted.
 * @param {Object} parent The parent of the imageBlock being updated
 * @param {Object} addParent The new parent of the imageBlock
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateImageBlockPouch (db, imageBlock, parent, addParent, callback) {
	/* istanbul ignore next */
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			if (parent && addParent && imageBlock.parent !== parent.id) {
				parent.content = parent.content.filter((block) => block !== imageBlock.id);
				user[`${parent.objectType}s`] = user[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
				user[`${parent.objectType}s`].push(parent);
				addParent.content.push(imageBlock.id);
				user[`${addParent.objectType}s`] = user[`${addParent.objectType}s`].filter((object) => object.id !== addParent.id);
				user[`${addParent.objectType}s`].push(addParent);
			} else if (user.imageBlocks.filter((block) => block.id === imageBlock.id)[0].parent !== imageBlock.parent) {
				callback("You are changing the parent without providing the original and old one");
				return;
			}

			let imageBlockArr = user.imageBlocks.filter((element) => element.id !== imageBlock.id);
			imageBlockArr.push(imageBlock);
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
				imageBlocks: imageBlockArr,
				audioBlocks: user.audioBlocks,
				textBlocks: user.textBlocks,
				tasks: user.tasks,
				events: user.events,
				signifiers: user.signifiers
			};

			return db.put(newUser).then((res) => {
				/* istanbul ignore next */
				if (res) {
					callback(res);
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
