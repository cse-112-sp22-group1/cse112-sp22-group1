import { createEditor } from "../components/blockController.js";
import { setUrl, setPageType } from "./router.js";
import { currentState } from "./stateManager.js";
import { header } from "../index.js";

/**
 * Sets up the collection page with the textBlocks and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the collection page's navbar.
 * @param {String} newState The new url to go to.
 */
 export function setupCollection(btn, newState) {

	header.title = currentState.title;
	// pageNumber = 5;
	// url = newState;
	setPageType(5);
	setUrl(newState);
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}

	createEditor(contentWrapper, currentState, null, (success) => {
		console.log(success);
	});
	// I have been told to just comment out these for right now
	// Main purpose of these was previously to remove certain navbar icons
	// but with the new nav bar it is no longer necessary.
	//   navbar.single.setAttribute("disabled", "disabled");
	//   navbar.single.style.visibility = "hidden";
	//   navbar.double.setAttribute("disabled", "disabled");
	//   navbar.double.style.visibility = "hidden";
	//   navbar.singleMenu.setAttribute("disabled", "disabled");
	//   navbar.singleMenu.style.visibility = "hidden";
	//   navbar.doubleMenu.setAttribute("disabled", "disabled");
	//   navbar.doubleMenu.style.visibility = "hidden";
	header.makeEditable();
	let headerButtons = header.imgbuttons;
	for (let i = 0; i < headerButtons.length; i++) {
		headerButtons[i].classList.remove("hide");
	}
	// Document.getElementById("trackerWrapper").appendChild(new TrackerMenu("Future Log Trackers"));
}