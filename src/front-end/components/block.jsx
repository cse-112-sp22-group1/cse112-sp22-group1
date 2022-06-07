/**
 * Text Block Module
 * @module textBlockModule
 */
import * as localStorage from "../localStorage/userOperations.js";
import * as shadow from "./shadow.js";
import { getDate, includesClock } from "./blockModel.js";
import { adderDropdown } from "../index.js";
import { BlockController } from "./blockController.js";
import { currentState } from "../state/stateManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

const tabSize = 20;
const paddingSize = 10;
const protectedKeys = ["Control", "Alt", "CapsLock", "Escape", "PageUp", "PageDown", "End", "Home", "PrintScreen", "Insert", "Delete", "Backspace", "Tab", "Enter", "Meta", "ArrowTop", "ArrowBottom", "ArrowRight", "ArrowLeft", "Shift", " "]

let blockTemplate = <template>
	<link type="text/css" rel="stylesheet" href="./block.css" />
	<div id="editorIcons" class="paragraphIcons"><img src="../public/resources/plusIcon.png" class="unfocusedIcons" id="plus" /><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more" /></div>
	<div id="checkerContainer" checked=""><div id="taskChecker"></div></div>
	<div id="textBlock" contentEditable="true" ondrop={()=>false} placeholder='Type "/" to create a block'></div>
	<aside id="signifiers">&#128540;</aside>
</template>;

/**
 * Class to create new editor block
 */
export class TextBlock extends HTMLElement {

