
import { currentObject, header } from "../index.js";
import {SettingsMenu} from "./settings.jsx";
import { router } from "../router.js";

//const template = document.createElement("template");

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="navbar.css" />
    <nav class="nav-bar">
		<div id="top">
			<button id="home">  <img src="../public/resources/home_icon.png"/> <h1>&nbsp;Index</h1></button>
		</div>
		<button id="todayLog"> <p>Today's Log</p> </button>
		<button id="thisMonth"> <p>This Month</p> </button>
		<button id="futureLog"> <p>Future Logs</p> </button>
		<button id="collections"> <p>Collections</p> </button>
		<button id="events"> <p>Events</p> </button>
		<button id="retrospective"> <p>Retrospective</p> </button>
		<button id="trackers"> <p>Trackers</p> </button>
		<div id="bottom">
			<button id="help">  <img src="../public/resources/question.png"/> <p2>&nbsp; Help </p2> </button>
			<button id="user">  <img src="../public/resources/user.png"/> <p2>&nbsp; My Account</p2> </button>
		</div>
	</nav>
	<nav class="navigation">
		<div id="menu" class="closed">
			<button id="homeMenu">  <img src="../public/resources/home_icon.png"/> <h1>&nbsp;Index</h1></button>
			<button id="todayLogMenu"> <p>Today's Log</p> </button>
			<button id="thisMonthMenu"> <p>This Month</p> </button>
			<button id="futureLogMenu"> <p>Future Logs</p> </button>
			<button id="collectionsMenu"> <p>Collections</p> </button>
			<button id="eventsMenu"> <p>Events</p> </button>
			<button id="retrospectiveMenu"> <p>Retrospective</p> </button>
			<button id="trackersMenu"> <p>Trackers</p> </button>
			<div id="bottomMenu">
				<button id="helpMenu">  <img src="../public/resources/question.png"/> <p2>&nbsp; Help </p2> </button>
				<button id="userMenu">  <img src="../public/resources/user.png"/> <p2>&nbsp; My Account</p2> </button>
			</div>

			<button id="singleMenu"><img src="../public/resources/left.png"/></button>
			<button id="doubleMenu"><img src="../public/resources/double_icon.png"/></button>
			<button id="userMenu">  <img src="../public/resources/user.png"/></button>
		</div>
	</nav>
</template>

/**
 * Class that Creates navbar
 */
export class NavBar extends HTMLElement {
	static get observedAttributes () {
		return ["open"];
	}

	/**
	 * Navbar constructor
	 */
	constructor () {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.home = this.shadowRoot.querySelectorAll("button")[0];
		this.todayLog = this.shadowRoot.querySelectorAll("button")[1];
		this.monthLog = this.shadowRoot.querySelectorAll("button")[2];
		this.futureLog = this.shadowRoot.querySelectorAll("button")[3];
		this.collections = this.shadowRoot.querySelectorAll("button")[4];
		this.events = this.shadowRoot.querySelectorAll("button")[5];
		this.retrospective = this.shadowRoot.querySelectorAll("button")[6];
		this.trackers = this.shadowRoot.querySelectorAll("button")[7];

		this.help = this.shadowRoot.querySelectorAll("button")[8];
		this.user = this.shadowRoot.querySelectorAll("button")[9];

		
		// this.target = this.shadowRoot.querySelectorAll("button")[1];
		// this.single = this.shadowRoot.querySelectorAll("button")[2];
		// this.double = this.shadowRoot.querySelectorAll("button")[3];
		// this.user = this.shadowRoot.querySelectorAll("button")[4];

		this.menu = this.shadowRoot.querySelector("#menu");
		this.homeMenu = this.shadowRoot.querySelector("#homeMenu");
		this.singleMenu = this.shadowRoot.querySelector("#singleMenu");
		this.doubleMenu = this.shadowRoot.querySelector("#doubleMenu");
		this.userMenu = this.shadowRoot.querySelector("#userMenu");
	}

	/**
	 * When a navbar instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		this.home.addEventListener("click", () => {
			this.goHome();
		});
		this.trackers.addEventListener("click", () => {
			this.toggleTracker();
		});
		this.user.addEventListener("click", () => {
			let settingsMenu = document.querySelector("settings-menu");
			settingsMenu.toggle();
		});



		this.homeMenu.addEventListener("click", () => {
			this.goHome();
			this.open = false;
		});
		this.singleMenu.addEventListener("click", () => {
			this.goBack();
			this.open = false;
		});
		this.doubleMenu.addEventListener("click", () => {
			this.goFarBack();
			this.open = false;
		});
		this.userMenu.addEventListener("click", () => {
			let settingsMenu = document.querySelector("settings-menu");
			if (typeof settingsMenu === SettingsMenu) {
				settingsMenu.toggle();
			}
		});
	}

	/**
	 * To switches header attribute value if the value parameters differ
	 *
	 * @param {String} attr attribute to change
	 * @param {Object} oldVal old value passed in
	 * @param {Obejct} newVal new value passed in
	 */
	attributeChangedCallback (attr, oldVal, newVal) {
		if (oldVal !== newVal) {
			this[attr] = newVal;
		}
	}

	/**
	 * Goes to home page when the home button is pressed
	 */
	goHome () {
		if (document.location.hash !== null && document.location.hash !== "#index" && document.location.hash !== "") {
			router.setState("", false);
		}
	}

	/**
	 * Goes to the previous page when the back button is pressed
	 */
	goBack () {
		let parent = document.location.hash.includes("#dailyLog") ? "monthlyLog" : "futureLog";
		router.setState(`#${parent}~${currentObject.parent}`, false);
	}

	/**
	 * Goes to the futureLog if you are on a dailyLog when double arrow button is clicked
	 */
	goFarBack () {
		let parent = document.location.hash.includes("#dailyLog") ? "futureLog" : "index";
		localStorage.readUser((err, user) => {
			if (err === null) {
				let userArr = [];
				Array.prototype.push.apply(userArr, user.dailyLogs);
				Array.prototype.push.apply(userArr, user.monthlyLogs);
				Array.prototype.push.apply(userArr, user.futureLogs);
				Array.prototype.push.apply(userArr, user.collections);
				let parsed = userArr.filter((object) => object.id === currentObject.parent);
				let firstParent = parsed[0];
				router.setState(`#${parent}~${firstParent.parent}`, false);
			} else {
				console.log(err);
			}
		});
	}

	/**
	 * Displays tracker menu when called
	 */
	toggleTracker () {
		const trackerMenu = document.querySelector("tracker-menu");
		trackerMenu.toggle();
	}

	/**
	 * Displays header when called
	 */
	toggle () {
		this.open = !this.open;
	}

	/**
	 * Returns attributes that are open(?)
	 */
	get open () {
		return this.hasAttribute("open");
	}

	/**
	 * Menu is toggeled if parameter is true
	 *
	 * @param {Boolean} isOpen boolean to check if menu should be toggled or not
	 */
	set open (isOpen) {
		this.menu.classList.toggle("open", isOpen);
		this.menu.classList.toggle("closed", !isOpen);
		this.menu.setAttribute("aria-hidden", !isOpen)
		if (isOpen) {
			this.setAttribute("open", "true");
			this.focus();
			header.menuToggle.checked = true;
		} else {
			this.removeAttribute("open");
			header.menuToggle.checked = false;
		}
	}
}

customElements.define("nav-bar", NavBar);
