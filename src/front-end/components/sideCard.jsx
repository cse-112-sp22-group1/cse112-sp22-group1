/**
 * SideCard Module
 * @module sideCardModule
 */

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
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
        <div id="trackerWrapper">
            <div id="titleBlock">
                <div id="trackerTitle"></div>
                <div id="editorIcons" class="paragraphIcons">
                    <img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more" />
                </div>
            </div>
        </div>
    </article>
</template>

let sixDots = <div id="editorIcon">
    <img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="hide" />
</div>
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
        const trackerTitle = this.shadowRoot.getElementById("trackerTitle");
        trackerTitle.innerText = tracker.title;
        for (let i = 0; i < tracker.content.length; i++) {
            let trackerblock = document.createElement("div");
            let trackertext = document.createElement("div");
            trackertext.classList.add("tracker-text");
            trackertext.id = "trackerText" + i;
            trackerblock.classList.add("tracker-block");
            trackertext.innerText = tracker.content[i];
            trackerblock.appendChild(trackertext);
            trackerblock.appendChild(sixDots.cloneNode(true));
            this.shadowRoot.getElementById("trackerWrapper").appendChild(trackerblock);
        }
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
