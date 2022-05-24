/**
 * Router
 * @module router
 */

 import * as localStorage from "../localStorage/userOperations.js";
 import { fade, unfade } from "../transitions.js";
 import { getCurrentObject } from "./stateManager.js";
 import { navbar, contentWrapper } from "../index.js";
 import { setupCollection } from "./setupCollection.js";
 import { setupDailyLog } from "./setupDailyLog.js";
 import { setupFutureLog } from "./setupFutureLog.js";
 import { setupIndex } from "./setupIndex.js"
 import { setupMonthlyLog } from "./setupMonthlyLog.js";

 /**
  * @typedef {Object} Router
  * @property {String} route the route urls for the site
  */
 export const router = {};

 /**
  * @type {String}
  */
 export let state = "";

/**
 * Used for url of page
 */
export let url = "";

/**
 * Setter for url
 */
export function setUrl (newUrl) {
	url = newUrl;
}

/**
 * Setter for url
 */
export let pageType = 1;
// PageNumber

/**
 * Setter for pageType
 */
export function setPageType (newPageType) {
	pageType = newPageType;
}


/**
 * Sets the new state based on the new url to render and the previous url.
 *
 * @param {String} newState The url to render.
 * @param {Bool} shouldNotAddToHistory The url that was last rendered.
 */
function stateSwitch (newState, shouldNotAddToHistory) {
	getCurrentObject(newState);
	state = newState;
	setTimeout(() => {
		if (document.getElementById("trackerWrapper").childNodes.length > 0) {
			document.getElementById("trackerWrapper").removeChild(document.getElementById("trackerWrapper").childNodes[0]);
		}
		while (document.getElementById("contentWrapper").childNodes.length > 0) {
			document.getElementById("contentWrapper").removeChild(document.getElementById("contentWrapper").childNodes[0]);
		}
		let body = document.querySelector("body");
		body.className = "";
		let content = document.querySelector("body");
		let btn = navbar.shadowRoot.querySelectorAll("button");

		fade(content, () => {
			localStorage.readUser((user) => {
				console.log(user);
				// Index page
				if (state === null || state === "#index" || state === "") {
					setupIndex(btn);
				} else if (state.includes("#dailyLog")) {
					setupDailyLog(btn, newState);
				} else if (state.includes("#monthlyLog")) {
					setupMonthlyLog(btn, newState);
				} else if (state.includes("#futureLog")) {
					setupFutureLog(btn, newState);
				} else if (state.includes("#collection")) {
					setupCollection(btn, newState);
				}
				if (!shouldNotAddToHistory) {
					history.pushState({page: pageType}, "", url);
				}
				unfade(content, () => {
					console.log("unfading the content");
				});
			});
		});
	}, 150);
}

router.setState = stateSwitch;
