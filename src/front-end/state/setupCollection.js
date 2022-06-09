import * as localStorage from "../localStorage/userOperations.js";
import { contentWrapper, header } from "../index.js";
import { FileLocation } from "../components/fileLocation.jsx";
import { Log } from "../components/log.jsx";
import { RightSidebar } from "../components/rightSidebar.jsx";
import { currentState } from "./stateManager.js";

/**
 * Sets up the collection page with the textBlocks and trackers of the user.
 */
export function setupCollection () {
	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));
	header.title = currentState.title;

	header.makeEditable();
	let child = header.file.lastElementChild;
	while (child) {
		header.file.removeChild(child);
		child = header.file.lastElementChild;
	}
	header.loadSearchbar();
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let level = 0;
			let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			let userArr = [];
			Array.prototype.push.apply(userArr, user.dailyLogs);
			Array.prototype.push.apply(userArr, user.monthlyLogs);
			Array.prototype.push.apply(userArr, user.futureLogs);
			Array.prototype.push.apply(userArr, user.collections);
			let currentParent = userArr.filter((reference) => reference.id === currentState.parent)[0];
			if (!currentParent) {
				header.file.appendChild(new FileLocation("Index", "index", null, true));
			}
			while (currentParent && level < 3) {
				if (currentParent.objectType === "futureLog") {
					header.file.appendChild(new FileLocation(currentParent.title, "futureLog", currentParent.id, true));
				} else if (currentParent.objectType === "monthlyLog") {
					let currentDate = new Date(currentParent.startDate);
					header.file.appendChild(new FileLocation(`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, "monthlyLog", currentParent.id, true));
				} else if (currentParent.objectType === "dailyLog") {
					let currentDate = new Date(currentParent.date);
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
					header.file.appendChild(new FileLocation(`${months[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`, "dailyLog", currentParent.id, true));
				} else {
					header.file.appendChild(new FileLocation(currentParent.title, "collection", currentParent.id, true));
				}
				level += 1;
				if (currentParent.parent) {
					currentParent = userArr.filter((reference) => reference.id === parent.parent)[0];
				} else {
					currentParent = null;
				}
			}
			header.file.appendChild(new FileLocation(currentState.title, "collection", currentState.id, false));
			let viewPort = document.getElementById("contentWrapper");
			console.log(viewPort.getClientRects());
			viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
		}
	});
}
