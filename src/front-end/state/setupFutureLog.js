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
 * Sets up the futureLog page with the mothlyLogs, textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the futureLog page's navbar.
 * @param {String} newState The new url to go to.
 */
 export function setupFutureLog (btn, newState) {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = user.monthlyLogs;
			console.log(currentState);
			let parentArr = [];
			for (let i = 0; i < currentState.months.length; i++) {
				Array.prototype.push.apply(parentArr, userArr.filter((object) => object.id === currentState.months[i].monthlyLog));
			}

			let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			for (let i = 0; i < parentArr.length; i++) {
				let currentMonth = parentArr[i];
				let dropdownMonth = new DropdownBlock(`${monthNames[new Date(currentMonth.date).getMonth()]} ${new Date(currentMonth.date).getFullYear()}`, currentMonth, 1);
				contentWrapper.appendChild(dropdownMonth);

				if (i > 0) {
					dropdownMonth.titleWrapper.classList.add("singleItemWrapper");
				}

				createEditor(dropdownMonth.contentWrapper, currentState, currentMonth.id, () => {
					for (let k = 0; k < currentMonth.days.length; k++) {
						let currentDay = user.dailyLogs.filter((day) => day.id === currentMonth.days[k].dailyLog)[0];
						let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
						let dropdownDay = new DropdownBlock(`${weekDays[new Date(currentDay.date).getDay()]}, ${monthNames[new Date(currentDay.date).getMonth()]} ${new Date(currentDay.date).getUTCDate()}`, currentDay, 2);
						dropdownMonth.contentWrapper.appendChild(dropdownDay);
                        /* eslint-disable */
						createEditor(dropdownDay.contentWrapper, currentMonth, currentDay.id, () => {});
                        /* eslint-enable */
					}
				});
			}
			contentWrapper.appendChild(new CreatorBlock());
		}
	});
	document.getElementById("targetMenu").style.display = "block";
	let futureLogStart = new Date(currentState.startDate);
	let futureLogEnd = new Date(currentState.endDate);
	header.title = futureLogEnd.getFullYear() === futureLogStart.getFullYear() ? `Future Log ${futureLogStart.getFullYear()}` : `Future Log ${futureLogStart.getFullYear()} - ${futureLogEnd.getFullYear()}`;

	/*
	 * PageNumber = 4;
	 * url = newState;
	 */
	setPageType(4);
	setUrl(newState);
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}

	/*
	 * I have been told to just comment out these for right now
	 * Main purpose of these was previously to remove certain navbar icons
	 * but with the new nav bar it is no longer necessary.
	 *   navbar.single.setAttribute("disabled", "disabled");
	 *   navbar.single.style.visibility = "hidden";
	 *   navbar.double.setAttribute("disabled", "disabled");
	 *   navbar.double.style.visibility = "hidden";
	 *   navbar.singleMenu.setAttribute("disabled", "disabled");
	 *   navbar.singleMenu.style.visibility = "hidden";
	 *   navbar.doubleMenu.setAttribute("disabled", "disabled");
	 *   navbar.doubleMenu.style.visibility = "hidden";
	 */
	header.makeUneditable();
	let headerButtons = header.imgbuttons;
	for (let i = 0; i < headerButtons.length; i++) {
		headerButtons[i].classList.remove("hide");
	}

	let futureLogTrackerMenu = new TrackerMenu("Future Log Trackers");
	document.getElementById("trackerWrapper").appendChild(futureLogTrackerMenu);
	let trackerBlockWrapper = futureLogTrackerMenu.shadowRoot.getElementById("editor");

	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			let userArr = user.trackers;
			let trackerArr = [];
			for (let i = 0; i < currentState.trackers.length; i++) {
				trackerArr.push(userArr.filter((object) => object.id === currentState.trackers[i])[0]);
			}
			console.log(trackerArr);
			setTimeout(() => {
				for (let i = 0; i < trackerArr.length; i++) {
					let currentTracker = trackerArr[i];
					let dropdownTracker = new TrackerBlock(currentTracker.title, currentState.id, currentTracker, futureLogTrackerMenu);
					trackerBlockWrapper.appendChild(dropdownTracker);
				}
				trackerBlockWrapper.appendChild(new CreatorBlock());
			}, 10);
		}
	});
}
