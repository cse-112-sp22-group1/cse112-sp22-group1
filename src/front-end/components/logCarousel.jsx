import * as localStorage from "../localStorage/userOperations.js";
import { ItemCard } from "../components/itemCard.jsx";
import { creationMenu } from "../index.js";
// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { createEditor } from "../components/blockController.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="logCarousel.css" />
	<section id="logCarousel">
		<h1 id="sectionTitle"></h1> 
		<button id="new-button">Add</button>
        <section id="carousel"></section>
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
	constructor (name, array, type) {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.logCarousel = this.shadowRoot.getElementById("logCarousel");
        this.carousel = this.shadowRoot.getElementById("carousel");
        this.sectionTitle = this.shadowRoot.getElementById("sectionTitle");
		this.newbutton = this.shadowRoot.getElementById("new-button")

        if (name) {
            this.sectionTitle.innerHTML = name;
        } else {
            this.sectionTitle.remove();
        }

		if (type === "monthlyLog") {
			this.newbutton.remove();
			localStorage.readUser((err, user) => {
				if (err) {
					console.log(err);
				} else {
					let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					for (let i = 0; i < array.length; i++) {
						let storedDate = new Date(array[i].date);
						let date = `${monthNames[storedDate.getMonth()]} ${storedDate.getFullYear()}`;
						let monthlyLog = user.monthlyLogs.filter(month => month.id === array[i].id)[0];
						let monthStart = new Date(monthlyLog.startDate);
						let monthEnd = new Date(monthlyLog.endDate);
						this.carousel.appendChild(new ItemCard(date, monthStart.getDate(), monthEnd.getDate(), array[i].id));
					}
				}
			});
		} else if (type === "collections") {
			localStorage.readUser((err, user) => {
				if (err) {
					console.log(err);
				} else {
					console.log(array);
					for (let i = 0; i < array.length; i++) {
						let collection = user.collections.filter(reference => reference.id === array[i])[0];
						this.carousel.appendChild(new ItemCard(collection.title, null, null, array[i]));
					}
				}
			});
		}
	}

	/**
	 * 
	 * @param {Object} item 
	 */
	addCard(item) {
		let start = item.startDate ? new Date(item.startDate).getDate() : null;
		let end = item.endDate ? new Date(item.endDate).getDate() : null;
		this.carousel.appendChild(new ItemCard(item.title, start, end, item.id));
	}

	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
		this.newbutton.onclick = () => {
			creationMenu.setKind("collection");
			creationMenu.show();
		};
	}

}

customElements.define("logcarousel-component", LogCarousel);
