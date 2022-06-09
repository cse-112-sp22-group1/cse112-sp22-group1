/**
 * Router
 * @module router
 */

import { fade, unfade } from "../transitions.js";
import Navigo from "navigo";
import { getCurrentObject } from "./stateManager.js";
import { setupCollection } from "./setupCollection.js";
import { setupDailyLog } from "./setupDailyLog.js";
import { setupFutureLog } from "./setupFutureLog.js";
import { setupIndex } from "./setupIndex.js"
import { setupMonthlyLog } from "./setupMonthlyLog.js";

/**
 * @typedef {Object} Router
 * @property {String} route the route urls for the site
 */
export const router = new Navigo("/", { hash: true });

/**
 * Sets the new state based on the new url to render and the previous url.
 *
 * @param {String} newState The url to render.
 * @param {Function} setupFunction A function to setup a view.
 */
export let stateSwitch = (id, setupFunction) => {
	getCurrentObject(id);

	setTimeout(() => {
		while (document.getElementById("contentWrapper").childNodes.length > 0) {
			document.getElementById("contentWrapper").removeChild(document.getElementById("contentWrapper").childNodes[0]);
		}
		let body = document.querySelector("body");
		body.className = "";
		let content = document.querySelector("body");

		fade(content, () => {
			setupFunction();
			unfade(content);
		});
	}, 150);
}

/* Adds the our JS routes for the application */
router.on("/", () => stateSwitch(null, setupIndex));
router.on("/dailyLog/:id", ({ data }) => stateSwitch(data.id, setupDailyLog));
router.on("/monthlyLog/:id", ({ data }) => stateSwitch(data.id, setupMonthlyLog));
router.on("/futureLog/:id", ({ data }) => stateSwitch(data.id, setupFutureLog));
router.on("/collection/:id", ({ data }) => stateSwitch(data.id, setupCollection));
router.resolve();
