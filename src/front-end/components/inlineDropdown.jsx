// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";

import {creationDropdownContents,editDropdownContents, otherDropdownContents} from "./dropdownContents.js";
/* eslint-enable */

import { currentState } from "../state/stateManager.js";


let template = <template>
    <link type="text/css" rel="stylesheet" href="inlineDropdown.css" />
    <div class="dropdown">
		<div id="myDropdown" class="dropdown-content">
			<ul id="dropdownList">
			</ul>
		</div>
        <div id="extraDropdown" class="extra-dropdown-content">
			<ul id="secondDropdownList">
			</ul>
		</div>
	</div>
</template>;

/**
 * Class that Creates Inline DropDown
 */
export class InlineDropdown extends HTMLElement {
	/* eslint-disable */
	/**
     * Inline DropDown constructor
     */
	/* eslint-disable */
    constructor () {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.dropdown = this.shadowRoot.getElementById("myDropdown");
        this.secondDropdown = this.shadowRoot.getElementById("extraDropdown");
        this.list = this.shadowRoot.getElementById("dropdownList");
        this.secondList = this.shadowRoot.getElementById("secondDropdownList");
        this.clicked = false;
        this.secondClicked = false;
    }
	/* eslint-disable */
    connectedCallback() {
        document.addEventListener("resize", (e) => {
            this.hide();
            this.hideSecondDropdown();
        });

        document.addEventListener("click", (e) => {
            if (!this.contains(e.target) && !this.clicked) {
                this.hide();
                this.hideSecondDropdown();
            }
            this.clicked = false;
            this.secondClicked = false;
        });
    }
	/* eslint-disable */

    /**
     * Displays dropdown if hidden or hides it if shown
     */
    toggleDropdown () {
        this.dropdown.classList.toggle("show");
        this.clicked = true;
    }

    /**
     * Hides dropdown
     */
    hide () {
        this.dropdown.classList.toggle("show", false);
        this.clicked = false;
    }

        /**
     * Shows dropdown
     */
    show () {
        this.dropdown.classList.toggle("show", true);
        this.clicked = true;
    }

    hideSecondDropdown(){
        this.secondDropdown.classList.toggle("show", false);
        this.secondClicked = false;
    }

    showSecondDropdown () {
        this.secondDropdown.classList.toggle("show", true);
        this.secondClicked = true;
    }
    /**
     * Fill the dropdown
     * @param {Array<Object>} elements 
     */
    fillDropdown(elements) {
        while (this.list.firstChild) {
            this.list.lastChild.remove();
        }
        if (!elements.length) {
            this.hide();
            return;
        }
        for (let i = 0; i < elements.length; i++) {
            let title = elements[i].title;
            let newButton = document.createElement("button");
            newButton.innerHTML = title;
            let icon = document.createElement("img");
            icon.src = elements[i].icon;
            let listWrapper = document.createElement("li");
            listWrapper.appendChild(icon);
            listWrapper.appendChild(newButton);
            if(title == "Turn into"){
                let arrow = document.createElement("img");
                arrow.classList.add("arrow");
                arrow.src = "../public/resources/right_icon.png";
                listWrapper.appendChild(arrow);
            }
            this.list.appendChild(listWrapper);
            listWrapper.onclick = elements[i].listener;
        }

        this.show();
        this.hideSecondDropdown();
    }

    /**
     * Sets the position of the dropdown
     * @param {Number} x - pixels from the left side of the screen
     * @param {Number} y - pixels from the top of the screen
     */
    setPosition (x, y) {
        this.dropdown.style.top = `${x}px`;
        this.dropdown.style.left = `${y}px`;
    }

    openCreationDropdown(x, y) {
        if (creationDropdownContents[currentState.objectType] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(creationDropdownContents[currentState.objectType]);
    }
    
    openUtilDropdown(x, y) {
        if (otherDropdownContents["util"] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(otherDropdownContents["util"]);
    }

    openTextDropdown(x,y) {
        if (otherDropdownContents["text"] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(otherDropdownContents["text"]);
    }

    openEditDropdown(x,y) {
        if (otherDropdownContents["text"] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(editDropdownContents[currentState.objectType]);
    }

    openSecondDropdown() {
        while (this.secondList.firstChild) {
            this.secondList.lastChild.remove();
        }
        this.secondDropdown.style.top = `${this.dropdown.offsetTop}px`;
        this.secondDropdown.style.left = `${this.dropdown.offsetWidth+ this.dropdown.offsetLeft-5}px`;
        let elements = otherDropdownContents["transform"]
        for (let i = 0; i < elements.length; i++) {
            let title = elements[i].title;
            let newButton = document.createElement("button");
            newButton.innerHTML = title;
            let icon = document.createElement("img");
            icon.src = elements[i].icon;
            let listWrapper = document.createElement("li");
            listWrapper.appendChild(icon);
            listWrapper.appendChild(newButton);
            this.secondList.appendChild(listWrapper);
            listWrapper.onclick = elements[i].listener;
        }

        this.showSecondDropdown();
    }
}

window.customElements.define("inline-dropdown", InlineDropdown);

