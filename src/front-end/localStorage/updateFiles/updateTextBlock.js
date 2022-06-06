import * as localStorage from "../userOperations.js";

/**
 * Handles sub-component deletion for a given block if needed
 * @memberof createFunctions
 * @param {Object} textBlock The textblock parent object
 * @param {Object} originalBlock The original textblock parent object
 * @param {doubleParameterCallback} callback Callback after sub-component has been handled
 */
 function handleOriginalSubComponent (textBlock, originalBlock, callback) {
	localStorage.readUser((err, user) => {
		if (err) {
			callback(err, null);
		} else if (textBlock.objectReference === originalBlock.objectReference) {
				callback(null, textBlock);
			} else if (originalBlock.kind === "event") {
					let originalEvent = user.events.filter((event) => event.id === originalBlock.objectReference)[0];
					originalEvent.references = originalEvent.references.filter((reference) => reference !== textBlock.id);
					localStorage.updateEvent(originalEvent, null, null, false, (error) => {
						callback(error, textBlock);
					});
				} else if (originalBlock.kind === "task") {
					let originalTask = user.tasks.filter((task) => task.id === originalBlock.objectReference)[0];
					originalTask.references = originalTask.references.filter((reference) => reference !== textBlock.id);
					localStorage.updateTask(originalTask, null, null, false, (error) => {
						callback(error, textBlock);
					});
				} else {
					callback(null, textBlock);
				}
	});
 }

 /**
  * Handles sub-component alteration and creation for a given block if needed
  * @memberof createFunctions
  * @param {database} db
  * @param {Object} textBlock The textblock parent object
  * @param {Object} originalBlock The original textblock parent object
  * @param {Date}
  * @param {doubleParameterCallback} callback Callback after sub-component has been handled
  */
  function handleNewSubComponent (textBlock, originalBlock, date, callback) {
	localStorage.readUser((err, user) => {
		if (err) {
			callback(err, null);
		} else if (textBlock.objectReference === originalBlock.objectReference && date) {
				if (textBlock.objectReference && originalBlock.kind === "event") {
					let event = user.events.filter((reference) => reference.id === textBlock.objectReference)[0];
					event.references = event.references.filter((reference) => reference !== textBlock.id);
					localStorage.updateEvent(event, null, null, false, (error) => {
						callback(error, textBlock);
					});
				} else {
					callback(null, textBlock);
				}
			} else if (textBlock.kind === "task") {
					/* istanbul ignore next */
					localStorage.createTask([textBlock.id], textBlock.text, 0, false, (failedCreateTask, task) => {
						/* istanbul ignore next */
						if (failedCreateTask) {
							/* istanbul ignore next */
							callback(failedCreateTask, null);

							/* istanbul ignore next */
						} else {
							textBlock.objectReference = task.id;
							callback(null, textBlock);

						}
					});
				} else if (textBlock.kind === "event") {
					/* istanbul ignore next */
					localStorage.createEvent(textBlock.text, [textBlock.id], date, false, (failedCreateEvent, journalEvent) => {
						/* istanbul ignore next */
						if (failedCreateEvent) {
							/* istanbul ignore next */
							callback(failedCreateEvent, null);

							/* istanbul ignore next */
						} else {
							textBlock.objectReference = journalEvent.id;
							callback(null, textBlock);

						}
					});
				} else {
					/* istanbul ignore next */
					callback(null, textBlock);
				}
	});
 }

/**
 * Finds and update the textBlock passed in.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {Object} textBlock The textBlock to be updated.
 * @param {Object} date The date
 * @param {Object} parent The parent of the textBlock being updated
 * @param {Object} addParent The new parent of the textBlock
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
export function updateTextBlockPouch (db, textBlock, date, parent, addParent, callback) {
	localStorage.readUser((err, user) => {
		if (err) {
			callback(err);
		} else {

			let oldBlock = user.textBlocks.filter((block) => block.id === textBlock.id)[0];
			handleOriginalSubComponent(textBlock, oldBlock, (failedOriginalChange, processedBlock) => {
				if (failedOriginalChange) {
					callback(failedOriginalChange);

				} else {
					handleNewSubComponent(processedBlock, oldBlock, date, (failedNewChange, newTextBlock) => {
						if (failedNewChange) {
							callback(failedNewChange);

						} else {
							localStorage.readUser((failedToRead, updatedUser) => {
								if (failedToRead) {
									callback(failedToRead);

								} else {
									if (parent && addParent && newTextBlock.parent !== parent.id) {
										parent.content = parent.content.filter((block) => block !== textBlock.id);
										updatedUser[`${parent.objectType}s`] = updatedUser[`${parent.objectType}s`].filter((object) => object.id !== parent.id);
										updatedUser[`${parent.objectType}s`].push(parent);
										addParent.content.push(textBlock.id);
										updatedUser[`${addParent.objectType}s`] = updatedUser[`${addParent.objectType}s`].filter((object) => object.id !== addParent.id);
										updatedUser[`${addParent.objectType}s`].push(addParent);
									} else if (updatedUser.textBlocks.filter((block) => block.id === textBlock.id)[0].parent !== textBlock.parent) {
										callback("You are changing the parent without providing the original and old one");
										return;
									}
									updatedUser.textBlocks = updatedUser.textBlocks.filter((block) => block.id !== newTextBlock.id);
									updatedUser.textBlocks.push(newTextBlock);
									let newUser = {
										_id: "0000",
										_rev: updatedUser._rev,
										email: updatedUser.email,
										theme: updatedUser.theme,
										index: updatedUser.index,
										dailyLogs: updatedUser.dailyLogs,
										monthlyLogs: updatedUser.monthlyLogs,
										futureLogs: updatedUser.futureLogs,
										trackers: updatedUser.trackers,
										collections: updatedUser.collections,
										imageBlocks: updatedUser.imageBlocks,
										audioBlocks: updatedUser.audioBlocks,
										textBlocks: updatedUser.textBlocks,
										tasks: updatedUser.tasks,
										Tasks: updatedUser.events,
										signifiers: updatedUser.signifiers
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
					});
				}
			});
		}
	});
}
