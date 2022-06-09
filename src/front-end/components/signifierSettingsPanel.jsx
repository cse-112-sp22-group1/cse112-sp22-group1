import * as localStorage from "../localStorage/userOperations.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let signifierItemTemplate = <template>
	<link type="text/css" rel="stylesheet" href="./signifierItem.css" />
	<p id="symbol" contenteditable="true"></p>
	<p id="arrow">→</p>
	<p id="meaning" contenteditable="true"></p>
	<button id="deleteButton">Delete</button>
</template>

class SignifierItem extends HTMLElement {
	constructor (signifier) {
		super();
		console.log("Signifiers:");
		console.log(signifier);
		this.attachShadow({mode: "open"});
		this.shadowRoot.appendChild(signifierItemTemplate.content.cloneNode(true));

		this.meaning = this.shadowRoot.getElementById("meaning");
		this.symbol = this.shadowRoot.getElementById("symbol");
		this.deleteButton = this.shadowRoot.getElementById("deleteButton");
		
		this.meaning.innerText = signifier.meaning;
		this.symbol.innerHTML = signifier.symbol;
		this.signifier = signifier;
	}

	connectedCallback () {
		this.deleteButton.onclick = () => {
			alert("delete pressed");
		};
	}
}

window.customElements.define("signifier-item", SignifierItem);

let template = <template>
	<link type="text/css" rel="stylesheet" href="signifierSettingsPanel.css" />
    <div id="signifierContainer"></div>
	<button id="addButton">New Signifier</button>
</template>

export class SignifierSettingsPanel extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.signifierContainer = this.shadowRoot.getElementById("signifierContainer");
		localStorage.readUser((err, user) => {
			if (err) {
				console.log(err);
			} else {
				user.signifiers.forEach(signifier => {
					this.signifierContainer.appendChild(new SignifierItem(signifier));
				});
			}
		});
    }

	connectedCallback () {
		
	}
}

customElements.define("signifier-settings-panel", SignifierSettingsPanel);
