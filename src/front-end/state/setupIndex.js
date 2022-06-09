import * as localStorage from "../localStorage/userOperations.js";
import { adderDropdown, contentWrapper, creationMenu, header, search, setSearch} from "../index.js"
import { FileLocation } from "../components/fileLocation.jsx";
import { IndexDropdown } from "../components/indexDropdown.jsx";


/**
 * Sets up the index page with the futureLogs and collections of the user.
 */

export let currentShow = "futureLog";
let dropdownContainer = document.createElement("section");

export let displayToggle = null;

export function displayFutureLog () {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			if (user.index.futureLogs.length === 0) {
				creationMenu.setKind("futureLog");
				creationMenu.show();
			}
			if (user.index.futureLogs.length !== 0) {
				currentShow = "futureLog";
				displayToggle.innerHTML = "&#x25BC;   Future Logs";
				let futArr = [];
				for (let i = 0; i < user.index.futureLogs.length; i++) {
					futArr.push(user.futureLogs.filter((object) => object.id === user.index.futureLogs[i])[0]);
				}
				futArr = futArr.filter((element) => element.title.includes(search));
				console.log(futArr);
				for (let i = 0; i < futArr.length; i++) {
					console.log("inside for loop");
					if (futArr[i].objectType === "futureLog") {
						let dropdown = new IndexDropdown(futArr[i]);
						if (i === 0) {
							dropdown.toggleItems();
						}
						dropdownContainer.appendChild(dropdown)
					}
				}
			}
		}
	})
}

export function displayCollection () {
	localStorage.readUser((err, user) => {
		if (err) {
			console.log(err);
		} else {
			if (user.index.collections.length === 0) {
				creationMenu.setKind("collection");
				creationMenu.show();
			}
			if (user.index.collections.length !== 0) {
				currentShow = "collection";
				displayToggle.innerHTML = "&#9650;   Collections"
				let collArr = [];
				for (let i = 0; i < user.index.collections.length; i++) {
					collArr.push(user.collections.filter((object) => object.id === user.index.collections[i])[0]);
				}
				for (let i = 0; i < collArr.length; i++) {
					console.log("inside for loop");
					if (collArr[i].objectType === "collection") {
						let dropdown = new IndexDropdown(collArr[i]);
						if (i === 0) {
							dropdown.toggleItems();
						}
						dropdownContainer.appendChild(dropdown)
					}
				}
			}
		}
	});
}

export function setupIndex () {
	setSearch("");
	let child = header.file.lastElementChild;
	while (child) {
		header.file.removeChild(child);
		child = header.file.lastElementChild;
	}
	header.file.appendChild(new FileLocation("Index", "index", null, false));
	while (dropdownContainer.children.length > 0) {
		dropdownContainer.removeChild(dropdownContainer.children[0]);
	}
	header.loadSearchbar();
	displayToggle = document.createElement("button");
	displayToggle.id = "displayToggle";
	displayToggle.innerHTML = "&#x25BC;   Future Logs";
	dropdownContainer.id = "dropdownContainer";
	displayToggle.style.color = "var(--secondary-button-font-color)";
	contentWrapper.appendChild(dropdownContainer);
	contentWrapper.appendChild(displayToggle);
	if (currentShow === "futureLog") {
		displayFutureLog();
	} else {
		displayCollection();
	}
	let dropdownContent = [
		{
			title: "Future Logs",
			icon: "../public/resources/futureLog.png",
			listener: ()=>{
				if (currentShow !== "futureLog") {
					displayFutureLog();
				}
				adderDropdown.hide();
			}
		}, {
			title: "Collections",
			icon: "../public/resources/todaysLog.png",
			listener: ()=>{
				if (currentShow !== "collection") {
					displayCollection();
				}
				adderDropdown.hide();
			}
		}
	]
	displayToggle.onclick = ()=>{
		const TopOffset = displayToggle.getBoundingClientRect().bottom + 5 + document.body.scrollTop;
		const LeftOffset = displayToggle.getBoundingClientRect().left;
		adderDropdown.openUtilDropdown(TopOffset, LeftOffset, dropdownContent);
	}

	setTimeout(() => {
		let viewPort = document.getElementById("contentWrapper");
		console.log(viewPort.getClientRects());
		viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
	}, 10);
	header.title = "Index";

}


export function refreshIndex () {
	while (dropdownContainer.children.length > 0) {
		dropdownContainer.removeChild(dropdownContainer.children[0]);
	}
	if (currentShow === "futureLog") {
		displayFutureLog();
	} else {
		displayCollection();
	}

}
