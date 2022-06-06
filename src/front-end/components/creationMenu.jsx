/* eslint-disable */
import * as localStorage from "../localStorage/userOperations.js";
import { DropdownBlock } from "./dropdown.jsx";
import { createEditor } from "./blockController.js";
import { currentState } from "../state/stateManager.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

const futureLogCreator = <form class="future" title="New Future Log">
	<label htmlFor="futureTitle">Title:</label>
	<input id="futureTitle" name="future-title" />
    <section id="futureTimes">
		<div>
			<label htmlFor="futureFrom">From:</label>
			<input id="futureFrom" name="future-from" />
		</div>
		<div>
			<label htmlFor="futureTo">To:</label>
			<input id="futureTo" name="future-to" />
		</div>
	</section>
</form>;

const monthlyLogCreator = <form class="monthly" title="New Monthly Log">
	<label>From: <br />
	<input id="monthlyFrom" name="monthly-from" />
	</label>
	<label>To: <br />
	<input id="monthlyTo" name="monthly-to" />
	</label>
</form>;

const dailyLogCreator = <form class="daily" title="New Daily Log">
	<label for="daily-title">Title:</label>
	<input type="text" id="daily" name="daily" />
</form>;

const collectionCreator = <form class="collection" title="New Collection">
	<label for="collection-title">Title:</label>
	<input type="text" id="collection-title" name="collection-title" />
</form>;

const trackerCreator = <form class="tracker" title="New Goal">
	<label for="tracker-title">Title:</label>
	<input type="text" id="tracker-title" name="tracker-title" />
	<section id="tracker-recurring-check">
		<label for="tracker-recurring">Make it a recurring goal:</label>
		<div id="checkerContainer" checked=""><span id="tracker-recurring" /></div>
	</section>
</form>;

let template = <template>
	{/* The Modal */}
	<link type="text/css" rel="stylesheet" href="datepicker.min.css" />
	<link type="text/css" rel="stylesheet" href="creationMenu.css" />
    <div id="popup" class="popup">
        <div class="menu">
            <header>
                <h1> Creation Menu </h1>
                <button class="close"><img id="dismiss" src="../../public/resources/xIcon.png" /></button>
            </header>
            {/* Modal content */}
            <div class="menu-content">
                <div class="popup-content"></div>
                <div class="createLayout">
                    <img id="loadingWheel" style="display: none;" src="../public/resources/loading.gif"/>
                    <div id="createButton">Create</div>
                </div>
            </div>
        </div>
    </div>
</template>

/**
 * Class that creates a creation Menu
 */
export class CreationMenu extends HTMLElement {

	/**
	 * Constructor for CreationMenu
	 * @param {String} kind the kind of log to make menu for
	 */
	constructor (kind) {
		super();
		this.attachShadow({mode: "open"});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.startPicker = null;
		this.endPicker = null;
        this.popup = this.shadowRoot.getElementById("popup");
		this.content = this.shadowRoot.querySelector(".popup-content");
        this.heading = this.shadowRoot.querySelector("header h1");
        this.kind = kind;

		this.setKind(kind);
        // Get the <span> element that closes the popup
		this.closeButton = this.shadowRoot.querySelectorAll(".close")[0];

        this.create = this.shadowRoot.getElementById("createButton");
        this.loadingWheel = this.shadowRoot.getElementById("loadingWheel");
	}

    connectedCallback () {
		this.closeButton.addEventListener("click", () => {
			this.hide();
		});

        this.create.addEventListener("click", () => {
            this.loadingWheel.style.display = "inline";
        })
        this.create.addEventListener("click", () => {
			if (this.kind === "futureLog") {
                this.createFutureLog();
			} else if (this.kind === "monthlyLog") {
				this.createMonthlyLog();
			} else if (this.kind === "collection") {
                this.createCollection();
			} else if (this.kind === "tracker") {
                this.createTracker();
			}
		})
    }

	/**
	 * Show the menu
	 */
	show() {
		this.popup.style.display = "block";
	}

    hide() {
        this.loadingWheel.style.display = "none";
        this.popup.style.display = "none";
    }


