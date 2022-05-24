import * as localStorage from "../localStorage/userOperations.js";
import { setPageType, setUrl } from "./router.js";
import { CreatorBlock } from "../components/creator.jsx";
import { DropdownBlock } from "../components/dropdown.jsx";
import { TrackerBlock } from "../components/trackerBlock.jsx";
import { TrackerMenu } from "../components/tracker.jsx";
import { createEditor } from "../components/blockController.js";
import { currentState } from "./stateManager.js";
import { header, contentWrapper } from "../index.js";


/**
 * Sets up the monthlyLog page with the dailyLogs, textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the monthlyLog page's navbar.
 * @param {String} newState The new url to go to.
 */
 export function setupMonthlyLog (btn, newState) {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = user.dailyLogs;

			let parentArr = [];
			for (let i = 0; i < currentState.days.length; i++) {
				Array.prototype.push.apply(parentArr, userArr.filter((object) => object.id === currentState.days[i].dailyLog));
			}

			let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			for (let i = 0; i < currentState.days.length; i++) {
				let currentDay = parentArr[i];
				let dropdownDay = new DropdownBlock(`${weekDays[new Date(currentDay.date).getDay()]}, ${monthNames[new Date(currentDay.date).getMonth()]} ${new Date(currentDay.date).getUTCDate()}`, currentDay, 1);
				contentWrapper.appendChild(dropdownDay);
				if (i > 0) {
					dropdownDay.titleWrapper.classList.add("singleItemWrapper");
				}
				/* eslint-disable */
				createEditor(dropdownDay.contentWrapper, currentState, currentDay.id, () => { });
				/* eslint-enable */
			}
			contentWrapper.appendChild(new CreatorBlock());
		}
	});
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	header.title = `${monthNames[new Date(currentState.date).getMonth()]} ${new Date(currentState.date).getFullYear()}`;

	/*
	 * PageNumber = 3;
	 * url = newState;
	 */
	setPageType(3);
	setUrl(newState);
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}
	document.getElementById("targetMenu").style.display = "block";

	/*
	 * I have been told to just comment out these for right now
	 * Main purpose of these was previously to remove certain navbar icons
	 * but with the new nav bar it is no longer necessary.
	 *   navbar.double.setAttribute("disabled", "disabled");
	 *   navbar.double.style.visibility = "hidden";
	 *   navbar.doubleMenu.setAttribute("disabled", "disabled");
	 *   navbar.doubleMenu.style.visibility = "hidden";
	 */
	header.makeUneditable();
	let headerButtons = header.imgbuttons;
	for (let i = 0; i < headerButtons.length; i++) {
		headerButtons[i].classList.remove("hide");
	}

	let monthlyLogTrackerMenu = new TrackerMenu("Monthly Log Trackers");
	document.getElementById("trackerWrapper").appendChild(monthlyLogTrackerMenu);
	let trackerBlockWrapper = monthlyLogTrackerMenu.shadowRoot.getElementById("editor");
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = user.trackers;
			let trackerArr = [];
			for (let i = 0; i < currentState.trackers.length; i++) {
				trackerArr.push(userArr.filter((object) => object.id === currentState.trackers[i])[0]);
			}
			setTimeout(() => {
				for (let i = 0; i < trackerArr.length; i++) {
					let currentTracker = trackerArr[i];
					let dropdownTracker = new TrackerBlock(currentTracker.title, currentState.id, currentTracker, monthlyLogTrackerMenu);
					trackerBlockWrapper.appendChild(dropdownTracker);
				}
				trackerBlockWrapper.appendChild(new CreatorBlock());

			}, 10);
		}
	});
}
