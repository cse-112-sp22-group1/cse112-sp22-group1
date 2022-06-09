import { TextBlock } from "./block.js";
/* import * as localStorage from "../localStorage/userOperations.js";
 */
export class Controller extends Object {
	constructor(container, parent, subParent){
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

	createNewBlock(block, callback){
		let newBlock = new TextBlock(this, block, (success) => {
			if (this.currentBlockIndex < this.blockArray.length - 1){
				this.container.insertBefore(newBlock, this.blockArray[this.currentBlockIndex + 1]);
				this.blockArray.splice(this.currentBlockIndex + 1, 0, newBlock);
				this.currentBlockIndex = this.currentBlockIndex + 1;
			} else {
				this.container.appendChild(newBlock);
				this.blockArray.push(newBlock);
				this.currentBlockIndex = this.blockArray.length - 1;
			}
			newBlock.focus();
			callback(newBlock);
		});
	}
	
	addNewBlock (block) {
		let newBlock = new TextBlock(this, block, (success) => {
			if (this.currentBlockIndex < this.blockArray.length - 1){
				this.container.insertBefore(newBlock, this.blockArray[this.currentBlockIndex + 1]);
				this.blockArray.splice(this.currentBlockIndex + 1, 0, newBlock);
				this.currentBlockIndex = this.currentBlockIndex + 1;
			} else {
				this.container.appendChild(newBlock);
				this.blockArray.push(newBlock);
				this.currentBlockIndex = this.blockArray.length - 1;
			}
			newBlock.focus();
		});
	}

	moveToNextBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		if (this.currentBlockIndex < this.blockArray.length - 1){
			let nextBlock = this.blockArray[this.currentBlockIndex + 1];
			nextBlock.moveToSpot(currentBlock.currentPointerSpot, false);
		}
	}

	moveToPreviousBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		if (this.currentBlockIndex > 0){
			let nextBlock = this.blockArray[this.currentBlockIndex - 1];
			nextBlock.moveToSpot(currentBlock.currentPointerSpot, true);
		}
	}

	removeBlock () {
		let currentBlock = this.blockArray[this.currentBlockIndex];
		this.blockArray.splice(this.currentBlockIndex, 1);
		this.currentBlockIndex = (this.currentBlockIndex == 0) ? this.currentBlockIndex : this.currentBlockIndex - 1;
		console.log(this.currentBlockIndex);
		let nextBlock = this.blockArray[this.currentBlockIndex];
		console.log(nextBlock);
		nextBlock.moveToSpot(100000, false);
		this.container.removeChild(currentBlock);
	}
}

export function createEditor (container, parent, callback) {

	let controller = new Controller(container, parent, subParent);
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

				if(parent.objectType != "index") {
					let itemArrs = arrays.filter(element => element.id == parent.id);
						
					if(itemArrs.length > 0){
						itemObject = itemArrs[0];
						
						let tempArr = doc.textBlocks;

						if (subParent == null){
							for(let i = 0; i < itemObject.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter(element => element.id == itemObject.content[i]));
							}
						} else if (itemObject.objectType == "monthlyLog"){
							let day = itemObject.days.filter(day => day.id == subParent);
							for(let i = 0; i < day.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter(element => element.id == day.content[i]));
							}
						} else if (itemObject.objectType == "futureLog"){
							let month = itemObject.months.filter(month => month.id == subParent);
							for(let i = 0; i < month.content.length; i++) {
								Array.prototype.push.apply(objectArr, tempArr.filter(element => element.id == month.content[i]));
							}
						}
						

						populateEditor(controller, objectArr, (res) => {
							console.log(res);
							let newBlock = new TextBlock(controller, null, (success) => {
								if (success){
									container.appendChild(newBlock);
									controller.blockArray.push(newBlock);
									controller.currentBlockIndex = controller.blockArray.length - 1;
									newBlock.removeStyles();
									newBlock.focus();
								}
								callback(controller);
							});
						})
					}
				} else {
					let newBlock = new TextBlock(controller, null, (success) => {
						if (success){
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

export function populateEditor (controller, items, callback) {
	populateEditorRecursive(controller, items, 0, (res) => {
		callback(res);
	});
}

function populateEditorRecursive(controller, items, index, callback) {
	if(index < items.length) {
		controller.createNewBlock(items[index], (block) => {
	 		block.tabLevel = items[index].tabLevel
	 		block.setupTabLevel();
			
			if (items[index].kind == "note"){
				block.setupNote();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
			} else if (items[index].kind == "event"){
				block.setupEvent();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
				
			} else if (items[index].kind == "task") {
				console.log(items[index]);
				block.setupTask();
				localStorage.readUser((err, user) => {
					if (err == null){
						let task = user.tasks.filter(task => task.id == items[index].objectReference)[0];
						console.log(task);
						if (task.complete == 1){
							block.checkBox.setAttribute("checked", "checked");
							block.shadowRoot.getElementById("textBlock").classList.add("crossed");
						}
						block.item = items[index];
						block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
						populateEditorRecursive(controller, items, index + 1, (res) => {
							callback(res);
						});
					} else {
						console.log(err);
					}
				});
			} else if (items[index].kind == "h1") {
				block.setupHeader1();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
			} else if (items[index].kind == "h2") {
				block.setupHeader2();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
			} else if (items[index].kind == "h3"){
				block.setupHeader3();
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
			} else {
				block.item = items[index];
				block.shadowRoot.getElementById("textBlock").innerText = items[index].text;//= item.text;
				populateEditorRecursive(controller, items, index + 1, (res) => {
					callback(res);
				});
			}
	 	});
	} else {
		callback("done populating items");
	}
}