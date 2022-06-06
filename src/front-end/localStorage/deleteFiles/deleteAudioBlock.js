import { readUser } from "../userOperations.js";

/**
 * Finds and deletes the audioBlock.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {String} id The id of the object to be deleted.
 * @param {Log} parent The parent containing the audio block.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteAudioBlockPouch (db, id, parent, callback) {
	readUser((error, user) => {
		if (error) {
			callback(error);
		} else {
			const audioBlockArr = user.audioBlocks.filter((audioBlock) => audioBlock.id === id);
			let block = null;
			if (audioBlockArr.length > 0) {
				block = audioBlockArr[0];
			}
			if (parent === null) {
				let userArr = [];
				Array.prototype.push.apply(userArr, user.dailyLogs);
				Array.prototype.push.apply(userArr, user.monthlyLogs);
				Array.prototype.push.apply(userArr, user.futureLogs);
				Array.prototype.push.apply(userArr, user.trackers);
				Array.prototype.push.apply(userArr, user.collections);

				let parentArr = userArr.filter((object) => object.id === block.parent);
				parent = parentArr[0];
			}

			let newContents = parent.content.filter((obj) => obj !== id);
			parent.content = newContents;

			let newAudioBlocks = user.audioBlocks.filter((audioBlock) => audioBlock.id !== id);
			user.audioBlocks = newAudioBlocks;

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
			}).catch((err) => {
				callback(err);
			});
		}
	});
}
