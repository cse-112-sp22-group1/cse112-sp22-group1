import { contentWrapper, header, setSearch } from "../index.js";
// Import { DropdownBlock } from "../components/dropdown.jsx";
import { FileLocation } from "../components/fileLocation.jsx";
import { Log } from "../components/log.jsx";
import { RightSidebar } from "../components/rightSidebar.jsx";
// Import { createEditor } from "../components/blockController.js";


import { currentState } from "./stateManager.js";

/**
 * Sets up the futureLog page with the mothlyLogs, textBlocks, and trackers of the user.
 */
export function setupFutureLog () {
	setSearch("")
	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));

	header.title = currentState.title
	header.makeEditable();
	header.loadSearchbar();
	// Remove all child fileLocations first first
	let child = header.file.lastElementChild;
	while (child) {
		header.file.removeChild(child);
		child = header.file.lastElementChild;
	}
	header.file.appendChild(new FileLocation(currentState.title, "futureLog", currentState.id, false));
	setTimeout(() => {
		let viewPort = document.getElementById("contentWrapper");
		console.log(viewPort.getClientRects());
		viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
	}, 10);
}


/**
 * Sets up the futureLog page with the mothlyLogs, textBlocks, and trackers of the user.
 */
 export function refreshFutureLog () {
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
