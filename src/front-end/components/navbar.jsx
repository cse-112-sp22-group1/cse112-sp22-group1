
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
    <nav class="nav-bar" id="mainNav">
		<div id="top">
			<button id="home">  <img src="../public/resources/home_icon.png"/> <h1>&nbsp;Index</h1></button>
			<button id="collapse"><img id="collapseImage" src="../public/resources/left-chevron.png"/> </button>
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
	<nav class="collapsed-nav" id="closedNav">
		<button id="uncollapse"><img id="collapseImage" src="../public/resources/closedNav.png"/> </button>
	</nav>
	<nav class="navigation">
		<div id="menu" class="closed">
			<div id="top">
				<button id="homeMenu">  <img src="../public/resources/home_icon.png"/> <h1>&nbsp;Index</h1></button>
			</div>
			<button id="todayLogMenu"> <p>Today's Log</p> </button>
			<button id="thisMonthMenu"> <p>This Month</p> </button>
			<button id="futureLogMenu"> <p>Future Logs</p> </button>
			<button id="collectionsMenu"> <p>Collections</p> </button>
			<button id="eventsMenu"> <p>Events</p> </button>
			<button id="retrospectiveMenu"> <p>Retrospective</p> </button>
			<button id="trackersMenu"> <p>Trackers</p> </button>
			<div id="bottom">
				<button id="helpMenu">  <img src="../public/resources/question.png"/> <p2>&nbsp; Help </p2> </button>
				<button id="userMenu">  <img src="../public/resources/user.png"/> <p2>&nbsp; My Account</p2> </button>
			</div>

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

		// Main nav bar 
		this.mainNav = this.shadowRoot.querySelector("#mainNav");
		this.navShown = true;

		// Instantiates closed version of navbar
		this.closedNav = this.shadowRoot.querySelector("#closedNav");
		this.closedNav.classList.toggle("closed", true);


		this.home = this.shadowRoot.querySelectorAll("button")[0];
		this.collapse = this.shadowRoot.querySelectorAll("button")[1];
		this.todayLog = this.shadowRoot.querySelectorAll("button")[2];
		this.monthLog = this.shadowRoot.querySelectorAll("button")[3];
		this.futureLog = this.shadowRoot.querySelectorAll("button")[4];
		this.collections = this.shadowRoot.querySelectorAll("button")[5];
		this.events = this.shadowRoot.querySelectorAll("button")[6];
		this.retrospective = this.shadowRoot.querySelectorAll("button")[7];
		this.trackers = this.shadowRoot.querySelectorAll("button")[8];

		this.help = this.shadowRoot.querySelectorAll("button")[9];
		this.user = this.shadowRoot.querySelectorAll("button")[10];
		this.uncollapse = this.shadowRoot.querySelectorAll("button")[11];

		// Would be used for a vertical screen size
		this.menu = this.shadowRoot.querySelector("#menu");
		this.homeMenu = this.shadowRoot.querySelector("#homeMenu");
		this.userMenu = this.shadowRoot.querySelector("#userMenu");
	}

	/**
	 * When a navbar instance is created sets event listeners for all header buttons in the callback
	 */
	connectedCallback () {
		// normal open menu button
		this.home.addEventListener("click", () => {
			this.goHome();
		});
		this.collapse.addEventListener("click", () => {
			this.navToggle(this.navShown)
		});
		this.trackers.addEventListener("click", () => {
			this.toggleTracker();
		});
		this.user.addEventListener("click", () => {
			let settingsMenu = document.querySelector("settings-menu");
			settingsMenu.toggle();
		});

		// collapsed menu button
		this.uncollapse.addEventListener("click", () => {
			this.navToggle(this.navShown)
		});


		// Vertical sized screen related buttons
		this.homeMenu.addEventListener("click", () => {
			this.goHome();
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
	 * toggles the collapse of the navigation bar 
	 */
	navToggle (navShown) {
		this.mainNav.classList.toggle("open", !navShown);
		this.mainNav.classList.toggle("closed", navShown);

		this.closedNav.classList.toggle("open", navShown);
		this.closedNav.classList.toggle("closed", !navShown);
		console.log(navShown)
		if (navShown) {
			this.navShown = false;
		} else {
			this.navShown = true;
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
