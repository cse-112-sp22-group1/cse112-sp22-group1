// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { createEditor } from "../components/blockController.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="logNotes.css" />
	<section id="logNotes">
        <h1 id="sectionTitle"></h1> 
	</section>
</template>

/**
 * Class that Creates navbar
 */
export class LogNotes extends HTMLElement {
	static get observedAttributes () {
		return ["open"];
	}

	/**
	 * Navbar constructor
	 */
	constructor (name, currentState) {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.logNotes = this.shadowRoot.getElementById("logNotes");
        this.sectionTitle = this.shadowRoot.getElementById("sectionTitle");

        if (name) {
            this.sectionTitle.innerHTML = name;
        } else {
            this.sectionTitle.remove();
        }

        createEditor(this.logNotes, currentState, null, (success) => {
            console.log(success);
        });
	}


	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
	}

}

customElements.define("lognotes-component", LogNotes);
