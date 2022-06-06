//import { router } from "../state/router.js";

import { ItemCard } from "./itemCard.jsx";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="./indexDropdown.css" />
	<div id="wrapper">
		<div id="timeframe"></div>	
		<div id="titleWrapper">
			<h1 id="title"></h1>
			<button id="arrow"><img src="../public/resources/index-dropdown-arrow.png" /></button>
            <button id="edit">Edit</button>
            <button id="open">Open</button>
		</div>
		<div id="contentWrapper">
		</div>
	</div>
</template>

/**
 * Class that creates a dropdown for the index menu
 */
export class IndexDropdown extends HTMLElement {

	/**
	 * Dropdown Constructor
	 * @param {FutureLog} log - The FutureLog object
	 */
    constructor (log) {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.wrapper = this.shadowRoot.getElementById("wrapper");
		this.timeframe = this.shadowRoot.getElementById("timeframe");
		this.titleWrapper = this.shadowRoot.querySelector("#titleWrapper");
        this.header = this.shadowRoot.querySelector("h1");
        this.button = this.shadowRoot.getElementById("arrow");
		this.contentWrapper = this.shadowRoot.getElementById("contentWrapper");
		this.monthlyLogs = this.shadowRoot.getElementById("monthlyLogs");
		this.collections = this.shadowRoot.getElementById("collections");
		this.log = log;

		this.loadContent();
    }

    connectedCallback () {
		this.removeAttribute("open");
		this.header.addEventListener("click", () => {
			this.toggleItems();
		});
        this.button.addEventListener("click", () => {
			this.toggleItems();
		});
		
    }

	/**
	 * Hides the items inside the dropdown
	 */
    get open () {
        return this.wrapper.hasAttribute("open");
    }

    set open (isOpen) {
        if (isOpen) {
            this.hide();
        } else {
            this.display();
        }
    }
	
	/**
	 * Displays the dropdown when called
	 */
    display () {
        this.wrapper.classList.toggle("open", true);
    }

	/**
	 * Closes the dropdown when called
	 */
    hide () {
        this.wrapper.classList.toggle("open", false);
    }

	/**
	 * Displays the items inside the dropdown when called or hides them if already shown
	 */
    toggleItems () {
        this.wrapper.classList.toggle("open");

        if (this.wrapper.classList.contains("open")) {
            this.display();
        } else {
            this.hide();
        }
    }

    /**
     * Gets timeframe string
     *
     * @param {Date} start day of the first date
     * @param {Date} end day of the ending date
     */
    convertTimeframe (start, end) {
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		let startDay = start.getDate();
		let endDay = end.getDate();

        let dateString = "";
		dateString+=months[start.getMonth()] + " ";
        switch (startDay % 10) {
            case 1:
                dateString = dateString + startDay.toString() + "st ";
            break;
            case 2:
                dateString = dateString + startDay.toString() + "nd ";
            break;
            case 3:
                dateString = dateString + startDay.toString() + "rd ";
                break;
            default:
                dateString = dateString+ startDay.toString() + "th ";
        }
		dateString+=start.getFullYear().toString() + " → " + months[end.getMonth()] + " ";
        switch (endDay % 10) {
            case 1:
                dateString = dateString + endDay.toString() + "st ";
            break;
            case 2:
                dateString = dateString + endDay.toString() + "nd ";
            break;
            case 3:
                dateString = dateString + endDay.toString() + "rd ";
                break;
            default:
                dateString = dateString + endDay.toString() + "th ";
        }
		dateString+=end.getFullYear().toString();
		return dateString;
    }

	/**
	 * Reads info from the log and fills the component.
	 */
	loadContent() {
		// Timeframe
		if (this.log.startDate && this.log.endDate) {
			this.timeframe.innerText = this.convertTimeframe(this.log.startDate, this.log.endDate);
		}
		// Future Log Title
		this.header.innerText = this.log.title;
		// TODO: Add Monthly Logs and Collections
		let filler = document.createElement('h2');
		filler.innerText = "This will be filled later.";
		this.contentWrapper.appendChild(filler);
	}
}

window.customElements.define("index-drop-down", IndexDropdown);
