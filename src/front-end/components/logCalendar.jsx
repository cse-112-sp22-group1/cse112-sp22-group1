// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { createEditor } from "../components/blockController.js";
import { Calendar } from "../components/calendar.jsx"
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="logCalendar.css" />
	<section id="logCalendar">
        <h1 id="sectionTitle"></h1> 
	</section>
</template>

/**
 * Class that Creates navbar
 */
export class LogCalendar extends HTMLElement {
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

        this.logCalendar = this.shadowRoot.getElementById("logCalendar");
        this.sectionTitle = this.shadowRoot.getElementById("sectionTitle");

        if (name) {
            this.sectionTitle.innerHTML = name;
        } else {
            this.sectionTitle.remove();
        }

        // TEST MATERIAL
        let start = 1;
        let end = 25;

        let eventsMock = [
        {
            id: "1",
            objectType: "JournalEvent",
            title: "test 1",
            parent: null,
            date: new Date(),
            signifier: null
        }
        ];

        let logMock = [];

        for (let i = start; i <= end; i++) {
            let currentDate = new Date();
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            let newLog = {
                id: i.toString(),
                objectType: "Log",
                date: currentDate,
                parent: null,
                content: [],
                trackers: []
            }
            if (i > 5) {
                newLog.content.push("test");
            }
            logMock.push(newLog);
        }

        // TEST MATERIAL


        this.logCalendar.appendChild(new Calendar(new Date(), start, end, eventsMock, logMock))

	}


	/**
	 * When a log instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
	}

}

customElements.define("logcalendar-component", LogCalendar);
