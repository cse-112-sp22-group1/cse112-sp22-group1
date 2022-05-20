import {Log} from "./components/log.jsx";

let template = document.getElementById("template");
// let log = document.

let start = 1;
let end = 25;

let eventsMock = [
{
	id: "1",
	objectType: "JournalEvent",
	title: "test 1",
	parent: null,
	date: new Date(),
	signifier: null
}, {
	id: "2",
	objectType: "JournalEvent",
	title: "test 1",
	parent: null,
	date: new Date(),
	signifier: null
}, {
	id: "3",
	objectType: "JournalEvent",
	title: "test 1",
	parent: null,
	date: new Date(),
	signifier: null
}
];

let logMock = [];

for (let i = start; i <= end; i++) {
	let currentDate = new Date();
	currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
	let newLog = {
		id: i.toString(),
		objectType: "Log",
		date: currentDate,
		parent: null,
		content: [],
		trackers: []
	}
	if (i > 5) {
		newLog.content.push("test");
	}
	logMock.push(newLog);
}


template.appendChild(new Log());
