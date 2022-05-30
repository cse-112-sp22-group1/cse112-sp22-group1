// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { createEditor } from "../components/blockController.js";
import { ItemCard } from "../components/itemCard.jsx"
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="logCarousel.css" />
	<section id="logCarousel">
        <h1 id="sectionTitle"></h1> 
        <section id="carousel">

        </section>
	</section>
</template>

/**
 * Class that Creates navbar
 */
export class LogCarousel extends HTMLElement {
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

        this.logCarousel = this.shadowRoot.getElementById("logCarousel");
        this.carousel = this.shadowRoot.getElementById("carousel");
        this.sectionTitle = this.shadowRoot.getElementById("sectionTitle");

        if (name) {
            this.sectionTitle.innerHTML = name;
        } else {
            this.sectionTitle.remove();
        }

        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
        this.carousel.appendChild(new ItemCard("test1", null, null, null));
	}


	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
	}

}

customElements.define("logcarousel-component", LogCarousel);
