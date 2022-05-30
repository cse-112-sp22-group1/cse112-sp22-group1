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

		let state = currentState;
		this.main.appendChild(new LogNotes("Notes", currentState));

		if (currentState.objectType == "futureLog") {
			this.main.appendChild(new LogCarousel("Monthly Logs", currentState))
		}

		this.main.appendChild(new LogCarousel("Collections", currentState));

		if (currentState.objectType == "monthlyLog") {
			this.main.appendChild(new LogCalendar("Daily Logs", currentState))
		}



		console.log(currentState)

	}


	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
	}

}

customElements.define("log-component", Log);
