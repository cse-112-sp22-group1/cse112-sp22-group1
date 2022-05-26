import * as dropdown from "../fillDropdown.js";
import { adderDropdown, creationMenu, navbar } from "../index.js";
import { currentState } from "../state/stateManager.js";
import { router } from "../state/router.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

const tabspace = 3;

let template = <template>
	<link type="text/css" rel="stylesheet" href="dropdown.css" />
	<div id="editorIcons" class="paragraphIcons"><img src="../public/resources/plusIcon.png" class="unfocusedIcons" id="plus"/><img src="../public/resources/sixDotIcon.png" class="unfocusedIcons" id="more"/></div>
	<div id="wrapper">
		<div id="titleWrapper">
			<h1 id="title"></h1>
			<button id="arrow"><img src="../public/resources/right-chevron.png" /></button>
		</div>
		<div id="contentWrapper"></div>
	</div>
</template>

/**
 * Class that creates a dropdown
 */
export class DropdownBlock extends HTMLElement {

	/**
	 * Dropdown Constructor
	 * @param {String} title - A title to give the dropdown.
	 * @param {Object} item - The object being contained within dropdown.
	 * @param {Number} level - The level of the dropdown in respect to others.
	 */
    constructor (title, item, level = 1) {
        super();
        this.currentHeight = 5;
        this.item = item;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.shadowRoot.getElementById("titleWrapper").class = (level > 1 ? "singleItemWrapper" : "");
        this.shadowRoot.host.setAttribute("style", `--level: ${level}; --tabspace: ${tabspace}`);

        this.button = this.shadowRoot.getElementById("arrow");
        this.wrapper = this.shadowRoot.getElementById("wrapper");
        this.contentWrapper = this.shadowRoot.getElementById("contentWrapper");
        this.header = this.shadowRoot.querySelector("h1");
        this.title = title;
		this.titleWrapper = this.shadowRoot.querySelector("#titleWrapper");
		this.plus = this.shadowRoot.getElementById("plus");
		this.more = this.shadowRoot.getElementById("more");
    }

	/**
	 * When creating a new dropdown instance, it displays the dropdown,
	 * listens to when the dropdown button is clicked to display items inside dropdown,
	 * and listens to when a dropdown header is clicked to navigate to the page for the dropdown object
	 */
    connectedCallback () {
		this.plus.onclick = () => {
            let offsetValue = this.plus.getBoundingClientRect().top + this.plus.offsetHeight + 105 > window.innerHeight ? -105 : this.plus.offsetHeight + 10;
            dropdown.openCreationDropdown(this.plus.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.plus.getBoundingClientRect().left);
		}

        this.more.onclick = () => {
			if (currentState.objectType === "index") {
				adderDropdown.fillDropdown([
{
					title: "Delete",
					listener: () => {
						creationMenu.setKind("futureLog");
						creationMenu.show();
						adderDropdown.hide();
					}
				}
]);
				let offsetValue = this.more.getBoundingClientRect().top + this.more.offsetHeight + 105 > window.innerHeight ? -105 : this.more.offsetHeight + 10;
				adderDropdown.setPosition(this.more.getBoundingClientRect().top + document.body.scrollTop + offsetValue, this.more.getBoundingClientRect().left);
			}
		}

		this.removeAttribute("closed");
        this.button.addEventListener("click", () => {
			this.toggleItems();
		});
		this.header.addEventListener("click", () => {
			console.log(this.item);
			this.navigateToObject();
		})
		// This.contentWrapper.style.display = 'none';
    }

	/**
	 * Gets the dropDown title.
	 * @return Returns the dropDown title.
	 */
	get title () {
		return this.header.innerText;
	}

	/**
	 * Sets the title for the dropdown
	 * @param {String} title the new title of the dropdown
	 */
    set title (title) {
        this.header.innerText = title;
    }

	/**
	 * Hides the items inside the dropdown
	 */
    get closed () {
        return this.wrapper.hasAttribute("closed");
    }

    set closed (isClosed) {
        if (isClosed) {
            this.hide();
        } else {
            this.display();
        }
    }

	/**
	 * When an object is clicked, it will toggle the page for that object
	 */
	navigateToObject () {
		router.navigate(`/${this.item.objectType}/${this.item.id}`);
		navbar.open = false;
	}

	/**
	 * Displays the dropdown when called
	 */
    display () {
        this.wrapper.classList.toggle("closed", true);
    }

	/**
	 * Closes the dropdown when called
	 */
    hide () {
        this.wrapper.classList.toggle("closed", false);
    }

	/**
	 * Displays the items inside the dropdown when called or hides them if already shown
	 */
    toggleItems () {
        this.wrapper.classList.toggle("closed");

        if (this.wrapper.classList.contains("closed")) {
            this.display();
        } else {
            this.hide();
        }
    }
}

window.customElements.define("drop-down", DropdownBlock);
