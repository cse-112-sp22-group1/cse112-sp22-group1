import * as localStorage from "../localStorage/userOperations.js";
import { header } from "../index.js";
import { SettingsMenu } from "./settings.jsx";
import { router } from "../state/router.js";
import { HelpMenu } from "./help.jsx";
import { currentState } from "../state/stateManager.js";
import { creationMenu } from "../index.js";
import { createDailyLog } from "../localStorage/userOperations.js";

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
			<button id="home"><img id="index" src="../public/resources/index.png"/><h1>Index</h1></button>
			<button id="collapse"><img id="collapseImage" src="../public/resources/left-chevron.png"/></button>
		</div>
		<button id="todaysLog"><img src="../public/resources/todaysLog.png"/><h1>Today's Log</h1></button>
		<button id="monthlyLog"><img src="../public/resources/monthlyLog.png"/><h1>Monthly Log</h1></button>
		<button id="futureLog"><img src="../public/resources/futureLog.png"/><h1>Future Log</h1></button>
		<div id="bottom">
			<button id="help"><img src="../public/resources/question.png"/><h1>Help </h1></button>
			<button id="user"><img src="../public/resources/user.png"/><h1>My Account</h1></button>
		</div>
	</nav>
	<nav class="collapsed-nav" id="closedNav">
		<button id="uncollapse"><img id="uncollapseImage" src="../public/resources/closedNav.png"/> </button>
	</nav>
	<nav class="navigation">
		<div id="menu" class="closed">
			<button id="phoneCollapse"><img id="collapseImage" src="../public/resources/left-chevron.png"/></button>
			<button id="phoneHome"><img id="phoneIndex" src="../public/resources/index.png"/><h1>Index</h1></button>
			<button><img id="todaysLog" src="../public/resources/todaysLog.png"/><h1>Today's Log</h1></button>
			<button><img id="monthlyLog" src="../public/resources/monthlyLog.png"/><h1>Monthly Log</h1></button>
			<button><img id="futureLog" src="../public/resources/futureLog.png"/><h1>Future Logs</h1></button>
			<div id="bottom">
				<button id="help"><img src="../public/resources/question.png"/><h1>Help </h1></button>
				<button id="user"><img src="../public/resources/user.png"/><h1>My Account</h1></button>
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

		this.help = this.shadowRoot.querySelectorAll("button")[5];
		this.user = this.shadowRoot.querySelectorAll("button")[6];
		this.uncollapse = this.shadowRoot.querySelectorAll("button")[7];

		// Would be used for a vertical screen size
		this.menu = this.shadowRoot.querySelector("#menu");

		this.collapseSmall = this.shadowRoot.querySelectorAll("button")[8];
		this.homeSmall = this.shadowRoot.querySelectorAll("button")[9];
		this.todayLogSmall = this.shadowRoot.querySelectorAll("button")[10];
		this.monthLogSmall = this.shadowRoot.querySelectorAll("button")[11];
		this.futureLogSmall = this.shadowRoot.querySelectorAll("button")[12];

		this.helpSmall = this.shadowRoot.querySelectorAll("button")[13];
		this.userSmall = this.shadowRoot.querySelectorAll("button")[14];
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
		this.todayLog.addEventListener("click", () => {
			this.goTodaysLog();
		});
		this.monthLog.addEventListener("click", () => {
			this.goMonthlyLog();
		});
		this.futureLog.addEventListener("click", () => {
			this.goFutureLog();
		});
		this.help.addEventListener("click", () => {
			let helpMenu = document.querySelector("help-menu");
			helpMenu.toggle();
		});
		this.user.addEventListener("click", () => {
			let settingsMenu = document.querySelector("settings-menu");
			settingsMenu.toggle();
		});

		// collapsed menu button
		this.uncollapse.addEventListener("click", () => {
			console.log("test")
			this.navToggle(this.navShown)

		});

		// Vertical sized screen related buttons
		this.collapseSmall.addEventListener("click", () => {
			this.toggle()
		});

		this.homeSmall.addEventListener("click", () => {
			this.goHome();
			this.open = false;
		});

		this.userSmall.addEventListener("click", () => {
			let settingsMenu = document.querySelector("settings-menu");
			settingsMenu.toggle();
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
		router.navigate("/");
	}

	/**
	 * Goes future log for today
	 */
	goFutureLog () {
		localStorage.readUser((err, user) => {
            if (err) {
                console.log(err);
            } else {
				let date = new Date()
				// if we find it then navigate
                for(let i = 0; i < user.futureLogs.length; i++) {
					console.log(date)
					let start = new Date(user.futureLogs[i].startDate)
					let end = new Date(user.futureLogs[i].endDate)
					if (start < date && end > date) {
						router.navigate("/futureLog/" + user.futureLogs[i].id)
						return
					}
				}
				// else prompt user with creation
				creationMenu.setKind("futureLog");
                creationMenu.show();
            }
        })
	}

	/**
 	* Goes monthly log for today
 	*/
	goMonthlyLog () {
		localStorage.readUser((err, user) => {
			if (err) {
				console.log(err);
			} else {
				let date = new Date()
				// if we find it then navigate
				for(let i = 0; i < user.monthlyLogs.length; i++) {
					console.log(date)
					let start = new Date(user.monthlyLogs[i].startDate)
					let end = new Date(user.monthlyLogs[i].endDate)
					if (start < date && end > date) {
						router.navigate("/monthlyLog/" + user.monthlyLogs[i].id)
						return
					}
				}
				// else prompt user with creation
				creationMenu.setKind("futureLog");
				creationMenu.show();
			}
		})
	}

	/**
 	* Goes monthly log for today
 	*/
	goTodaysLog () {
		localStorage.readUser((err, user) => {
			if (err) {
				console.log(err);
			} else {
				let date = new Date()
				// if we find it then navigate
				for(let i = 0; i < user.dailyLogs.length; i++) {
					console.log(date)
					let start = new Date(user.dailyLogs[i].startDate)
					if (start == date) {
						router.navigate("/dailyLog/" + user.dailyLogs[i].id)
						return
					}
				}
				// else check if monthly log exists for it
				for(let i = 0; i < user.monthlyLogs.length; i++) {
					console.log(date)
					let start = new Date(user.monthlyLogs[i].startDate)
					let end = new Date(user.monthlyLogs[i].endDate)
					console.log("test")
					if (start < date && end > date) {
						createDailyLog(user.monthlyLogs[i], [], user.monthlyLogs[i].collections, [], date, true, async (err, dailyLog) => {
							router.navigate("/dailyLog/" + dailyLog.id)
						});
						return
					}
				}
				// else prompt user with creation
				creationMenu.setKind("futureLog");
				creationMenu.show();
			}
		})
	}

	/**
	 * toggles the collapse of the navigation bar
	 */
	navToggle (navShown) {
		this.mainNav.classList.toggle("open", !navShown);
		this.mainNav.classList.toggle("closed", navShown);
		document.getElementById("contentWrapper").classList.toggle("centerContent");
		document.querySelector("page-header").classList.toggle("centerHeader");
		this.closedNav.classList.toggle("open", navShown);
		this.closedNav.classList.toggle("closed", !navShown);
		console.log(navShown);
		if (navShown) {
			this.navShown = false;
		} else {
			this.navShown = true;
		}
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
