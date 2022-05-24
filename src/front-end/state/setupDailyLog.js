import * as localStorage from "../localStorage/userOperations.js";
import { setPageType, setUrl } from "./router.js";
import { TrackerBlock } from "../components/trackerBlock.jsx";
import { TrackerMenu } from "../components/tracker.jsx";
import { createEditor } from "../components/blockController.js";
import { currentState } from "./stateManager.js";
import { header, contentWrapper } from "../index.js";


/**
 * Sets up the daillyLog page with the textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the dailyLog page's navbar.
 * @param {String} newState The new url to go to.
 */
 export function setupDailyLog (btn, newState) {
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	header.title = `${weekDays[new Date(currentState.date).getDay()]} ${monthNames[new Date(currentState.date).getMonth()]} ${new Date(currentState.date).getUTCDate()}, ${new Date(currentState.date).getFullYear()}`;

	/*
	 * PageNumber = 2;
	 * url = newState;
	 */
	setPageType(2);
	setUrl(newState);
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}

	createEditor(contentWrapper, currentState, null, (success) => {
		console.log(success);
	});
	document.getElementById("targetMenu").style.display = "block";
	header.makeUneditable();
	let headerButtons = header.imgbuttons;
	for (let i = 0; i < headerButtons.length; i++) {
		headerButtons[i].classList.remove("hide");
	}

	let monthlyLogTrackerMenu = new TrackerMenu("Daily Log Trackers");
	document.getElementById("trackerWrapper").appendChild(monthlyLogTrackerMenu);
	let trackerBlockWrapper = monthlyLogTrackerMenu.shadowRoot.getElementById("editor");
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = user.trackers;
			let trackerArr = [];
			for (let i = 0; i < currentState.trackers.length; i++) {
				console.log("hello");
				trackerArr.push(userArr.filter((object) => object.id === currentState.trackers[i])[0]);
			}
			console.log(trackerArr);
			setTimeout(() => {
				for (let i = 0; i < trackerArr.length; i++) {
					let currentTracker = trackerArr[i];
					let dropdownTracker = new TrackerBlock(currentTracker.title, currentState.id, 1);
					trackerBlockWrapper.appendChild(dropdownTracker);
				}
				createEditor(trackerBlockWrapper, null, null, (success) => {
					console.log(success);
				});
			}, 10);
		}
	});

}
