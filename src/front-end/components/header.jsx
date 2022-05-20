import * as dropdown from "../fillDropdown.js";
import * as localStorage from "../localStorage/userOperations.js";
import { navbar } from "../index.js";
import { currentState } from "../state/stateManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="header.css" />
	<div id="container">
		<div id="menuToggle">
			<input type="checkbox" />
			<span></span>
			<span></span>
			<span></span>
		</div>
		<span class="header">
			<div>
				<button class="imgbutton" id="header_back"><img src="../public/resources/left-chevron.png" /></button>
				<h1 id="title_page">Template Page Title</h1>
				<button class="imgbutton" id="header_forward"><img src="../public/resources/right-chevron.png" /></button>
			</div>
			<button class="new-button">New</button>
		</span> 
		<span class="search_bar" id="searchBar">
			<input type="text" placeholder="Search" />
			<img src="../public/resources/search_icon.png" />
		</span>
	</div>
</template>

/**
 * Class that creates Page Header
 */
export class PageHeader extends HTMLElement {
	/**
	 * PageHeader constructor
	 */
	constructor () {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.h1 = this.shadowRoot.getElementById("title_page");

		this.createFutureLog = this.createFutureLog.bind(this);
		this.futureLogButton = this.shadowRoot.querySelector(".new-button");
		this.titleHeader = this.shadowRoot.querySelector(".header");
		this.imgbuttons = this.shadowRoot.querySelectorAll(".imgbutton");
		this.menuToggle = this.shadowRoot.querySelector("#menuToggle input");
		this.searchBar = this.shadowRoot.getElementById("searchBar");
	}

	/**
	 * When header is created, the callback will listen to when the menu is toggled
	 */
	connectedCallback () {
		this.futureLogButton.addEventListener("click", () => {
			const headerTopOffset = this.titleHeader.offsetTop + this.titleHeader.offsetHeight;
			const headerLeftOffset = this.titleHeader.offsetLeft + this.titleHeader.offsetWidth - 206;
			/* dropDown window appears to be 206 px, not sure why previous value was 210 */
			dropdown.openCreationDropdown(headerTopOffset, headerLeftOffset);
		});

		this.menuToggle.addEventListener("change", () => {
			navbar.toggle();
		});

		this.h1.onblur = () => {
			if (this.h1.contentEditable) {
				currentState.title = this.h1.innerText;
				localStorage.updateCollection(currentState, true, (err) => {
					if (err) {
						console.log(err);
					}
				});
			}
		};
	}

	/**
	 * Makes header content editable
	 */
	makeEditable () {
		this.h1.contentEditable = true;
	}

	/**
	 * Makes header content uneditable
	 */
	makeUneditable () {
		this.h1.contentEditable = false;
	}

	set title (title) {
		this.shadowRoot.getElementById("title_page").innerHTML = title;
	}

	/**
	 * Gets the header's current title
	 */
	get title () {
		return this.h1.innerText;
	}

	/**
	 * Creates a futureLog
	 */
	createFutureLog () {
		localStorage.createFutureLog(new Date(2021, 5, 22), new Date(2021, 8, 23), [], [], [], true, (err, futureLog) => {
			if (err) {
				console.log(err);
			} else {
				localStorage.readUser((error, res) => {
					if (error) {
						console.log(error);
					} else if (res.ok) {
						console.log(futureLog);
					}
				})
			}
		});
	}
}

window.customElements.define("page-header", PageHeader);
