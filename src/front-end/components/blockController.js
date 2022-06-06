
/**
 * Block Controller Module
 * @module blockControllerModule
 */
import * as localStorage from "../localStorage/userOperations.js";
import { TextBlock } from "./block.jsx";

/**
 * Controller for TextBlock object
 */
export class BlockController extends Object {

	/**
	 * @param {HTMLElement} container
	 * @param {Object} parent
	 * @param {String} subParent
	 */
	constructor (container, parent, subParent) {
		super();
		this.blockArray = [];
		this.creatingFromBullet = {isTrue: false, kind: ""};
		this.currentTabLevel = 0;
		this.resetPosition = true;
		this.currentBlockIndex = 0;
		this.container = container;
		this.parent = parent;
		this.subParent = subParent;
	}

	/**
	 * Creates new block in container from a stored block
	 * @param {*} block
	 * @param {*} signifier
	 * @param {*} callback
	 */
	createNewBlock (block, signifier, callback) {
		if (block.objectType === "textBlock") {
			let newBlock = new TextBlock(this, block, signifier, (success) => {
				if (success) {
					if (this.currentBlockIndex < this.blockArray.length - 1) {
						this.container.insertBefore(newBlock, this.blockArray[this.currentBlockIndex + 1]);
						this.blockArray.splice(this.currentBlockIndex + 1, 0, newBlock);
						this.currentBlockIndex += 1;
					} else {
						this.container.appendChild(newBlock);
						this.blockArray.push(newBlock);
						this.currentBlockIndex = this.blockArray.length - 1;
					}
					newBlock.focus();
					callback(newBlock);
				}
			});
		} else if (block.objectType === "imageBlock") {
			console.log("it was image");
		}
	}

	/**
	 * Adds a new block from an enter key press in a TextBlock object
	 * @param {Object} block Stored block
	 */
	addNewBlock (block) {
		let newBlock = new TextBlock(this, block, this.generalSignifier, (success) => {
			if (success) {
				if (this.blockArray[this.currentBlockIndex].nextSibling === null) {
					this.container.appendChild(newBlock);
					this.blockArray.push(newBlock);
					this.currentBlockIndex = this.blockArray.length - 1;
				} else {
					this.container.insertBefore(newBlock, this.blockArray[this.currentBlockIndex].nextSibling);
					this.blockArray.splice(this.currentBlockIndex + 1, 0, newBlock);
					this.currentBlockIndex += 1;
				}
				newBlock.focus();
			}
		});
	}


	/**
	 * Moves the cursor to the immediatly next block
	 */
	moveToNextBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		if (this.currentBlockIndex < this.blockArray.length - 1) {
			let nextBlock = this.blockArray[this.currentBlockIndex + 1];
			nextBlock.moveToSpot(currentBlock.currentPointerSpot, false);
		}
	}


	/**
	 * Moves the cursor to the immediatly previous block
	 */
	moveToPreviousBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		if (this.currentBlockIndex > 0) {
			let nextBlock = this.blockArray[this.currentBlockIndex - 1];
			nextBlock.moveToSpot(currentBlock.currentPointerSpot, true);
		}
	}

	/**
	 * Removes the currently focused array
	 */
	removeBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		this.blockArray.splice(this.currentBlockIndex, 1);
		this.currentBlockIndex = this.currentBlockIndex === 0 ? this.currentBlockIndex : this.currentBlockIndex - 1;
		console.log(this.currentBlockIndex);
		let nextBlock = this.blockArray[this.currentBlockIndex];
		console.log(nextBlock);
		nextBlock.moveToSpot(100000, false);
		this.container.removeChild(currentBlock);
	}
}