	/**
	 * Editor block constructor
	 * @param {BlockController} controller - the editor's controller
	 * @param {Object} itemObject - the database item representing the editor
	 * @param {Object} signifier - the editor's current signifier
	 * @param {singleParameterCallback} callback - callback for the end of the constructor function
	 */
	constructor (controller, itemObject, signifiers, callback) {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(blockTemplate.content.cloneNode(true));
		this.characterIndex = 0;
		this.kind = "paragraph";
		this.initialHeight = 3;
		this.item = itemObject;
		this.controller = controller;
		this.shadowRoot.getElementById("textBlock").classList.add("unstylized");
		this.currentBlock = null;
		this.checkBox = this.shadowRoot.getElementById("checkerContainer");
		this.checkBox.style.display = "none";
		this.currentPointerSpot = 0;
		this.editorIcons = this.shadowRoot.getElementById("editorIcons");
		this.currentPointerHeight = 2;
		if (this.controller.creatingFromBullet.isTrue) {
			if (this.controller.creatingFromBullet.kind === "note") {
				this.setupNote();
			} else if (this.controller.creatingFromBullet.kind === "event") {
				this.setupEvent();
			} else {
				this.setupTask();
			}
		}
		this.tabLevel = controller.currentTabLevel;
		this.atPressed = false;
		this.hashPressed = false;
		this.timeSetter = false;
		this.dateSetter = false;
		this.eventDelete = true;
		this.signifiers = signifiers
		this.signifierIcon = this.shadowRoot.getElementById("signifier");
		this.plus = this.shadowRoot.getElementById("plus");
		this.more = this.shadowRoot.getElementById("more");
		let textBlock = this.shadowRoot.getElementById("textBlock");
		this.dropdownContents = {
			"text": [
			{
                title: "Heading 1",
				icon: "../public/resources/h1_icon.png",
                listener: ()=>{
					this.setupHeader1();
					adderDropdown.hide();
                }
            }, {
                title: "Heading 2",
                icon: "../public/resources/h2_icon.png",
                listener: ()=>{
					this.setupHeader2();
					adderDropdown.hide();
                }
            }, {
                title: "Heading 3",
                icon: "../public/resources/h3_icon.png",
                listener: ()=>{
					this.setupHeader3();
					adderDropdown.hide();
                }
            }, {
                title: "Note",
                icon: "../public/resources/note_icon.png",
                listener: ()=>{
					this.setupNote();
					adderDropdown.hide();
                }
            }, {
                title: "Event",
                icon: "../public/resources/event_icon.png",
                listener: ()=>{
					this.setupEvent();
					adderDropdown.hide();
                }
            }, {
                title: "Task",
                icon: "../public/resources/task_icon.png",
                listener: ()=>{
					this.setupTask();
					adderDropdown.hide();
                }
            }, {
                title: "Paragraph",
                icon: "../public/resources/paragraph_icon.png",
				listener: ()=>{
					adderDropdown.hide();
				}
            }
		],
		"transform": [
			{
				title: "Heading 1",
				icon: "../public/resources/h1_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupHeader1();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Heading 2",
				icon: "../public/resources/h2_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupHeader2();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Heading 3",
				icon: "../public/resources/h3_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupHeader3();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Note",
				icon: "../public/resources/note_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupNote();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Event",
				icon: "../public/resources/event_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupEvent();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Task",
				icon: "../public/resources/task_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.setupTask();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Paragraph",
				icon: "../public/resources/paragraph_icon.png",
				listener: ()=>{
					let content = textBlock.innerText;
					this.removeStyles();
					textBlock.innerText = content;
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}
		],
		"util": [
			{
				title: "Delete",
				icon: "../public/resources/delete_icon.png",
				listener: () => {
					if (this.controller.blockArray.length > 1) {
						this.controller.removeBlock();
					} else {
						this.removeStyles();
					}
					adderDropdown.hide();
					adderDropdown.hideSecondDropdown();
				}
			}, {
				title: "Duplicate",
				icon: "../public/resources/copy_icon.png",
				listener: ()=>{

				}
			}, {
				title: "Turn into",
				icon: "../public/resources/turn_into_icon.png",
				listener: ()=>{
					adderDropdown.openSecondDropdown(this.dropdownContents.transform);
				}
			}
		]
		}
		this.setupTabLevel();
		setTimeout(() => {
			callback(true);
		}, 30);
	}

	/**
	 * Keeps track of current location of textBlock
	 */
	setCurrentSpot () {
		let container = this.shadowRoot.getElementById("textBlock");
		let range = shadow.getRange(this.shadowRoot);
		if (range === null) {
			let computedTab = this.tabLevel * tabSize;
			this.currentPointerSpot = computedTab + paddingSize;
			this.currentPointerHeight = this.initialHeight;
		} else {
			let computedTab = this.tabLevel * tabSize;
			let preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(container);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			this.atPressed = false;
			this.hashPressed = false;
			includesClock(this, container.innerText.slice(0, range.endOffset), false);
			this.characterIndex = range.endOffset;
			this.currentPointerSpot = range.getClientRects()[0] === undefined ? computedTab + paddingSize : range.getClientRects()[0].x;
			this.currentPointerHeight = range.getClientRects()[0] === undefined ? this.initialHeight : range.getClientRects()[0].y - container.getBoundingClientRect().top;
		}

	}

	/**
	 * Moves the textBlock to the location it was last dragged to(?)
	 *
	 * @param {Number} newSpotToMove - the possible new spot to move to
	 * @param {Boolean} up - whether the cursor should move up or down
	 */
	moveToSpot (newSpotToMove, up) {
		let newSpot = newSpotToMove;
		let container = this.shadowRoot.getElementById("textBlock");
		if (container.childNodes.length > 0) {
			if (!this.controller.resetPosition) {
				newSpot = this.currentPointerSpot;
			}
			container.focus();
			let range = shadow.getRange(this.shadowRoot);
			container.blur();
			console.log(newSpot);
			console.log(newSpot);
			setTimeout(() => {
				let offset = 0;
				if (up) {
					offset = container.textContent.length;
				}
				range.setStart(container.childNodes[0], offset);
				let currentCoordinate = range.getClientRects()[0].x;
				let currentOffset = offset;
				let counter = 0;
				newSpot = Math.floor(newSpot);
				while (counter < 1000) {
					if (up) {
						offset = offset > 0 ? offset - 1 : offset;
					} else {
						offset = offset < container.textContent.length ? offset + 1 : offset;
					}
					range.setStart(container.childNodes[0], offset);
					range.collapse(true);
					let nextCoordinate = range.getClientRects()[0].x;
					if (Math.abs(Math.floor(currentCoordinate) - newSpot) <= Math.abs(Math.floor(nextCoordinate) - newSpot)) {
						range.setStart(container.childNodes[0], currentOffset);
						break;
					}
					currentCoordinate = nextCoordinate;
					currentOffset = offset;
					counter += 1;
				}
				range.collapse(true);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
				container.focus();
			}, 0.01);
		} else {
			container.focus();
		}

	}

	/**
	 * Sets up textBlock styling for header 1 text
	 */
	setupHeader1 () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.controller.creatingFromBullet = { isTrue: false, kind: "" };
		this.kind = "h1";
		this.initialHeight = 0;
		textBlock.setAttribute("placeholder", "Header 1");
		textBlock.classList.add("header1");
		this.editorIcons.classList.add("header1Icons");
		textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for header 2 text
	 */
	setupHeader2 () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.controller.creatingFromBullet = { isTrue: false, kind: "" };
		this.kind = "h2";
		this.initialHeight = 0;
		textBlock.setAttribute("placeholder", "Header 2");
		textBlock.classList.add("header2");
		this.editorIcons.classList.add("header2Icons");
		textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock syling for header 3 text
	 */
	setupHeader3 () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.controller.creatingFromBullet = { isTrue: false, kind: "" };
		this.kind = "h3";
		this.initialHeight = 0;
		textBlock.setAttribute("placeholder", "Header 3");
		textBlock.classList.add("header3");
		this.editorIcons.classList.add("header3Icons");
		textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for note text and adds bullet
	 */
	setupNote () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.kind = "note";
		this.controller.creatingFromBullet = { isTrue: true, kind: this.kind };
		this.initialHeight = 3;
		textBlock.setAttribute("placeholder", "Note");
		this.classList.add("noteContainer");
		this.editorIcons.classList.add("noteIcons");
		textBlock.classList.add("note");
		textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for event text and handles event date and time parsing
	 */
	setupEvent () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.kind = "event";
		this.controller.creatingFromBullet = { isTrue: true, kind: this.kind };
		this.initialHeight = 3;
		textBlock.setAttribute("placeholder", "Event:");
		let dateFiller = "";
		if (!this.timeSetter) {
			dateFiller = `${dateFiller} use @ for time HH:MM`;
			if (!this.dateSetter) {
				dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
			}
		} else if (!this.dateSetter) {
			dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
		}
		textBlock.setAttribute("dateFiller", dateFiller);
		this.classList.add("eventContainer");
		this.editorIcons.classList.add("noteIcons");
		textBlock.classList.add("note");
		textBlock.classList.add("eventNodateFocused");
		textBlock.innerHTML = "";
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for task text and adds task check off block
	 */
	setupTask () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.kind = "task";
		this.controller.creatingFromBullet = { isTrue: true, kind: this.kind };
		this.initialHeight = 3;
		textBlock.classList.add("task");
		textBlock.setAttribute("placeholder", "Task");
		textBlock.innerHTML = "";
		this.editorIcons.classList.add("paragraphIcons");
		this.checkBox.style.display = "inline";
	}

