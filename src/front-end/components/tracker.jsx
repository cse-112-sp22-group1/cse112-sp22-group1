import * as localStorage from "../localStorage/userOperations.js";
import { CreatorBlock } from "./creator.jsx";
import { TrackerBlock } from "./trackerBlock.jsx";
import { currentState } from "../state/stateManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="tracker.css" />
    <div class="wrapper closed">
            <div class="tracker_header">
                    <button class="close_button"> <img src="../public/resources/right-chevron.png"/> </button>
                    <h1 class="tracker_h1">Future Log Tracker</h1>
            </div>

            <div class="tracker_menu"><div id="editor"></div></div>
    </div>
</template>

/**
 * Class that creates a trackerMenu
 */
export class TrackerMenu extends HTMLElement {
    static get observedAttributes () {
        return ["open"];
    }

	/**
	 * TrackerMenu constructor
	 */
    constructor (title) {
        super();
		this.attachShadow({ mode: "open" });
        this.close = this.close.bind(this);
        this.clear = this.clear.bind(this);
		this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.title = title;
        this.closeButton = this.shadowRoot.querySelector(".close_button");
        this.editor = this.shadowRoot.getElementById("editor");
		this.isInsideTracker = false;
    }

	/**
	 * Changes attribute if the value parameters differ
	 *
	 * @param {String} attr attribute to change
	 * @param {Boolean} oldVal old value passed in
	 * @param {Boolean} newVal new value passed in
	 */
    attributeChangedCallback (attr, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[attr] = this.hasAttribute(attr);
        }
    }

	/**
	 * When a tracker instance is created it listens to when tracker is clicked
	 * and if it is toggled when clicked it will close, otherwise it will toggle
	 */
    connectedCallback () {
        // Console.log('can this event print');
        this.closeButton.addEventListener("click", () => {
			if (this.isInsideTracker) {
				this.isInsideTracker = false;
				this.clear();
				let trackerBlockWrapper = this.shadowRoot.getElementById("editor");
				localStorage.readUser((err, user) => {
					if (err) {
						console.log(err);
					} else {
						let userArr = user.trackers;
						let trackerArr = [];
						for (let i = 0; i < currentState.trackers.length; i++) {
							console.log("hello");
							trackerArr.push(userArr.filter((object) => object.id === currentState.trackers[i])[0]);
						}
						console.log(trackerArr);
						setTimeout(() => {
							for (let i = 0; i < trackerArr.length; i++) {
								let currentTracker = trackerArr[i];
								let dropdownTracker = new TrackerBlock(currentTracker.title, currentState.id, currentTracker, this);
								trackerBlockWrapper.appendChild(dropdownTracker);
							}
							trackerBlockWrapper.appendChild(new CreatorBlock());
						}, 10);
					}
				});
				if (currentState.objectType === "futureLog") {
					this.title = "Future Log Trackers";
				} else if (currentState.objectType === "monthlyLog") {
					this.title = "Monthly Log Trackers";
				} else {
					this.title = "Daily Log Trackers";
				}
			} else {
				this.close();
			}
		});
    }

	/**
	 * Toggles the tracker menu to the opposite state that it is in
	 */
    toggle () {
        this.open = !this.open;
    }

	/**
	 * Returns the attributes that are open(?)
	 */
    get open () {
        return this.hasAttribute("open");
    }

	/**
	 * Sets or removes attributes based on whether parameter is true or false
	 *
	 * @param {Boolean} isOpen parameter to decide setting or removing attributes
	 */
    set open (isOpen) {
        this.shadowRoot.querySelector(".wrapper").classList.toggle("open", isOpen);
        this.shadowRoot.querySelector(".wrapper").classList.toggle("closed", !isOpen);
        this.shadowRoot.querySelector(".wrapper").setAttribute("aria-hidden", !isOpen);
        if (isOpen) {
            this.setAttribute("open", "true");
            this.focus();
        } else {
            this.removeAttribute("open");
        }
    }

	/**
	 * Returns the tracker view title
	 */
	get title () {
		return this.shadowRoot.querySelector(".tracker_header h1").innerText;
	}

	/**
	 * Sets tracker title
	 */
    set title (text) {
        this.shadowRoot.querySelector(".tracker_header h1").innerText = text;
    }

	/**
	 * Closes tracker
	 */
    close () {
        this.open = false;
    }

	/**
	 * Clears tracker items
	 */
    clear () {
        while (this.editor.childNodes.length > 0) {
            this.editor.childNodes[0].remove();
        }
    }
}

window.customElements.define("tracker-menu", TrackerMenu);