/**
 * This is a recursive function that populates the current page with textBlocks and trackers,
 * from where the block controller comes from.
 *
 * @param {Object} controller The html content wrapper to populate.
 * @param {Array} items An array of textBlocks or trackers to populate the page with.
 * @param {Number} index The current index in the items array to populate the page with.
 * @param {response} callback Either sends an error if there is one or sends a message when it is done populating.
 */
 function populateEditorRecursive (controller, items, index, signifiers, callback) {
	if (index < items.length) {
		let signifier = signifiers.filter((currentSignifier) => currentSignifier.id === items[index].signifier)[0];
		controller.createNewBlock(items[index], signifier, (block) => {
			block.tabLevel = items[index].tabLevel
			block.setupTabLevel();

			if (items[index].kind === "note") {
				block.setupNote();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});
			} else if (items[index].kind === "event") {
				block.setupEvent();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});

			} else if (items[index].kind === "task") {
				console.log(items[index]);
				block.setupTask();
				localStorage.readUser((err, user) => {
					if (err === null) {
						let task = user.tasks.filter((currentTask) => currentTask.id === items[index].objectReference)[0];
						console.log(task);
						if (task.complete === 1) {
							block.checkBox.setAttribute("checked", "checked");
							block.shadowRoot.getElementById("textBlock").classList.add("crossed");
						}
						block.item = items[index];
						block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
						populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
							callback(res);
						});
					} else {
						console.log(err);
					}
				});
			} else if (items[index].kind === "h1") {
				block.setupHeader1();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});
			} else if (items[index].kind === "h2") {
				block.setupHeader2();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});
			} else if (items[index].kind === "h3") {
				block.setupHeader3();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});
			} else {
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;
				populateEditorRecursive(controller, items, index + 1, signifiers, (res) => {
					callback(res);
				});
			}
		});
	} else {
		callback("done populating items");
	}
}

/**
 * Calls the recursive function to populate the editor with existing textBlocks.
 *
 * @param {Object} controller The html content wrapper to populate.
 * @param {Array} items An item of objects to populate the editor with.
 * @param {response} callback Sends back an error if there is one or a message to the callback.
 */
export function populateEditor (controller, items, signifiers, callback) {
	populateEditorRecursive(controller, items, 0, signifiers, (res) => {
		callback(res);
	});
}

/**
 * Create a text editor in either a futurLog, monthlyLog, dailyLog, collection, or tracker page.
 *
 * @param {Array} container The html content wrapper to add the editor to.
 * @param {Object} parent The id of the parent of the textBlock being created.
 * @param {String} subParent The id of the child within the parent's content list.
 * @param {response} callback Either sends an error if there is one or sends back the block controller to the callback.
 */
export function createEditor (container, parent, subParent, callback) {
	console.log(subParent);
	let controller = new BlockController(container, parent, subParent);
	setTimeout(() => {
		let itemObject = null;
		let objectArr = [];
		localStorage.readUser((err, doc) => {
			if (err) {
				callback(err);
			} else {
				let arrays = [];
				Array.prototype.push.apply(arrays, doc.dailyLogs);
				Array.prototype.push.apply(arrays, doc.monthlyLogs);
				Array.prototype.push.apply(arrays, doc.futureLogs);
				Array.prototype.push.apply(arrays, doc.collections);
				Array.prototype.push.apply(arrays, doc.trackers);

				let generalSignifier = doc.signifiers.filter((signifer) => signifer.meaning === "general")[0];
				controller.generalSignifier = generalSignifier;

				if (parent !== null && parent.objectType !== "index") {
					let itemArrs = arrays.filter((element) => element.id === parent.id);
					if (itemArrs.length > 0) {
						itemObject = itemArrs[0];

						let tempArr = doc.textBlocks;

						if (!subParent) {
							if (!itemObject.content) {
								itemObject.content = [];
							}
							for (let i = 0; i < itemObject.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter((element) => element.id === itemObject.content[i]));
							}

						} else if (itemObject.objectType === "monthlyLog") {
							let day = itemObject.days.filter((currentDay) => currentDay.dailyLog === subParent)[0];
							for (let i = 0; i < day.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter((element) => element.id === day.content[i]));
							}
						} else if (itemObject.objectType === "futureLog") {
							let month = itemObject.months.filter((currentMonth) => currentMonth.monthlyLog === subParent)[0];
							for (let i = 0; i < month.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter((element) => element.id === month.content[i]));
							}
						}


						populateEditor(controller, objectArr, doc.signifiers, (res) => {
							if (res === "done populating items") {
								let newBlock = new TextBlock(controller, null, generalSignifier, (success) => {
									if (success) {
										container.appendChild(newBlock);
										controller.blockArray.push(newBlock);
										controller.currentBlockIndex = controller.blockArray.length - 1;
										newBlock.removeStyles();
										newBlock.focus();
									}
									callback(controller);
								});
							}
						})
					}
				} else {
					let newBlock = new TextBlock(controller, null, generalSignifier, (success) => {
						if (success) {
							container.appendChild(newBlock);
							controller.blockArray.push(newBlock);
							controller.currentBlockIndex = controller.blockArray.length - 1;
							newBlock.removeStyles();
							newBlock.focus();
							console.log("newblock created successfully");
						} else {
							console.log("newBlock not being created");
						}
						callback(controller);
					});
				}
			}
		})
	}, 20);
}
