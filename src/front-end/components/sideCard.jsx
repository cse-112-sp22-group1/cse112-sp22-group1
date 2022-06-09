/**
 * SideCard Module
 * @module sideCardModule
 */

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
import { createEditor } from "./blockController.js";
/* eslint-enable */
import {adderDropdown} from "../index.js";


let template = <template>
	<link type="text/css" rel="stylesheet" href="sideCard.css" />
    <article class="card">
        <div id="titleWrapper">
            <h1 id="title" contenteditable="true">Title</h1>
            <div id="buttonwrapper">
                <button id="editButton">Edit</button>
            </div>
        </div>
        <div id="trackerWrapper"></div>
    </article>
</template>
export class SideCard extends HTMLElement {
    constructor (title, trackers) {
        super();
        this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
        // eslint-disable-next-line no-empty
        if (title === null) {} else {
            this.setTitle(title);
        }
        // eslint-disable-next-line no-empty
        if (trackers === null) {} else {
            this.addTracker(trackers)
        }
        this.editButton = this.shadowRoot.getElementById("editButton");
        this.dropdownContents = [
            {
                title: "Delete",
                icon: "../public/resources/delete_icon.png",
                listener: () => {
                    this.remove();
                }
            }, {
                title: "More",
                icon: "../public/resources/more_icon.png",
                listener: () => {

                }
            }
        ];
        this.bindDeleteButton();
    }

    /**
     * Sets title for side card
     *
     * @param {String} cardTitle
     */
    setTitle (cardTitle) {
        const title = this.shadowRoot.getElementById("title");
        title.innerText = cardTitle;
    }

    addTracker (tracker) {
        this.tracker = tracker;
        createEditor(this.shadowRoot.getElementById("trackerWrapper"), this.tracker, (err) => {
            if (err) {
                console.log(err);
            }
        }, this.tracker);
    }

    bindDeleteButton () {
        this.editButton.addEventListener("click", () => {
            const headerTopOffset = this.editButton.getBoundingClientRect().bottom + 5 + document.body.scrollTop;
			const headerLeftOffset = this.editButton.getBoundingClientRect().left - this.editButton.getBoundingClientRect().width - 10;
			adderDropdown.openSideCardDropdown(headerTopOffset, headerLeftOffset, this.dropdownContents);
        })
    }
}
window.customElements.define("side-card", SideCard);
