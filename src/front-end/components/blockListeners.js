import * as localStorage from "../localStorage/userOperations.js";
import { getDate, includesClock } from "./blockModel.js";
import { protectedKeys, tabSize } from "./block.jsx";
import { adderDropdown } from "../index.js";
import { currentState } from "../state/stateManager.js";

/**
 *
 * @param {TextBlock} blockReference
 */
export let bindListeners = (blockReference) => {

	let textBlock = blockReference.shadowRoot.getElementById("textBlock");
	textBlock.focus();

	if (blockReference.plus) {
		blockReference.plus.onclick = () => {
			blockReference.controller.currentBlockIndex = blockReference.controller.blockArray.indexOf(blockReference);
			let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
			if (textBlock.innerText !== "" && textBlock.innerText !== "/") {
				blockReference.controller.addNewBlock(null);
			} else {
				adderDropdown.openTextDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, blockReference.plus.getBoundingClientRect().left, blockReference.dropdownContents.text);
			}
		}
	}

	blockReference.more.onclick = () => {
		blockReference.controller.currentBlockIndex = blockReference.controller.blockArray.indexOf(blockReference);
		let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
		let leftOffset = blockReference.more.getBoundingClientRect().left - 160;
		let topOffset = blockReference.more.getBoundingClientRect().bottom + 5;
		if (blockReference.plus) {
			leftOffset = blockReference.plus.getBoundingClientRect().left;
			topOffset = textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue;
		}
		adderDropdown.openUtilDropdown(topOffset, leftOffset, blockReference.dropdownContents.util);
	}

	/**
	 * @type {HTMLElement}
	 * @listens document#click
	 */
	blockReference.checkBox.onclick = (e) => {
		if (blockReference.checkBox.getAttribute("checked") === "checked") {
			blockReference.checkBox.setAttribute("checked", "");
			textBlock.classList.remove("crossed");
			setTimeout(() => {
				localStorage.readUser((err, user) => {
					if (err === null) {
						let task = user.tasks.filter((currentTask) => currentTask.id === blockReference.item.objectReference)[0];
						task.complete = 0;
						localStorage.updateTask(task, true, (error, taskBlock) => {
							console.log(error);
							console.log(taskBlock);
						})
					}
				});
			}, 10);
		} else {
			blockReference.checkBox.setAttribute("checked", "checked");
			textBlock.classList.add("crossed");
			setTimeout(() => {
				localStorage.readUser((err, user) => {
					if (err === null) {
						let task = user.tasks.filter((currentTask) => currentTask.id === blockReference.item.objectReference)[0];
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
		for (let i = 0; i < blockReference.editorIcons.childNodes.length - 1; i++) {
			blockReference.editorIcons.childNodes[i].classList.remove("focusedIcons");
			blockReference.editorIcons.childNodes[i].classList.add("unfocusedIcons");
		}
		let date = null;
		if (blockReference.kind === "event") {
			date = getDate(blockReference, blockReference.eventDelete);
			console.log(date);
		}
		if (!blockReference.eventDelete) {
			blockReference.eventDelete = true;
		}
		if (blockReference.item !== null) {
			if (textBlock.textContent === "") {
				localStorage.deleteTextBlock(blockReference.item, blockReference.controller.parent, true, (res) => {
					if (res) {
						console.log(res);
					}
				});
			} else {
				blockReference.item.kind = blockReference.kind;
				blockReference.item.text = textBlock.textContent;
				setTimeout(() => {
					localStorage.updateTextBlock(blockReference.item, date, true, null, null, (res) => {
						if (res) {
							console.log(res);
						}
					})
				}, 150);
			}
		} else if (textBlock.textContent !== "") {
			localStorage.createTextBlock(blockReference.controller.parent, blockReference.controller.currentBlockIndex, textBlock.textContent, blockReference.tabLevel, blockReference.kind, null, blockReference.signifiers, date, true, (err, block) => {
				if (err) {
					console.log(err);
				} else {
					blockReference.item = block;
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
		if (blockReference.kind === "event") {
			if (content.includes("@")) {
				textBlock.innerHTML = content.replace(/(@)/g, "&#128368;  ");
				content = textBlock.innerHTML;
				blockReference.moveToSpot(1000000, true);
			}

			if (content.includes("#")) {
				textBlock.innerHTML = content.replace(/(#)/g, "&#128197;  ");
				content = textBlock.innerHTML;
				blockReference.moveToSpot(1000000, true);
			}
		}
		blockReference.setCurrentSpot();
		blockReference.timeSetter = false;
		blockReference.dateSetter = false;
		includesClock(blockReference, textBlock.textContent, true);
		if (blockReference.kind === "event") {
			let dateFiller = "";
			if (!blockReference.timeSetter) {
				dateFiller = `${dateFiller} use @ for time HH:MM`;
				if (!blockReference.dateSetter) {
					dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
				}
			} else if (!blockReference.dateSetter) {
				dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
			}
			textBlock.setAttribute("dateFiller", dateFiller);
		}
		if (content === "#&nbsp;") {
			blockReference.setupHeader1();
		} else if (content === "##&nbsp;") {
			blockReference.setupHeader2();
		} else if (content === "###&nbsp;") {
			blockReference.setupHeader3();
		} else if (content === "-&nbsp;") {
			blockReference.setupNote();
		} else if (content === "*&nbsp;") {
			blockReference.setupEvent();
		} else if (content === "[]&nbsp;") {
			blockReference.setupTask();
		} else if (content === "<div><br></div>") {
			blockReference.removeStyles();
		} else if (textBlock.innerText === "/") {
			let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
			let leftBound = textBlock.getBoundingClientRect().left;
			if (blockReference.plus) {
				leftBound = blockReference.plus.getBoundingClientRect().left;
			}
			adderDropdown.openTextDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, leftBound, blockReference.dropdownContents.text);
		} else if (content === "<br>") {
			textBlock.innerHTML = "";
			adderDropdown.hide();
		} else if (textBlock.textContent) {
			blockReference.controller.resetPosition = true;
			adderDropdown.hide();
		} else {
			adderDropdown.hide();
		}
	});

	/**
	 * Handles providing the framework for editor populaing.
	 */
	textBlock.onfocus = () => {
		blockReference.controller.resetPosition = false;
		if (blockReference.item) {
			blockReference.item.kind = blockReference.kind;
			blockReference.item.text = textBlock.textContent;
			let date = null;
			if (blockReference.kind === "event") {
				date = getDate(blockReference, blockReference.eventDelete);
				console.log(date);
			}
			setTimeout(() => {
				localStorage.updateTextBlock(blockReference.item, date, true, null, null, (res) => {
					if (res) {
						console.log(res);
					}
				})
			}, 150);
		}

		blockReference.setCurrentSpot();
		for (let i = 0; i < blockReference.editorIcons.childNodes.length - 1; i++) {
			blockReference.editorIcons.childNodes[i].classList.remove("unfocusedIcons");
			blockReference.editorIcons.childNodes[i].classList.add("focusedIcons");
		}
		blockReference.controller.currentBlockIndex = blockReference.controller.blockArray.indexOf(blockReference);
		blockReference.controller.currentTabLevel = blockReference.tabLevel;
		if (blockReference.classList.contains("noteContainer") || blockReference.classList.contains("eventContainer") || blockReference.checkBox.style.display !== "none") {
			blockReference.controller.creatingFromBullet = { isTrue: true, kind: blockReference.kind };
			if (blockReference.kind === "event") {
				textBlock.classList.add("eventNodateFocused");
			}
		} else {
			blockReference.controller.creatingFromBullet = { isTrue: false, kind: "" };
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
			let tabLevelNotZero = blockReference.tabLevel > 0;
			let calculatedTab = blockReference.tabLevel * tabSize;
			let currentSpotBlock = blockReference.currentPointerSpot - calculatedTab === blockReference.paddingSize;
			let currentSpotNote = blockReference.currentPointerSpot - calculatedTab === blockReference.paddingSize + tabSize && blockReference.classList.contains("noteContainer");
			let isAtBegining = currentSpotBlock || currentSpotNote;
			if (!tabLevelNotZero && textBlock.innerText === "" && textBlock.getAttribute("placeholder") === "Type \"/\" to create a block" && blockReference.controller.blockArray.length > 1) {
				blockReference.controller.removeBlock();
			} else if ((textBlock.innerHTML === "" || textBlock.innerHTML === "<br>") && blockReference.tabLevel === 0) {
				blockReference.removeStyles();
			} else if (tabLevelNotZero && isAtBegining) {
				blockReference.tabLevel -= 1;
				blockReference.setupTabLevel();
			}
		} else if (key === "Enter") {
			let content = textBlock.innerHTML;
			if (content === "/h1") {
				blockReference.setupHeader1();
				e.preventDefault();
			} else if (content === "/h2") {
				blockReference.setupHeader2()
				e.preventDefault();
			} else if (content === "/h3") {
				blockReference.setupHeader3()
				e.preventDefault();
			} else if (content === "/note") {
				blockReference.setupNote();
				e.preventDefault();
			} else if (content === "/event") {
				blockReference.setupEvent();
				e.preventDefault();
			} else if (content === "/task") {
				blockReference.setupTask();
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
				blockReference.controller.resetPosition = false;
				blockReference.controller.addNewBlock(null);
				e.preventDefault();
			}
		} else if (key === "ArrowDown") {
			let lineheight = textBlock.classList.contains("header1") ? 80 : textBlock.classList.contains("header2") ? 57 : blockReference.kind === "note" || blockReference.kind === "event" || blockReference.kind === "task" ? 47 : 42;
			if (blockReference.currentPointerHeight > textBlock.offsetHeight - lineheight) {
				blockReference.controller.moveToNextBlock();
			}
		} else if (key === "ArrowUp") {
			let lineheight = textBlock.classList.contains("header1") ? 50 : textBlock.classList.contains("header2") ? 36 : 28;
			if (blockReference.currentPointerHeight < lineheight + blockReference.initialHeight) {
				blockReference.controller.moveToPreviousBlock();
			}
		} else if (key === "Tab") {
			blockReference.tabLevel += 1;
			blockReference.setupTabLevel();
			e.preventDefault();
		} else if (key === "@" && blockReference.kind === "event") {
			if (blockReference.timeSetter) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				blockReference.eventDelete = false;
				blockReference.atPressed = true;
				blockReference.timeSetter = true;
				let dateFiller = "";
				if (!blockReference.timeSetter) {
					dateFiller = `${dateFiller} use @ for time HH:MM`;
					if (!blockReference.dateSetter) {
						dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
					}
				} else if (!blockReference.dateSetter) {
					dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
				}
				textBlock.setAttribute("dateFiller", dateFiller);
			}
		} else if (key === "#" && blockReference.kind === "event") {
			if (blockReference.dateSetter) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				blockReference.eventDelete = false;
				blockReference.hashPressed = true;
				blockReference.dateSetter = true;
				let dateFiller = "";
				if (!blockReference.timeSetter) {
					dateFiller = `${dateFiller} use @ for time HH:MM`;
					if (!blockReference.dateSetter) {
						dateFiller = `${dateFiller} and # for weekdays or dates MM/DD/YY`;
					}
				} else if (!blockReference.dateSetter) {
					dateFiller = `${dateFiller} use # for weekdays or dates MM/DD/YY`;
				}
				textBlock.setAttribute("dateFiller", dateFiller);
			}
		} else if (blockReference.atPressed && blockReference.kind === "event" && key.match(/[^0123456789:]/g) && !protectedKeys.includes(key)) {
			e.stopPropagation();
			e.preventDefault()
		} else if (blockReference.hashPressed && blockReference.kind === "event" && key.match(/[.:"'=,`~|[{}]/g) && !protectedKeys.includes(key)) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	textBlock.onkeyup = (e) => {
		let key = e.key || e.keyCode;
		if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowDown" || key === "ArrowUp") {
			blockReference.setCurrentSpot();
			if (key === "ArrowRight" || key === "ArrowLeft") {
				blockReference.controller.resetPosition = true;
			}
		}
	};
}
