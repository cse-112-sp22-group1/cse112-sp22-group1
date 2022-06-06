import { contentWrapper, header } from "../index.js";
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

	contentWrapper.appendChild(new Log(currentState));
	contentWrapper.appendChild(new RightSidebar(currentState.trackers));

	header.title = currentState.title
	header.makeEditable();
	// Remove all child fileLocations first first
	let child = header.file.lastElementChild;
	while (child) {
		header.file.removeChild(child);
		child = header.file.lastElementChild;
	}
	header.file.appendChild(new FileLocation(currentState.title, "futureLog", currentState.id, false));

}
