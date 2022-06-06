import { readUser } from "../userOperations.js";

/**
 * Finds and deletes the imageBlock.
 * @memberof deleteFunctions
 * @param {database} db The local pouch database.
 * @param {String} id The id of the object to be deleted.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function deleteImageBlockPouch (db, id, callback) {
	readUser((error, user) => {
		if (error) {
			callback(error);
		} else {
			let imageBlockArr = user.imageBlocks.filter((imageBlock) => imageBlock.id === id);
			let block = null;
			console.log("textblockArr is ", imageBlockArr);
			if (imageBlockArr.length > 0) {
				block = imageBlockArr[0];
			}

			let userArr = [];
			Array.prototype.push.apply(userArr, user.dailyLogs);
			Array.prototype.push.apply(userArr, user.monthlyLogs);
			Array.prototype.push.apply(userArr, user.futureLogs);
			Array.prototype.push.apply(userArr, user.trackers);
			Array.prototype.push.apply(userArr, user.collections);

			let parentArr = userArr.filter((object) => object.id === block.parent);
			let parent = parentArr[0];

			if (parent.objectType === "dailyLog") {
				let newContents = parent.content.filter((obj) => obj !== id);
				parent.content = newContents;
			} else if (parent.objectType === "monthlyLog") {
				for (let i = 0; i < parent.days.length; i++) {
					if (parent.days[i].content.includes(id)) {
						let newContents = parent.days[i].content.filter((block2) => block2 !== id);
						parent.days[i].content = newContents;
					}
				}
			} else if (parent.objectType === "futureLog") {
				for (let i = 0; i < parent.months.length; i++) {
					if (parent.months[i].content.includes(id)) {
						let newContents = parent.months[i].content.filter((block2) => block2 !== id);
						parent.months[i].content = newContents;
					}
				}
			}


			let newImageBlocks = user.imageBlocks.filter((imageBlock) => imageBlock.id !== id);
			user.imageBlocks = newImageBlocks;
			let newUser = {_id: "0000",
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
			signifiers: user.signifiers};

			return db.put(newUser).then((res) => {
				if (res.ok) {
					callback(null);
				}
			}).catch((err) => {
				callback(err)
			});
		}
	});
}
