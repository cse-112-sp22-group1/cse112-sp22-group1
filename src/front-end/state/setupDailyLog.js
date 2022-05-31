import * as localStorage from "../localStorage/userOperations.js";
import { contentWrapper, header } from "../index.js";
import { TrackerBlock } from "../components/trackerBlock.jsx";
import { TrackerMenu } from "../components/tracker.jsx";
import { createEditor } from "../components/blockController.js";
import { currentState } from "./stateManager.js";

/**
 * Sets up the daillyLog page with the textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the dailyLog page's navbar.
 */
export function setupDailyLog (btn) {
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	header.title = `${weekDays[new Date(currentState.date).getDay()]} ${monthNames[new Date(currentState.date).getMonth()]} ${new Date(currentState.date).getUTCDate()}, ${new Date(currentState.date).getFullYear()}`;
	header.futureLog.locationTitle = " Future Log /"
	header.monthlyLog.locationTitle = " Monthly Log /";
	header.todaysLog.locationTitle = " Today's Log ";
	header.futureLog.style.display = "block";
	header.monthlyLog.style.display = "block";
	header.todaysLog.style.display = "block";


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
