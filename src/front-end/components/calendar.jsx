import { CalendarDay } from "./calendarDay.jsx";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let calendarTemplate = <template>
	<link type="text/css" rel="stylesheet" href="calendar.css" />
	<header>
		<h1 class="days">Sunday</h1>
		<h1 class="days">Monday</h1>
		<h1 class="days">Tuesday</h1>
		<h1 class="days">Wednesday</h1>
		<h1 class="days">Thursday</h1>
		<h1 class="days">Friday</h1>
		<h1 class="days">Saturday</h1>
		<h1 class="mobileDays">S</h1>
		<h1 class="mobileDays">M</h1>
		<h1 class="mobileDays">T</h1>
		<h1 class="mobileDays">W</h1>
		<h1 class="mobileDays">T</h1>
		<h1 class="mobileDays">F</h1>
		<h1 class="mobileDays">S</h1>
	</header>
	<section id="days"></section>
</template>;

export class Calendar extends HTMLElement {
	/**
	 * 
	 * @param {Date} month 
	 * @param {Number} start 
	 * @param {Number} end
	 * @param {Array<JournalEvent>} events 
	 * @param {Array<Log>} logs 
	 */
	constructor(month, start, end, events, logs) {
		super()
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(calendarTemplate.content.cloneNode(true));
		this.days = this.shadowRoot.getElementById("days");
		this.lastSelected = null;
		let firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
		let lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
		let totalLines = Math.ceil((lastDay.getDate() - firstDay.getDate() + firstDay.getDay()) / 7);
		let shouldMove = false;
		console.log(logs);
		let eventsMap = new Map();
		events.forEach(newEvent => {
			if (eventsMap.get(newEvent.date.getDate())) {
				let currentEvents = eventsMap.get(newEvent.date.getDate());
				currentEvents.push(newEvent.title);
				eventsMap.set(newEvent.date.getDate(), currentEvents);
			} else {
				eventsMap.set(newEvent.date.getDate(), [newEvent.title]);
			}
		});
		let shift = 0;
		for (let i = 0; i < totalLines; i++) {
			for (let k = 0; k < 7; k++) {
				if ((shouldMove && (i + 1 < totalLines) ||  (i + 1 === totalLines && k <= lastDay.getDay())) || (i === 0 && k === firstDay.getDay())) {
					let currentDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), k - shift + (i * 7) + 1);
					let inRange = (currentDate.getDate() >= start && currentDate.getDate() <= end);
					let currentLog = null;
					if (inRange) {
						let log = logs.filter(reference => new Date(reference.date).getDate() === currentDate.getDate());
						console.log(log);
						if (log.length === 1) {
							currentLog = log[0];
						} else {
							currentLog = {unlogged: true};
						}
					}
					let newBlock = new CalendarDay(this, currentDate, eventsMap.get(currentDate.getDate()), currentLog, inRange);
					this.days.appendChild(newBlock);
					shouldMove = true;
					continue;
				}
				shift += 1;
				this.days.appendChild(new CalendarDay(this, null, undefined, null, false));
			}
		}
	}

	/**
	 * Selects a new day in mobile view of calendar
	 * @param {CalendarDay} dayToSelect 
	 */
	newDaySelected = (dayToSelect) => {
		this.lastSelected.deselectDay();
		this.lastSelected = dayToSelect;
	}

}

window.customElements.define("log-calendar", Calendar);
