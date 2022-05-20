import * as localStorage from "../localStorage/userOperations.js";
import { header } from "../index.js"
import { setUrl, setPageType } from "./router.js";
import { CreatorBlock } from "../components/creator.jsx";
import { DropdownBlock } from "../components/dropdown.jsx";
import { currentState } from "./stateManager.js";

/**
 * Sets up the index page with the futureLogs and collections of the user.
 *
 * @param {Array} btn An array of the buttons in the index page's navbar.
 */
 export function setupIndex(btn) {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			console.log(user.futureLogs);
			let userArr = [];
			Array.prototype.push.apply(userArr, user.futureLogs);
			Array.prototype.push.apply(userArr, user.collections);

			let parentArr = [];
			console.log(currentState);
			for (let i = 0; i < currentState.contents.length; i++) {
				Array.prototype.push.apply(parentArr, userArr.filter((object) => object.id === currentState.contents[i]));
			}

			let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			for (let i = 0; i < parentArr.length; i++) {
				console.log("inside for loop");
				if (parentArr[i].objectType === "futureLog") {
					let futureLogStart = new Date(parentArr[i].startDate);
					let futureLogEnd = new Date(parentArr[i].endDate);
					let dropdown = new DropdownBlock(`Future Log ${monthNames[futureLogStart.getMonth()]} ${futureLogStart.getFullYear()} - ${monthNames[futureLogEnd.getMonth()]} ${futureLogEnd.getFullYear()}`, parentArr[i], 1);
					contentWrapper.appendChild(dropdown);

					if (i > 0) {
						dropdown.titleWrapper.classList.add("singleItemWrapper");
					}

					for (let j = 0; j < parentArr[i].months.length; j++) {
						let currentMonth = user.monthlyLogs.filter((month) => month.id === parentArr[i].months[j].monthlyLog)[0];
						console.log(currentMonth);
						console.log(user);
						let dropdownMonth = new DropdownBlock(`${monthNames[new Date(currentMonth.date).getMonth()]} ${new Date(currentMonth.date).getFullYear()}`, currentMonth, 2);
						dropdown.contentWrapper.appendChild(dropdownMonth);
						for (let k = 0; k < currentMonth.days.length; k++) {
							let currentDay = user.dailyLogs.filter((day) => day.id === currentMonth.days[k].dailyLog)[0];
							let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
							let dropdownDay = new DropdownBlock(`${weekDays[new Date(currentDay.date).getDay()]}, ${monthNames[new Date(currentDay.date).getMonth()]} ${new Date(currentDay.date).getUTCDate()}`, currentDay, 3);
							dropdownMonth.contentWrapper.appendChild(dropdownDay);
						}
					}
				} else {
					let collection = parentArr[i];
					let dropdown = new DropdownBlock(collection.title, collection, 1);
					contentWrapper.appendChild(dropdown);
					if (i > 0) {
						dropdown.titleWrapper.classList.add("singleItemWrapper");
					}
				}
			}
			contentWrapper.appendChild(new CreatorBlock());
		}
	});
	console.log("we are here");
	header.title = "Index";
	setUrl("/");
	setPageType(1);

	// Setting navbar buttons
	for (let i = 0; i < btn.length; i++) {
		btn[i].removeAttribute("disabled");
		btn[i].style.visibility = "visible";
	}
	document.getElementById("targetMenu").style.display = "none";
	// I have been told to just comment out these for right now
	// Main purpose of these was previously to remove certain navbar icons
	// but with the new nav bar it is no longer necessary.
	//   navbar.target.setAttribute("disabled", "disabled");
	//   navbar.target.style.visibility = "hidden";
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
		if (!headerButtons[i].classList.contains("plus")) {
			headerButtons[i].classList.add("hide");
		}
	}
}