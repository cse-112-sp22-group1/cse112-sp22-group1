/**
 * Text Block Module
 * @module textBlockModule
 */
import { BlockController } from "./blockController.js";
import { bindFunctions } from "./blockManager.js";
import { bindListeners } from "./blockListeners.js";
import { bindDropdown } from "./blockDropdownManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import "./shadow.js";
/* eslint-enable */

export let tabSize = 40;
export let protectedKeys = ["Control", "Alt", "CapsLock", "Escape", "PageUp", "PageDown", "End", "Home", "PrintScreen", "Insert", "Delete", "Backspace", "Tab", "Enter", "Meta", "ArrowTop", "ArrowBottom", "ArrowRight", "ArrowLeft", "Shift", " "]

let blockTemplate = <template>
	<link type="text/css" rel="stylesheet" href="./block.css" />
	<div id="editorIcons" class="paragraphIcons"><img src="../public/resources/plusIcon.png" class="unfocusedIcons" id="plus" /><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more" /></div>
	<div id="checkerContainer" checked=""><div id="taskChecker"></div></div>
	<div id="textBlock" contentEditable="true" ondrop={()=>false} placeholder='Type "/" to create a block'></div>
	<aside id="signifiers" class="paragraphSignifiers"><span>&#128540;</span><button>+</button></aside>
</template>;

let trackerIcons = <template>
	<div id="editorIcons" tracker="true"><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more" /></div>
</template>

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
	constructor (controller, itemObject, signifiers, callback, tracker=null) {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(blockTemplate.content.cloneNode(true));
		this.characterIndex = 0;
		this.kind = "paragraph";
		this.initialHeight = 3;
		this.item = itemObject;
		this.controller = controller;
		this.paddingSize = this.controller.container.getClientRects()[0].x + 38;
		this.shadowRoot.getElementById("textBlock").classList.add("unstylized");
		this.currentBlock = null;
		this.checkBox = this.shadowRoot.getElementById("checkerContainer");
		this.checkBox.style.display = "none";
		this.currentPointerSpot = 0;
		this.editorIcons = this.shadowRoot.getElementById("editorIcons");
		this.signifierRow = this.shadowRoot.getElementById("signifiers");
		this.currentPointerHeight = 2;
		this.tracker = tracker;
		if (this.tracker) {
			this.shadowRoot.getElementById("editorIcons").remove();
			this.signifierRow.insertAdjacentHTML("beforebegin", trackerIcons.innerHTML);
			this.signifierRow.classList.add("tracker");
			this.shadowRoot.getElementById("textBlock").classList.add("tracker");
		}
		bindFunctions(this);
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
		this.signifiers = signifiers;
		
		this.plus = this.shadowRoot.getElementById("plus");
		this.more = this.shadowRoot.getElementById("more");
		bindDropdown(this);
		this.setupTabLevel();
		setTimeout(() => {
			callback(true);
		}, 30);
	}

	

	/**
	 * When a textBlock is created, the editor is added to the page and if the block is a task
	 * then the text is crossed off
	 */
	connectedCallback () {
		bindListeners(this);
	}
}


window.customElements.define("text-block", TextBlock);

