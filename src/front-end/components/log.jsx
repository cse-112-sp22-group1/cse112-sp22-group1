import { currentObject, header } from "../index.js";
import { SettingsMenu } from "./settings.jsx";
import { router } from "../state/router.js";
import { LogNotes } from "./logNotes.jsx";
import { LogCarousel } from "./logCarousel.jsx";
import { LogCalendar } from "./logCalendar.jsx";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { currentState, getCurrentObject } from "../state/stateManager.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="log.css" />
	<main id="log"></main>
</template>

/**
 * Class that Creates navbar
 */
export class Log extends HTMLElement {
	static get observedAttributes () {
		return ["open"];
	}

	/**
	 * Navbar constructor
	 */
	constructor (currentState) {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// this.notes = this.shadowRoot.querySelector("#notes");
		this.main = this.shadowRoot.getElementById("log");
		this.hasCollections = false;
		this.notesSection = new LogNotes("Notes", currentState);
		this.main.appendChild(this.notesSection);

		if (currentState.objectType == "futureLog") {
			this.monthlyLogsSection = new LogCarousel("Monthly Logs", currentState.months, "monthlyLog");
			this.main.appendChild(this.monthlyLogsSection);
		}
		if (currentState.collections.length > 0) {
			this.hasCollections = true;
			this.collectionSection = new LogCarousel("Collections", currentState.collections, "collections");
			this.main.appendChild(this.collectionSection);
		}

		if (currentState.objectType == "monthlyLog") {
			this.dailyLogsSection = new LogCalendar("Daily Logs", currentState);
			this.main.appendChild(this.dailyLogsSection);
		}



		// console.log(currentState);

	}

	/**
	 * Adds a collection to the log
	 * 
	 * @param {Object} collection the collection to add 
	 */
	addCollection (collection) {
		if (!this.hasCollections) {
			this.collectionSection = new LogCarousel("Collections", [], "collections");
			this.main.appendChild(this.collectionSection);
		}
		this.collectionSection.addCard(collection);
		getCurrentObject(currentState.id);
	}

	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
	}

}

customElements.define("log-component", Log);
