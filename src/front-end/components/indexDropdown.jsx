// Import { router } from "../state/router.js";

import { ItemCard } from "./itemCard.jsx";
import { LogCarousel } from "./logCarousel.jsx";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { router } from "../state/router.js";
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
        this.openLog = this.shadowRoot.getElementById("open");
        console.log(log)

		this.loadContent(this.log.objectType);
    }

    connectedCallback () {
		this.removeAttribute("open");
		this.header.addEventListener("click", () => {
			this.toggleItems();
		});
        this.button.addEventListener("click", () => {
			this.toggleItems();
		});
        this.openLog.onclick = () => {
            router.navigate(`/${this.log.objectType}/${this.log.id}`);
        }
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
        let Start = new Date(start);
        let End = new Date(end);
		let startDay = Start.getDate();
		let endDay = End.getDate();

        let dateString = "";
		dateString += months[Start.getMonth()] + " ";
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
                dateString = dateString + startDay.toString() + "th ";
        }
		dateString += Start.getFullYear().toString() + " → " + months[End.getMonth()] + " ";
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
		dateString += End.getFullYear().toString();
		return dateString;
    }

	/**
	 * Reads info from the log and fills the component.
	 */
	loadContent (type) {
		// Timeframe
		if (this.log.startDate && this.log.endDate) {
			this.timeframe.innerText = this.convertTimeframe(this.log.startDate, this.log.endDate);
		}
		// Future Log Title
		this.header.innerText = this.log.title;


        if (type === "futureLog") {
            // Monthly Logs and Headers
            if (this.log.months.length > 0) {
                let monthlyLogs = new LogCarousel("Monthly Logs", this.log.months, "monthlyLog")
                this.contentWrapper.appendChild(monthlyLogs);
            }

            if (this.log.collections.length > 0) {
                let collections = new LogCarousel("Collections", this.log.collections, "collections")
                this.contentWrapper.appendChild(collections);
            }
        }

        if (type === "collections") {
            // Monthly Logs and Headers
            if (this.log.collections.length > 0) {
                let collections = new LogCarousel("Collections", this.log.collections, "collections")
                this.contentWrapper.appendChild(collections);
            }
        }

	}
}

window.customElements.define("index-drop-down", IndexDropdown);
