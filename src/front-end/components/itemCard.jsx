import { router } from "../state/router.js";

/**
 * Card Module
 * @module itemCardModule
 */

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */


let template = <template>
	<link type="text/css" rel="stylesheet" href="itemCard.css" />
    <article class="card">
        <div id="titleWrapper">
            <h1 id="title"></h1>
        </div>
        <h3 id="date"></h3>
        <div id="buttonWrapper">
            <button id="openButton">Open</button>
            <button id="peakButton">Peak</button>
        </div>
    </article>
</template>

export class ItemCard extends HTMLElement {

    /**
     * ItemCard constructor
     *
     * @param {String} title - item card title
     * @param {Number} from - collection start date
     * @param {Number} to - collection end date
     * @param {String} ID - Collection id
     */
    constructor (title, from, to, ID) {
        super();
        console.log(template);
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
        // Set card title
        this.setTitle(title);
        // Set card dates
        // eslint-disable-next-line no-empty
        if (from === null) {} else {
            this.setDate(from, to);
        }
        // Set card id
        this.ID = ID;
        this.bindOpenButton();
        this.bindPeakButton();
    }

    /**
     * Sets title for item card
     *
     * @param {String} cardTitle
     */
    setTitle (cardTitle) {
        const title = this.shadowRoot.getElementById("title");
        title.innerText = cardTitle;
    }

    /**
     * Sets Date for item card
     *
     * @param {Number} from
     * @param {Number} to
     */
    setDate (from, to) {
        const date = this.shadowRoot.getElementById("date");
        let dateString = "";
        switch (from % 10) {
            case 1:
                dateString = from.toString() + "st → ";
            break;
            case 2:
                dateString = from.toString() + "nd → ";
            break;
            case 3:
                dateString = from.toString() + "rd → ";
                break;
            default:
                dateString = from.toString() + "th → ";
        }
        switch (to % 10) {
            case 1:
                dateString = dateString + to.toString() + "st";
            break;
            case 2:
                dateString = dateString + to.toString() + "nd";
            break;
            case 3:
                dateString = dateString + to.toString() + "rd";
                break;
            default:
                dateString = dateString + to.toString() + "th";
        }
        date.innerText = dateString;
    }

    bindOpenButton () {
        this.shadowRoot.getElementById("openButton").addEventListener("click", () => {
            if (this.shadowRoot.getElementById("date").innerText) {
                router.navigate(`/monthlyLog/${this.ID}`);
            } else {
                router.navigate(`/collection/${this.ID}`);
            }
        })
    }

    bindPeakButton () {
        this.shadowRoot.getElementById("peakButton").addEventListener("click", () => {
            let pressed = this.shadowRoot.getElementById("title").innerText + " peak button was pressed!";
            console.log(pressed);
        })
    }
}

window.customElements.define("item-card", ItemCard);
