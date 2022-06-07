/**
 * Creator Module
 * @module creatorModule
 */

 import * as localStorage from "../localStorage/userOperations.js";
 import {adderDropdown, creationMenu} from "../index.js";
 import { currentState } from "../state/stateManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="creator.css" />
	<div id="editorIcons" class="paragraphIcons"><img src="../public/resources/plusIcon.png" class="unfocusedIcons" id="plus" /><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more" /></div>
	<div id="textBlock" contentEditable="true" ondrop={()=>false} class="unstylized" placeholder='Type "/" to create an item: future log, collection, etc'></div>
</template>

export class CreatorBlock extends HTMLElement {
	constructor () {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.plus = this.shadowRoot.getElementById("plus");
		this.more = this.shadowRoot.getElementById("more");
	}

	/**
	 * When a creator is created, it updates page to show textblock children and
	 * the user will be alerted what type of object is being created.
	 */
	 connectedCallback () {
		let textBlock = this.shadowRoot.getElementById("textBlock");
		this.plus.onclick = () => {
            let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
            adderDropdown.openTextDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left);
		}
		this.more.onclick = () => {
            let offsetValue = textBlock.getBoundingClientRect().top + textBlock.offsetHeight + 105 > window.innerHeight ? -100 : textBlock.offsetHeight + 5;
            adderDropdown.openUtilDropdown(textBlock.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left);
		}
		textBlock.onkeydown = (e) => {
			let key = e.key;
			if (key === "Enter") {
				e.preventDefault();
				let content = textBlock.innerHTML;
				if (content === "/futurelog" && currentState.objectType === "index") {
					creationMenu.setKind("futureLog");
					creationMenu.show();
					adderDropdown.hide();
				} else if (content === "/monthlylog" && currentState.objectType === "futureLog") {
					creationMenu.setKind("monthlyLog");
					creationMenu.show();
					adderDropdown.hide();
				} else if (content === "/dailylog" && currentState.objectType === "monthlyLog") {
					creationMenu.setKind("dailyLog");
					creationMenu.show();
					adderDropdown.hide();
				} else if (content === "/collection" && currentState.objectType === "index") {
					creationMenu.setKind("collection");
					creationMenu.show();
					adderDropdown.hide();
				} else if (content === "/tracker") {
					localStorage.createTracker("Practice Tracker", [], currentState.id, true, (err, tracker) => {
						if (err) {
							console.log(err);
						} else {
							console.log(tracker);
						}
					});
				}
			}
		}
	}
}
window.customElements.define("creator-block", CreatorBlock);
