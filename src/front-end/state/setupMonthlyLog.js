import * as localStorage from "../localStorage/userOperations.js";
import { contentWrapper, header, setSearch } from "../index.js";

/*
 * Import { CreatorBlock } from "../components/creator.jsx";
 * import { DropdownBlock } from "../components/dropdown.jsx";
 */
import { FileLocation } from "../components/fileLocation.jsx";
// Import { createEditor } from "../components/blockController.js";
import { Log } from "../components/log.jsx";
import { RightSidebar } from "../components/rightSidebar.jsx";
import { currentState } from "./stateManager.js";

/**
 * Sets up the monthlyLog page with the dailyLogs, textBlocks, and trackers of the user.
 */
export function setupMonthlyLog () {
	setSearch("");
	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));

	let currentDate = new Date(currentState.startDate);
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	header.title = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
	header.makeUneditable();
	header.loadSearchbar();
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
			let parent = user.futureLogs.filter((reference) => reference.id === currentState.parent)[0];
			header.file.appendChild(new FileLocation(parent.title, "futureLog", currentState.parent, true));
			header.file.appendChild(new FileLocation(`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, "monthlyLog", currentState.id, false));
			let viewPort = document.getElementById("contentWrapper");
			console.log(viewPort.getClientRects());
			viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
		}
	});
}

/**
 * Used to refresh the contents of the contentwrapper
 */
export function refreshMonthlyLog () {
    let oldChild = contentWrapper.lastElementChild;
    while (oldChild) {
        contentWrapper.removeChild(oldChild);
        oldChild = contentWrapper.lastElementChild;
    }

	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));

	setTimeout(() => {
		let viewPort = document.getElementById("contentWrapper");
		console.log(viewPort.getClientRects());
		viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
	}, 10);
}
