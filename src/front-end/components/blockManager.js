import { includesClock } from "./blockModel.js";
import { tabSize } from "./block.jsx";

/**
 *
 * @param {TextBlock} blockReference reference to current block
 */
export let bindFunctions = (blockReference) => {

	/**
	 * Keeps track of current location of textBlock
	 */
	blockReference.setCurrentSpot = () => {
		let container = blockReference.shadowRoot.getElementById("textBlock");
		let selection = blockReference.shadowRoot.getSelection();
		setTimeout(() => {
			let range = selection ? selection.getRangeAt(0) : null;
			if (range === null) {
				let computedTab = blockReference.tabLevel * tabSize;
				blockReference.currentPointerSpot = computedTab + blockReference.paddingSize;
				blockReference.currentPointerHeight = blockReference.initialHeight;
			} else {
				let computedTab = blockReference.tabLevel * tabSize;
				let preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(container);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				blockReference.atPressed = false;
				blockReference.hashPressed = false;
				includesClock(blockReference, container.innerText.slice(0, range.endOffset), false);
				blockReference.characterIndex = range.endOffset;
				blockReference.currentPointerSpot = range.getClientRects()[0] === undefined ? computedTab + blockReference.paddingSize : range.getClientRects()[0].x;
				blockReference.currentPointerHeight = range.getClientRects()[0] === undefined ? blockReference.initialHeight : range.getClientRects()[0].y - container.getBoundingClientRect().top;
				console.log(blockReference.currentPointerSpot);
			}
		}, 1);
	}

	/**
	 * Moves the textBlock to the location it was last dragged to(?)
	 *
	 * @param {Number} newSpotToMove - the possible new spot to move to
	 * @param {Boolean} up - whether the cursor should move up or down
	 */
	blockReference.moveToSpot = (newSpotToMove, up) => {
		let newSpot = newSpotToMove;
		let container = blockReference.shadowRoot.getElementById("textBlock");
		if (container.childNodes.length > 0) {
			if (!blockReference.controller.resetPosition) {
				newSpot = blockReference.currentPointerSpot;
			}
			container.focus();
			let selection = blockReference.shadowRoot.getSelection();
			let range = selection ? selection.getRangeAt(0) : null;
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
			}, 1);
		} else {
			container.focus();
		}

	}

	/**
	 * Sets up textBlock styling for header 1 text
	 */
	blockReference.setupHeader1 = () => {
		if (!blockReference.tracker) {
			if (blockReference.tracker) {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x;
			} else {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 38;
			}
			let textBlock = blockReference.shadowRoot.getElementById("textBlock");
			while (blockReference.editorIcons.classList.length > 0) {
				blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
			}
			while (blockReference.signifierRow.classList.length > 0) {
				blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
			}
			while (textBlock.classList.length > 0) {
				textBlock.classList.remove(textBlock.classList[0]);
			}
			while (blockReference.classList.length > 0) {
				blockReference.classList.remove(blockReference.classList[0]);
			}
			if (blockReference.tracker) {
				blockReference.signifierRow.classList.add("tracker");
				textBlock.classList.add("tracker");
			}
			blockReference.controller.creatingFromBullet = { isTrue: false, kind: "" };
			blockReference.kind = "h1";
			blockReference.initialHeight = 0;
			textBlock.setAttribute("placeholder", "Header 1");
			textBlock.classList.add("header1");
			blockReference.editorIcons.classList.add("header1Icons");
			blockReference.signifierRow.classList.add("h1Signifiers");
			textBlock.innerHTML = "";
			blockReference.checkBox.style.display = "none";
		}
	}

	/**
	 * Sets up textBlock styling for header 2 text
	 */
	blockReference.setupHeader2 = () => {
		if (!blockReference.tracker) {
			if (blockReference.tracker) {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x;
			} else {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 38;
			}
			let textBlock = blockReference.shadowRoot.getElementById("textBlock");
			while (blockReference.editorIcons.classList.length > 0) {
				blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
			}
			while (blockReference.signifierRow.classList.length > 0) {
				blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
			}
			while (textBlock.classList.length > 0) {
				textBlock.classList.remove(textBlock.classList[0]);
			}
			while (blockReference.classList.length > 0) {
				blockReference.classList.remove(blockReference.classList[0]);
			}
			if (blockReference.tracker) {
				blockReference.signifierRow.classList.add("tracker");
				textBlock.classList.add("tracker");
			}
			blockReference.controller.creatingFromBullet = { isTrue: false, kind: "" };
			blockReference.kind = "h2";
			blockReference.initialHeight = 0;
			textBlock.setAttribute("placeholder", "Header 2");
			textBlock.classList.add("header2");
			blockReference.editorIcons.classList.add("header2Icons");
			blockReference.signifierRow.classList.add("h2Signifiers");
			textBlock.innerHTML = "";
			blockReference.checkBox.style.display = "none";
		}
	}

	/**
	 * Sets up textBlock syling for header 3 text
	 */
	blockReference.setupHeader3 = () => {
		if (!blockReference.tracker) {
			if (blockReference.tracker) {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x;
			} else {
				blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 38;
			}
			let textBlock = blockReference.shadowRoot.getElementById("textBlock");
			while (blockReference.editorIcons.classList.length > 0) {
				blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
			}
			while (blockReference.signifierRow.classList.length > 0) {
				blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
			}
			while (textBlock.classList.length > 0) {
				textBlock.classList.remove(textBlock.classList[0]);
			}
			while (blockReference.classList.length > 0) {
				blockReference.classList.remove(blockReference.classList[0]);
			}
			if (blockReference.tracker) {
				blockReference.signifierRow.classList.add("tracker");
				textBlock.classList.add("tracker");
			}
			blockReference.controller.creatingFromBullet = { isTrue: false, kind: "" };
			blockReference.kind = "h3";
			blockReference.initialHeight = 0;
			textBlock.setAttribute("placeholder", "Header 3");
			textBlock.classList.add("header3");
			blockReference.editorIcons.classList.add("header3Icons");
			blockReference.signifierRow.classList.add("h3Signifiers");
			textBlock.innerHTML = "";
			blockReference.checkBox.style.display = "none";
		}
	}

	/**
	 * Sets up textBlock styling for note text and adds bullet
	 */
	blockReference.setupNote = () => {
		if (blockReference.tracker) {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 19;
		} else {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 53;
		}
		let textBlock = blockReference.shadowRoot.getElementById("textBlock");
		while (blockReference.editorIcons.classList.length > 0) {
			blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
		}
		while (blockReference.signifierRow.classList.length > 0) {
			blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (blockReference.classList.length > 0) {
			blockReference.classList.remove(blockReference.classList[0]);
		}
		if (blockReference.tracker) {
			blockReference.signifierRow.classList.add("tracker");
			textBlock.classList.add("tracker");
		}
		blockReference.kind = "note";
		blockReference.controller.creatingFromBullet = { isTrue: true, kind: blockReference.kind };
		blockReference.initialHeight = 3;
		textBlock.setAttribute("placeholder", "Note");
		blockReference.classList.add("noteContainer");
		blockReference.editorIcons.classList.add("noteIcons");
		blockReference.signifierRow.classList.add("noteSignifiers");
		textBlock.classList.add("note");
		textBlock.innerHTML = "";
		blockReference.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for event text and handles event date and time parsing
	 */
	blockReference.setupEvent = () => {
		if (blockReference.tracker) {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 19;
		} else {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 53;
		}
		let textBlock = blockReference.shadowRoot.getElementById("textBlock");
		while (blockReference.editorIcons.classList.length > 0) {
			blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
		}
		while (blockReference.signifierRow.classList.length > 0) {
			blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (blockReference.classList.length > 0) {
			blockReference.classList.remove(blockReference.classList[0]);
		}
		if (blockReference.tracker) {
			blockReference.signifierRow.classList.add("tracker");
			textBlock.classList.add("tracker");
		}
		blockReference.kind = "event";
		blockReference.controller.creatingFromBullet = { isTrue: true, kind: blockReference.kind };
		blockReference.initialHeight = 3;
		textBlock.setAttribute("placeholder", "Event:");
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
		blockReference.classList.add("eventContainer");
		blockReference.editorIcons.classList.add("noteIcons");
		blockReference.signifierRow.classList.add("noteSignifiers");
		textBlock.classList.add("note");
		textBlock.classList.add("eventNodateFocused");
		textBlock.innerHTML = "";
		blockReference.checkBox.style.display = "none";
	}

	/**
	 * Sets up textBlock styling for task text and adds task check off block
	 */
	blockReference.setupTask = () => {
		if (blockReference.tracker) {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 23;
		} else {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 61;
		}
		let textBlock = blockReference.shadowRoot.getElementById("textBlock");
		while (blockReference.editorIcons.classList.length > 0) {
			blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
		}
		while (blockReference.signifierRow.classList.length > 0) {
			blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
		}
		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (blockReference.classList.length > 0) {
			blockReference.classList.remove(blockReference.classList[0]);
		}
		if (blockReference.tracker) {
			blockReference.signifierRow.classList.add("tracker");
			textBlock.classList.add("tracker");
		}
		blockReference.kind = "task";
		blockReference.classList.add("taskContainer");
		blockReference.controller.creatingFromBullet = { isTrue: true, kind: blockReference.kind };
		blockReference.initialHeight = 3;
		textBlock.classList.add("task");
		textBlock.setAttribute("placeholder", "Task");
		blockReference.signifierRow.classList.add("taskSignifiers");
		textBlock.innerHTML = "";
		blockReference.editorIcons.classList.add("paragraphIcons");
		blockReference.checkBox.style.display = "inline";
	}

	/**
	 * Removes any styling from a textBlock in case one type of textblock
	 * is converted to a different one
	 */
	blockReference.removeStyles = () => {
		if (blockReference.tracker) {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x;
		} else {
			blockReference.paddingSize = blockReference.controller.container.getClientRects()[0].x + 38;
		}
		let textBlock = blockReference.shadowRoot.getElementById("textBlock");
		while (blockReference.editorIcons.classList.length > 0) {
			blockReference.editorIcons.classList.remove(blockReference.editorIcons.classList[0]);
		}
		while (blockReference.signifierRow.classList.length > 0) {
			blockReference.signifierRow.classList.remove(blockReference.signifierRow.classList[0]);
		}

		while (textBlock.classList.length > 0) {
			textBlock.classList.remove(textBlock.classList[0]);
		}
		while (blockReference.classList.length > 0) {
			blockReference.classList.remove(blockReference.classList[0]);
		}
		if (blockReference.tracker) {
			blockReference.signifierRow.classList.add("tracker");
			textBlock.classList.add("tracker");
		}
		blockReference.kind = "paragraph";
		blockReference.initialHeight = 3;
		textBlock.classList.add("unstylized");
		textBlock.setAttribute("placeholder", "Type \"/\" to create a block");
		textBlock.innerHTML = "";
		blockReference.signifierRow.classList.add("paragraphSignifiers");
		blockReference.editorIcons.classList.add("paragraphIcons");
		blockReference.controller.creatingFromBullet = { isTrue: false, kind: "" };
		blockReference.checkBox.style.display = "none";
	}

	/**
	 * Sets the textBlocks indenting using the tab level as a multiple
	 */
	blockReference.setupTabLevel = () => {
		blockReference.style.position = "relative";
		let computedTab = blockReference.tabLevel * tabSize;
		blockReference.style.left = computedTab + "px";
		blockReference.controller.currentTabLevel = blockReference.tabLevel;
		blockReference.style.setProperty("--block-tab-level", `${computedTab}px`);
		blockReference.setCurrentSpot();
	}

	blockReference.setupSignifier = (signifier) => {
		blockReference.signifier = signifier;
		blockReference.signifierIcon.innerHTML = signifier.symbol;
	}
}
