import * as localStorage from "../localStorage/userOperations.js";
import { contentWrapper, header } from "../index.js"
import { CreatorBlock } from "../components/creator.jsx";
import { DropdownBlock } from "../components/dropdown.jsx";
import { FileLocation } from "../components/fileLocation.jsx";
import { currentState } from "./stateManager.js";
import { IndexDropdown } from "../components/indexDropdown.jsx";

/**
 * Sets up the index page with the futureLogs and collections of the user.
 */
export function setupIndex () {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = [];
			Array.prototype.push.apply(userArr, user.futureLogs);

			let parentArr = [];
			for (let i = 0; i < currentState.futureLogs.length; i++) {
				Array.prototype.push.apply(parentArr, userArr.filter((object) => object.id === currentState.futureLogs[i]));
			}

			let dropdownContainer = document.createElement("section");
			dropdownContainer.id = "dropdownContainer";
			contentWrapper.appendChild(dropdownContainer);
		
			for (let i = 0; i < parentArr.length; i++) {
				console.log("inside for loop");
				if (parentArr[i].objectType === "futureLog") {
					let futureLogStart = new Date(parentArr[i].startDate);
					let futureLogEnd = new Date(parentArr[i].endDate);
					let dropdown = new IndexDropdown(parentArr[i]);
					dropdownContainer.appendChild(dropdown)

				}
			}
		}
	});
	header.title = "Index";
}
