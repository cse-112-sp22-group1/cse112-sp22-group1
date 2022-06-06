import { deleteTask, readUser } from "../userOperations";

/**
 * Finds and update the task passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} task The task to be deleted.
 * @param {Object} reference The reference of the task being updated
 * @param {Object} addreference The new reference of the task
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateTaskPouch (db, task, reference, addReference, callback) {
	/* istanbul ignore next */
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
			/* istanbul ignore next */
		} else {

			if (reference && task.references.filter((block) => block === reference.id).length === 0) {
				reference.objectReference = null;
				user.textBlocks = user.textBlocks.filter((object) => object.id !== reference.id);
				user.textBlocks.push(reference);
				if (addReference) {
					addReference.objectReference = task.id;
					user.textBlocks = user.textBlocks.filter((object) => object.id !== addReference.id);
					user.textBlocks.push(addReference);
				}
			}

			user.tasks = user.tasks.filter((element) => element.id !== task.id);
			user.tasks.push(task);

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
				if (res) {
					if (task.references.length === 0) {
						deleteTask(task, false, (failedDeleteTask) => {
							callback(failedDeleteTask);
						});
					} else {
						callback(null);
					}
				}
				/* istanbul ignore next */
			}).catch((error) => callback(error));
		}
	})
}
