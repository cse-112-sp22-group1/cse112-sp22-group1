/**
 * Index module
 * @module index
 */
import * as localStorage from "./localStorage/userOperations.js";
import { CreationMenu } from "./components/creationMenu.jsx";
import { CreatorBlock } from "./components/creator.jsx";
import { DropdownBlock } from "./components/dropdown.jsx";
import { InlineDropdown } from "./components/inlineDropdown.jsx";
import { NavBar } from "./components/navbar.jsx";
import { PageHeader } from "./components/header.jsx";
import { TrackerBlock } from "./components/trackerBlock.jsx";
import { TrackerMenu } from "./components/tracker.jsx";
import { createEditor } from "./components/blockController.js";
import { router } from "./state/router.js";
import { currentState } from "./state/stateManager.js";
import { Log } from "./components/log.jsx";


// CSS imports
/* eslint-disable */
import "./index.css";
/* eslint-enable */

document.querySelector("body").style.display = "none";

/**
 * The index page navbar
 */
export let navbar = new NavBar();

/**
 * The index page navbar
 */
 export let log = new Log();

/**
 * The index page header
 */
export let header = new PageHeader();

/**
 * Index page dropdown
 */
export let adderDropdown = new InlineDropdown();

/**
 * Index page futureLog creation menu
 */
export let creationMenu = new CreationMenu("futureLog");
/* eslint-disable */
let plusIndex = 0;
/* eslint-disable */

export let url = "";
export let pageNumber = 1;

/** 
 * Setter for url
 */
export function setUrl(newUrl) {
	url = newUrl;
}

/** 
 * Setter for pageNumber
 */
export function setPageNumber(newPageNumber) {
	pageNumber = newPageNumber;
}

let contentWrapper = document.getElementById("contentWrapper");
document.getElementById("adderDropdown").appendChild(adderDropdown);
document.getElementById("creationMenu").appendChild(creationMenu);
document.getElementById("topbar").appendChild(header);
document.getElementById("sidebar").appendChild(navbar);
document.getElementById("targetMenu").onclick = () => {
	navbar.toggleTracker();
};

contentWrapper.appendChild(log)
// Document.getElementById("")
router.setState(document.location.hash, false);

window.onpopstate = () => {
	router.setState(document.location.hash, true);
};



/**
 * Sets up the futureLog page with the mothlyLogs, textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the futureLog page's navbar.
 * @param {String} newState The new url to go to.
 */
export function setupFutureLog(btn, newState) {
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
						createEditor(dropdownDay.contentWrapper, currentMonth, currentDay.id, () => { });
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
	pageNumber = 4;
	url = newState;
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}
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

/**
 * Sets up the monthlyLog page with the dailyLogs, textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the monthlyLog page's navbar.
 * @param {String} newState The new url to go to.
 */
export function setupMonthlyLog(btn, newState) {
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
				createEditor(dropdownDay.contentWrapper, currentState, currentDay.id, () => { });
			}
			contentWrapper.appendChild(new CreatorBlock());
		}
	});
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	header.title = `${monthNames[new Date(currentState.date).getMonth()]} ${new Date(currentState.date).getFullYear()}`;
	pageNumber = 3;
	url = newState;
	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}
	document.getElementById("targetMenu").style.display = "block";
	// I have been told to just comment out these for right now
	// Main purpose of these was previously to remove certain navbar icons
	// but with the new nav bar it is no longer necessary.
	//   navbar.double.setAttribute("disabled", "disabled");
	//   navbar.double.style.visibility = "hidden";
	//   navbar.doubleMenu.setAttribute("disabled", "disabled");
	//   navbar.doubleMenu.style.visibility = "hidden";
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

/**
 * Sets up the daillyLog page with the textBlocks, and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the dailyLog page's navbar.
 * @param {String} newState The new url to go to.
 */
export function setupDailyLog(btn, newState) {
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	header.title = `${weekDays[new Date(currentState.date).getDay()]} ${monthNames[new Date(currentState.date).getMonth()]} ${new Date(currentState.date).getUTCDate()}, ${new Date(currentState.date).getFullYear()}`;
	pageNumber = 2;
	url = newState;
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


/**
 * Sets up the collection page with the textBlocks and trackers of the user.
 *
 * @param {Array} btn An array of the buttons in the collection page's navbar.
 * @param {String} newState The new url to go to.
 */
export function setupCollection(btn, newState) {

	header.title = currentState.title;
	pageNumber = 5;
	url = newState;
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
