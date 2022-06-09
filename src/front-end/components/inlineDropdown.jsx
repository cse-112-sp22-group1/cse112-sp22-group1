// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";

import {creationDropdownContents,editDropdownContents} from "./dropdownContents.js";
/* eslint-enable */

import { currentState } from "../state/stateManager.js";
import {readUser} from "../localStorage/userOperations.js"

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
    setPosition (y, x) {
        this.dropdown.style.top = `${y}px`;
        this.dropdown.style.left = `${x}px`;
    }

    openCreationDropdown(x, y) {
        if (creationDropdownContents[currentState.objectType] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(creationDropdownContents[currentState.objectType]);
    }
    
    openUtilDropdown(x, y, contents) {
        if (contents === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(contents);
    }

    openTextDropdown(x,y,contents) {
        if (contents === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(contents);
    }

    openEditDropdown(x,y) {
        if (editDropdownContents[currentState.objectType] === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(editDropdownContents[currentState.objectType]);
    }

    openSecondDropdown(contents) {
        while (this.secondList.firstChild) {
            this.secondList.lastChild.remove();
        }
        this.secondDropdown.style.top = `${this.dropdown.offsetTop}px`;
        if (this.dropdown.offsetWidth + this.dropdown.offsetLeft - 5 + this.secondDropdown.offsetWidth + 145 < window.innerWidth) {
            this.secondDropdown.style.left = `${this.dropdown.offsetWidth + this.dropdown.offsetLeft - 5}px`;
        } else {
            this.secondDropdown.style.left = `${this.dropdown.offsetLeft - this.dropdown.offsetWidth}px`;
        }
        let elements = contents;
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

    openSignifierDropdown(x,y) {
        while (this.list.firstChild) {
            this.list.lastChild.remove();
        }
        readUser((err,user)=>{
            if(err) console.log(err);
            this.setPosition(x,y);
            let signifiers = user.signifiers;
            for (let i = 0; i < signifiers.length; i++) {
                let title = signifiers[i].meaning;
                let newButton = document.createElement("button");
                newButton.innerHTML = title;
                let icon = document.createElement("aside");
                console.log(signifiers[i].symbol.substring(3))
                icon.innerHTML = signifiers[i].symbol;
                let listWrapper = document.createElement("li");
                listWrapper.appendChild(icon);
                listWrapper.appendChild(newButton);
                this.list.appendChild(listWrapper);
                //listWrapper.onclick = elements[i].listener;
            }
            this.show();
            this.hideSecondDropdown();
        })        
    }

    openSideCardDropdown(x,y,contents){
        if (contents === undefined) {
            return;
        }
    
        this.setPosition(x, y);
    
        this.fillDropdown(contents);
    }
}

window.customElements.define("inline-dropdown", InlineDropdown);