	/**
	 * set the kind of menu to a passed in kind
	 * @param {String} kind the replacement kind
	 */
	setKind (kind) {
		while (this.content.childNodes.length > 0){
			this.content.childNodes[0].remove();
		}
        this.kind = kind;
		if (kind === "futureLog") {
			this.content.appendChild(futureLogCreator);
			if (this.startPicker !== null && this.endPicker !== null) {
				/* eslint-disable */
				this.startPicker.remove();
				this.endPicker.remove();
				/* eslint-disable */
			}
			this.futureTitle = this.shadowRoot.getElementById("futureTitle");
			this.startPicker = datepicker(this.shadowRoot.getElementById("futureFrom"), {id: 1});
			this.endPicker = datepicker(this.shadowRoot.getElementById("futureTo"), {id: 1});
		} else if (kind === "monthlyLog") {
			this.content.appendChild(monthlyLogCreator);
			if (this.startPicker !== null && this.endPicker !== null) {
				/* eslint-disable */
				this.startPicker.remove();
				this.endPicker.remove();
				/* eslint-disable */
			}
			this.startPicker = datepicker(this.shadowRoot.getElementById("monthlyFrom"), {id: 1, onSelect: (instance, date) => {
				if (new Date(this.shadowRoot.getElementById("monthlyTo").value).getMonth() !== date.getMonth() && instance.getRange().end) {
					this.shadowRoot.getElementById("monthlyTo").value = "";
					this.endPicker.setDate();
					alert("Your start and end date must me on the same month");
				}
				this.startPicker.hide();
			}});
			this.endPicker = datepicker(this.shadowRoot.getElementById("monthlyTo"), {id: 1, onSelect: (instance, date) => {
				if (new Date(this.shadowRoot.getElementById("monthlyFrom").value).getMonth() !== date.getMonth() && instance.getRange().end) {
					this.shadowRoot.getElementById("monthlyFrom").value = "";
					this.startPicker.setDate();
					alert("Your start and end date must me on the same month");
				}
				this.endPicker.hide();
			}});
		} else if (kind === "dailyLog") {
			this.content.appendChild(dailyLogCreator);
			if (this.startPicker !== null && this.endPicker !== null) {
				this.startPicker.remove();
				this.endPicker.remove();
			}
			this.startPicker = datepicker(this.shadowRoot.getElementById("daily"), {id: 1});
		} else if (kind === "collection") {
			this.content.appendChild(collectionCreator);
		} else if (kind === "tracker") {
			this.content.appendChild(trackerCreator);
			if (currentState.objectType !== "futureLog" && currentState.objectType !== "collection") {
				this.shadowRoot.getElementById("tracker-recurring-check").style.display = "block";
				this.checkbox = this.shadowRoot.getElementById("checkerContainer");
				this.isRecurring = false;
				this.checkbox.onclick = () => {
					if (this.checkbox.getAttribute("checked") === "checked") {
						this.checkbox.setAttribute("checked", "");
						this.isRecurring = false;
					} else {
						this.checkbox.setAttribute("checked", "checked");
						this.isRecurring = true;
					}
				};
			} else {
				this.shadowRoot.getElementById("tracker-recurring-check").style.display = "none";
			}
		}

        this.heading.textContent = this.shadowRoot.querySelector("form").getAttribute("title");
	}

    createFutureLog () {
        let start = new Date(this.shadowRoot.getElementById("futureFrom").value);
        let end = new Date(this.shadowRoot.getElementById("futureTo").value);
		let title = this.futureTitle.value;
		if (start && end && title){
			localStorage.createFutureLog(title, start, end, [], [], [], [], true, (err, futureLog) => {
				if (err) {
					console.log(err);
				} else if (futureLog) {
					console.log(futureLog);
					localStorage.readUser((error, user) => {
						if(error){
							console.log(error);
						} else {
							let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
							let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
							let contentWrapper = document.getElementById("contentWrapper");
							let futureLogStart = new Date(futureLog.startDate);
							let futureLogEnd = new Date(futureLog.endDate);
							let dropdown = new DropdownBlock(`Future Log ${monthNames[futureLogStart.getMonth()]} ${futureLogStart.getFullYear()} - ${monthNames[futureLogEnd.getMonth()]} ${futureLogEnd.getFullYear()}`, futureLog, 1);
							contentWrapper.insertBefore(dropdown, contentWrapper.lastChild);

							if (contentWrapper.childNodes.length >= 1) {
								dropdown.titleWrapper.classList.add("singleItemWrapper");
							}

							for (let j = 0; j < futureLog.months.length; j++) {
								let currentMonth = user.monthlyLogs.filter((month) => month.id === futureLog.months[j].id)[0];
								let dropdownMonth = new DropdownBlock(`${monthNames[new Date(currentMonth.date).getMonth()]} ${new Date(currentMonth.date).getFullYear()}`, currentMonth, 2);
								dropdown.contentWrapper.appendChild(dropdownMonth);
								for (let k = 0; k < currentMonth.days.length; k++) {
									let currentDay = user.dailyLogs.filter((day) => day.id === currentMonth.days[k].dailyLog)[0];
									let dropdownDay = new DropdownBlock(`${weekDays[new Date(currentDay.date).getDay()]}, ${monthNames[new Date(currentDay.date).getMonth()]} ${new Date(currentDay.date).getUTCDate()}`, currentDay, 3);
									dropdownMonth.contentWrapper.appendChild(dropdownDay);
								}
							}
							this.hide();
							dropdown.scrollIntoView({behavior: "smooth"});
						}
					});
				}
			});
		} else {
			alert("You must give a title and pick a start and end date!")
			this.loadingWheel.style.display = "none";
		}
    }

