import * as localStorage from "../localStorage/userOperations.js";
import { contentWrapper, header } from "../index.js";
import { FileLocation } from "../components/fileLocation.jsx";
import { Log } from "../components/log.jsx";
import { RightSidebar } from "../components/rightSidebar.jsx";
// Import { createEditor } from "../components/blockController.js";
import { currentState } from "./stateManager.js";

/**
 * Sets up the daillyLog page with the textBlocks, and trackers of the user.
 */
export function setupDailyLog () {
	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));
	let currentDate = new Date(currentState.date);
	let day = `${currentDate.getDate()}`;
	if (currentDate.getDate() % 10 === 1) {
		day = `${day}st`;
	} else if (currentDate.getDate() % 10 === 2) {
		day = `${day}nd`
	} else if (currentDate.getDate() % 10 === 3) {
		day = `${day}rd`
	} else {
		day = `${day}th`
	}
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	header.title = `${months[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`;
	// FutureLogEnd.getFullYear() === futureLogStart.getFullYear() ? `Future Log ${futureLogStart.getFullYear()}` : `Future Log ${futureLogStart.getFullYear()} - ${futureLogEnd.getFullYear()}`;

	// Remove all child fileLocations first first
	let child = header.file.lastElementChild;
	while (child) {
		header.file.removeChild(child);
		child = header.file.lastElementChild;
	}
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let month = user.monthlyLogs.filter((reference) => reference.id === currentState.parent)[0];
			let futureLog = user.futureLogs.filter((reference) => reference.id === month.parent)[0];
			header.file.appendChild(new FileLocation(futureLog.title, "futureLog", month.parent, true));
			header.file.appendChild(new FileLocation(`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, "monthlyLog", currentState.parent, true));
			header.file.appendChild(new FileLocation(`${months[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`, "dailyLog", currentState.id, false));
		}
	});
}
