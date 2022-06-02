/**
 * SideCard Module
 * @module rightSidebarModule
 */

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */
import {SideCard} from "./sideCard.jsx";

let template = <template>
    <link type="text/css" rel="stylesheet" href="rightSidebar.css" />
    <article id="container">
        <span class="search_bar" id="searchBar">
            <input type="text" placeholder="Search" />
            <img src="../public/resources/search_icon.png" />
        </span>
        <div id="sideCardWrapper">

        </div>
    </article>
</template>

export class RightSidebar extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    addCard (title, tracker) {
        const card = new SideCard(title, tracker);
        card.id = "sideCard";
        this.shadowRoot.getElementById("sideCardWrapper").appendChild(card);
    }
}
window.customElements.define("right-sidebar", RightSidebar);
