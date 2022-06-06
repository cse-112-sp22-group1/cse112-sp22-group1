/**
 * StateManager module which establishes what url we will be grabbing our data
 * @module stateManager
 */

import * as localStorage from "../localStorage/userOperations.js";

/**
 * @type {DailyLog}
 */
export let currentState = {};

/**
 * Gets the current object at the current url.
 *
 * @param {String} urlFromRouter The current url.
 */
export function getCurrentObject (id) {
	localStorage.readUser((err, user) => {
		if (err) {
			window.location.href = "/login";
		} else if (id) {
			let userArr = [];
			Array.prototype.push.apply(userArr, user.dailyLogs);
			Array.prototype.push.apply(userArr, user.monthlyLogs);
			Array.prototype.push.apply(userArr, user.futureLogs);
			Array.prototype.push.apply(userArr, user.collections);
			let parsed = userArr.filter((object) => object.id === id);
			currentState = parsed[0];
			console.log(currentState);
		} else {
			currentState = user.index;
		}
	});
}