	/**
	 * Removes any styling from a textBlock in case one type of textblock
	 * is converted to a different one
	 */
	removeStyles () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		while (this.editorIcons.classList.length > 0) {
			this.editorIcons.classList.remove(this.editorIcons.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (this.classList.length > 0) {
			this.classList.remove(this.classList[0]);
		}
		this.kind = "paragraph";
		this.initialHeight = 3;
		textBlock.classList.add("unstylized");
		textBlock.setAttribute("placeholder", "Type \"/\" to create a block");
		textBlock.innerHTML = "";
		this.editorIcons.classList.add("paragraphIcons");
		this.controller.creatingFromBullet = { isTrue: false, kind: "" };
		this.checkBox.style.display = "none";
	}

	/**
	 * Sets the textBlocks indenting using the tab level as a multiple
	 */
	setupTabLevel () {
		this.style.position = "relative";
		let computedTab = this.tabLevel * tabSize;
		this.style.left = computedTab + "px";
		this.controller.currentTabLevel = this.tabLevel;
		this.setCurrentSpot();
	}

	setupSignifier (signifier) {
		this.signifier = signifier;
		this.signifierIcon.innerHTML = signifier.symbol;
	}

	/**
	 * When a textBlock is created, the editor is added to the page and if the block is a task
	 * then the text is crossed off
	 */
	connectedCallback () {

		let textBlock = this.shadowRoot.getElementById("textBlock");
		textBlock.focus();

		document.addEventListener(shadow.eventName, () => {
			this.controller.blockArray[this.controller.currentBlockIndex].setCurrentSpot();
		});

		this.plus.onclick = () => {
			this.controller.currentBlockIndex = this.controller.blockArray.indexOf(this);
			let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
			if (textBlock.innerText !== "" && textBlock.innerText !== "/") {
				this.controller.addNewBlock(null);
			} else {
				adderDropdown.openTextDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left, this.dropdownContents.text);
			}
		}

		this.more.onclick = () => {
			this.controller.currentBlockIndex = this.controller.blockArray.indexOf(this);
            let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
            adderDropdown.openUtilDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left, this.dropdownContents.util);
		}
		textBlock.oninput = () =>{
			let content = textBlock.innerHTML;
			if (content === "/") {
				let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
                adderDropdown.openTextDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left, this.dropdownContents.text);
			} else {
				adderDropdown.hide();
			}
		}

		/**
		 * @type {HTMLElement}
		 * @listens document#click
		 */
		this.checkBox.onclick = (e) => {
			if (this.checkBox.getAttribute("checked") === "checked") {
				this.checkBox.setAttribute("checked", "");
				textBlock.classList.remove("crossed");
				setTimeout(() => {
					localStorage.readUser((err, user) => {
						if (err === null) {
							let task = user.tasks.filter((currentTask) => currentTask.id === this.item.objectReference)[0];
							task.complete = 0;
							localStorage.updateTask(task, true, (error, taskBlock) => {
								console.log(error);
								console.log(taskBlock);
							})
						}
					});
				}, 10);
			} else {
				this.checkBox.setAttribute("checked", "checked");
				textBlock.classList.add("crossed");
				setTimeout(() => {
					localStorage.readUser((err, user) => {
						if (err === null) {
							let task = user.tasks.filter((currentTask) => currentTask.id === this.item.objectReference)[0];
							console.log(task)
							task.complete = 1;
							localStorage.updateTask(task, true, (error, taskBlock) => {
								console.log(error);
								console.log(taskBlock);
							})
						} else {
							console.log(err);
						}
					});
				}, 10);
			}
			e.preventDefault();
		}

		/**
		 * Gets the user's clipboard data, filters for valid editor text, and pastes it to the textBlock.
		 *
		 * @param {Event} e
		 */
		textBlock.onpaste = (e) => {
			// Get user's pasted data
			let data = e.clipboardData.getData("text/html") ||
				e.clipboardData.getData("text/plain");

			// Filter out everything except simple text and allowable HTML elements
			let regex = /<(?!(\/\s*)?(a|b|i|em|s|strong|u)[>,\s])([^>])*>/g;
			data = data.replace(regex, "");

			// Insert the filtered content
			document.execCommand("insertText", false, data);

			// Prevent the standard paste behavior
			e.preventDefault();
		};

		/**
		 * Handles the creation, update, or deletion of a textBlock when the user stops interacting
		 * with a textBlock and moves on.
		 */
		textBlock.onblur = () => {
			textBlock.classList.remove("eventNodateFocused");
			for (let i = 0; i < this.editorIcons.childNodes.length - 1; i++) {
				this.editorIcons.childNodes[i].classList.remove("focusedIcons");
				this.editorIcons.childNodes[i].classList.add("unfocusedIcons");
			}
			let date = null;
			if (this.kind === "event") {
				date = getDate(this, this.eventDelete);
				console.log(date);
			}
			if (!this.eventDelete) {
				this.eventDelete = true;
			}
			if (this.item !== null) {
				if (textBlock.textContent === "") {
					console.log("goodbye my very old friend " + textBlock.textContent);

					localStorage.deleteTextBlock(this.item, true, (res) => {
						console.log(res);
					});
				} else {
					console.log("hello my very old friend " + textBlock.textContent);
					this.item.kind = this.kind;
					this.item.text = textBlock.textContent;
					setTimeout(() => {
						localStorage.updateTextBlock(this.item, date, true, (res) => {
							console.log(res);
						})
					}, 150);
				}
			} else if (textBlock.textContent !== "") {
				localStorage.createTextBlock(this.controller.parent, this.controller.subParent, this.controller.currentBlockIndex, textBlock.textContent, this.tabLevel, this.kind, null, this.signifiers, date, true, (err, block) => {
					if (err) {
						console.log(err);
					} else {
						this.item = block;
						console.log(err);
					}
				})
			}
		};

		/**
		 * Handles the times when the user wants to create an event with an associated time and/or date.
		 */
		textBlock.addEventListener("input", () => {
			let content = textBlock.innerHTML;
			if (this.kind === "event") {
				if (content.includes("@")) {
					textBlock.innerHTML = content.replace(/(@)/g, "&#128368;  ");
					content = textBlock.innerHTML;
					this.moveToSpot(1000000, true);
				}

				if (content.includes("#")) {
					textBlock.innerHTML = content.replace(/(#)/g, "&#128197;  ");
					content = textBlock.innerHTML;
					this.moveToSpot(1000000, true);
				}
			}
			this.setCurrentSpot();
			this.timeSetter = false;
			this.dateSetter = false;
			includesClock(this, textBlock.textContent, true);
			if (this.kind === "event") {
				let dateFiller = "";
				if (!this.timeSetter) {
					dateFiller = `${dateFiller} use @ for time HH:MM`;
					if (!this.dateSetter) {
						dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
					}
				} else if (!this.dateSetter) {
					dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
				}
				textBlock.setAttribute("dateFiller", dateFiller);
			}
			if (content === "#&nbsp;") {
				this.setupHeader1();
			} else if (content === "##&nbsp;") {
				this.setupHeader2();
			} else if (content === "###&nbsp;") {
				this.setupHeader3();
			} else if (content === "-&nbsp;") {
				this.setupNote();
			} else if (content === "--&nbsp;") {
				this.setupEvent();
			} else if (content === "=-&nbsp;") {
				this.setupTask();
			} else if (content === "<div><br></div>") {
				this.removeStyles();
			} else if (content === "<br>") {
				textBlock.innerHTML = "";
			} else if (textBlock.textContent !== "") {
				this.controller.resetPosition = true;
			}
		});

		/**
		 * Handles providing the framework for editor populaing.
		 */
		textBlock.onfocus = () => {
			this.controller.resetPosition = false;
			this.setCurrentSpot();
			for (let i = 0; i < this.editorIcons.childNodes.length - 1; i++) {
				this.editorIcons.childNodes[i].classList.remove("unfocusedIcons");
				this.editorIcons.childNodes[i].classList.add("focusedIcons");
			}
			this.controller.currentBlockIndex = this.controller.blockArray.indexOf(this);
			this.controller.currentTabLevel = this.tabLevel;
			if (this.classList.contains("noteContainer") || this.classList.contains("eventContainer") || this.checkBox.style.display !== "none") {
				this.controller.creatingFromBullet = { isTrue: true, kind: this.kind };
				if (this.kind === "event") {
					textBlock.classList.add("eventNodateFocused");
				}
			} else {
				this.controller.creatingFromBullet = { isTrue: false, kind: "" };
			}
		};


		/**
		 * If "tab" is hit, then the tab level is increased and the textBlock styling is
		 * set up for each type of block type(?)
		 *
		 * @param {Event} e
		 */
		textBlock.onkeydown = (e) => {
			let key = e.key || e.keyCode;
			if (key === "Backspace" || key === "Delete") {
				let tabLevelNotZero = this.tabLevel > 0;
				let calculatedTab = this.tabLevel * tabSize;
				let currentSpot18 = this.currentPointerSpot - calculatedTab === paddingSize;
				let currentSpotNote = this.currentPointerSpot - calculatedTab === paddingSize + 20 && this.classList.contains("noteContainer");
				let isAtBegining = currentSpot18 || currentSpotNote;
				if (textBlock.innerHTML === "" && textBlock.getAttribute("placeholder") === "Type \"/\" to create a block" && this.controller.blockArray.length > 1) {
					this.controller.removeBlock();
				} else if ((textBlock.innerHTML === "" || textBlock.innerHTML === "<br>") && this.tabLevel === 0) {
					this.removeStyles();
				} else if (tabLevelNotZero && isAtBegining) {
					this.tabLevel -= 1;
					this.setupTabLevel();
				}
			} else if (key === "Enter") {
				let content = textBlock.innerHTML;
				if (content === "/h1") {
					this.setupHeader1();
					e.preventDefault();
				} else if (content === "/h2") {
					this.setupHeader2()
					e.preventDefault();
				} else if (content === "/h3") {
					this.setupHeader3()
					e.preventDefault();
				} else if (content === "/note") {
					this.setupNote();
					e.preventDefault();
				} else if (content === "/event") {
					this.setupEvent();
					e.preventDefault();
				} else if (content === "/task") {
					this.setupTask();
					e.preventDefault();
				} else if (content === "/futurelog") {
					alert("New Future Log will be created");
					e.preventDefault();
				} else if (content === "/monthlylog") {
					alert("New Monthly Log will be created");
					e.preventDefault();
				} else if (content === "/dailylog") {
					alert("New Daily Log will be created");
					e.preventDefault();
				} else if (content === "/collection") {
					alert("New Collection will be created");
					e.preventDefault();
				} else if (content === "/tracker") {
					localStorage.createTracker("Practice Tracker", [], currentState.id, (err, tracker) => {
						if (err) {
							console.log(err);
						} else {
							console.log(tracker);
						}
					});
					e.preventDefault();
				} else {
					this.controller.resetPosition = false;
					this.controller.addNewBlock(null);
					e.preventDefault();
				}
			} else if (key === "ArrowDown") {
				let lineheight = textBlock.classList.contains("header1") ? 80 : textBlock.classList.contains("header2") ? 57 : this.kind === "note" || this.kind === "event" || this.kind === "task" ? 47 : 42;
				if (this.currentPointerHeight > textBlock.offsetHeight - lineheight) {
					this.controller.moveToNextBlock();
				}
			} else if (key === "ArrowUp") {
				let lineheight = textBlock.classList.contains("header1") ? 50 : textBlock.classList.contains("header2") ? 36 : 28;
				if (this.currentPointerHeight < lineheight + this.initialHeight) {
					this.controller.moveToPreviousBlock();
				}
			} else if (key === "Tab") {
				this.tabLevel += 1;
				this.setupTabLevel();
				e.preventDefault();
			} else if (key === "@" && this.kind === "event") {
				if (this.timeSetter) {
					e.stopPropagation();
					e.preventDefault();
				} else {
					this.eventDelete = false;
					this.atPressed = true;
					this.timeSetter = true;
					let dateFiller = "";
					if (!this.timeSetter) {
						dateFiller = `${dateFiller} use @ for time HH:MM`;
						if (!this.dateSetter) {
							dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
						}
					} else if (!this.dateSetter) {
						dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
					}
					textBlock.setAttribute("dateFiller", dateFiller);
				}
			} else if (key === "#" && this.kind === "event") {
				if (this.dateSetter) {
					e.stopPropagation();
					e.preventDefault();
				} else {
					this.eventDelete = false;
					this.hashPressed = true;
					this.dateSetter = true;
					let dateFiller = "";
					if (!this.timeSetter) {
						dateFiller = `${dateFiller} use @ for time HH:MM`;
						if (!this.dateSetter) {
							dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
						}
					} else if (!this.dateSetter) {
						dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
					}
					textBlock.setAttribute("dateFiller", dateFiller);
				}
			} else if (this.atPressed && this.kind === "event" && key.match(/[^0123456789:]/g) && !protectedKeys.includes(key)) {
				e.stopPropagation();
				e.preventDefault()
			} else if (this.hashPressed && this.kind === "event" && key.match(/[.:"'=,`~|[{}]/g) && !protectedKeys.includes(key)) {
				e.stopPropagation();
				e.preventDefault();
			}
		};

		textBlock.onkeyup = (e) => {
			let key = e.key || e.keyCode;
			if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowDown" || key === "ArrowUp") {
				this.setCurrentSpot();
				if (key === "ArrowRight" || key === "ArrowLeft") {
					this.controller.resetPosition = true;
				}
			}
		};
	}
}


window.customElements.define("text-block", TextBlock);
