/**
 * SideCard Module
 * @module rightSidebarModule
 */
import {SideCard} from "./sideCard.jsx";
import { creationMenu } from "../index.js";
import { readUser } from "../localStorage/userOperations.js";
// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
    <link type="text/css" rel="stylesheet" href="rightSidebar.css" />
    <article id="container">
        <div id="sideCardWrapper"></div>
        <button id="createNewGoal">+ New Goal</button>
    </article>
</template>

export class RightSidebar extends HTMLElement {
    constructor (goals) {
        super();
        this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
        readUser((err, user) => {
            if (err) {
                console.log(err);
            } else {
                goals.forEach(goal => {
                    let tracker = user.trackers.filter(reference => reference.id === goal)[0];
                    this.addCard(tracker.title, tracker);
                });
            }
        })
    }

    addCard (title, tracker) {
        const card = new SideCard(title, tracker);
        card.id = "sideCard";
        this.shadowRoot.getElementById("sideCardWrapper").appendChild(card);
    }

    connectedCallback () {
        this.shadowRoot.getElementById("createNewGoal").onclick = () => {
            creationMenu.setKind("tracker");
            creationMenu.show();
        }
    }
}
window.customElements.define("right-sidebar", RightSidebar);