	createMonthlyLog () {
		let start = new Date(this.shadowRoot.getElementById("monthlyFrom").value);
        let end = new Date(this.shadowRoot.getElementById("monthlyTo").value);
		console.log(new Date(currentState.startdate) > end || new Date(currentState.endDate) < start);
		if ((new Date(currentState.startDate) > end || new Date(currentState.endDate) < start) && start !== null && end !== null) {
			console.log(start);
			console.log(end);
			localStorage.createMonthlyLog(currentState.id, [], [], start, end, true, (err, monthlyLog) => {
				if (err) {
					console.log(err);
				} else if (monthlyLog) {
					localStorage.readUser((error, user) => {
						if (error) {
							console.log(error);
						} else {
							let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
							let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
							let contentWrapper = document.getElementById("contentWrapper");
							let currentMonth = monthlyLog;
							let dropdownMonth = new DropdownBlock(`${monthNames[new Date(currentMonth.date).getMonth()]} ${new Date(currentMonth.date).getFullYear()}`, currentMonth, 1);
							contentWrapper.insertBefore(dropdownMonth, contentWrapper.lastChild);
							if (contentWrapper.childNodes.length >= 1) {
								dropdownMonth.titleWrapper.classList.add("singleItemWrapper");
							}
							if (new Date(currentState.startDate) > end) {
								currentState.startDate = start.toDateString();
								currentState.months.splice(0, 0, {id: monthlyLog.id, content: [], monthlyLog: monthlyLog.id});
							} else {
								currentState.endDate = end.toDateString();
								currentState.months.push({id: monthlyLog.id, content: [], monthlyLog: monthlyLog.id});
							}
							localStorage.updateFutureLog(currentState, true, (res) => {
								if (res.ok) {
									createEditor(dropdownMonth.contentWrapper, currentState, currentMonth.id, (resp) => {
										if (resp) {
											for (let k = 0; k < currentMonth.days.length; k++) {
												let currentDay = user.dailyLogs.filter((day) => day.id === currentMonth.days[k].dailyLog)[0];
												let dropdownDay = new DropdownBlock(`${weekDays[new Date(currentDay.date).getDay()]}, ${monthNames[new Date(currentDay.date).getMonth()]} ${new Date(currentDay.date).getUTCDate()}`, currentDay, 2);
												dropdownMonth.contentWrapper.appendChild(dropdownDay);
												createEditor(dropdownDay.contentWrapper, currentMonth, currentDay.id, () => {});
											}
											this.hide();
											dropdown.scrollIntoView({behavior: "smooth"});
										}
									});
								} else {
									console.log(errors);
								}
							})
						}
					});
				}
			});
		} else if (!start || !end) {
			alert("You must pick a start and end date!")
			this.loadingWheel.style.display = "none";
		} else {
			alert("You already have these months in your Future Log, please delete them before creating them again");
			this.loadingWheel.style.display = "none";
		}
	}

    createCollection() {
        let title = this.shadowRoot.getElementById("collection-title").value;
		localStorage.createCollection(title, currentState.id, [], [], [], currentState, true, (err, collection) => {
			if (err) {
                console.log(err);
            } else {
				let contentWrapper = document.getElementById("contentWrapper");
				contentWrapper.children[0].addCollection(collection);
				this.hide();
            }
		});
    }

    createTracker() {
        let title = this.shadowRoot.getElementById("tracker-title").value;
		if (this.isRecurring) {
			localStorage.readUser((error, user) => {
				if (error) {
					console.log(error);
				} else {
					let userArr = [];
					Array.prototype.push.apply(userArr, user.dailyLogs);
					Array.prototype.push.apply(userArr, user.monthlyLogs);
					Array.prototype.push.apply(userArr, user.futureLogs);
					Array.prototype.push.apply(userArr, user.collections);
					localStorage.createTracker(title, [], currentState.parent, userArr.filter(reference => reference.id === currentState.parent)[0], currentState, true, (err, tracker) => {
						if (err) {
							console.log(err);
						} else {
							let contentWrapper = document.getElementById("contentWrapper");
							contentWrapper.children[1].addCard(title, tracker);
							this.hide();
						}
					});
				}
			})
		} else {
			localStorage.createTracker(title, [], currentState.id, currentState, null, true, (err, tracker) => {
				if (err) {
					console.log(err);
				} else {
					let contentWrapper = document.getElementById("contentWrapper");
					contentWrapper.children[1].addCard(title, tracker);
					this.hide();
				}
			});
		}
    }
}

window.customElements.define("creation-menu", CreationMenu);
