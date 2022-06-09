
import * as localStorage from "../localStorage/userOperations.js";
import { adderDropdown, navbar, setSearch } from "../index.js";
import { currentState } from "../state/stateManager.js";
import { refreshDailyLog } from "../state/setupDailyLog.js";
import { refreshMonthlyLog } from "../state/setupMonthlyLog.js";
import { refreshFutureLog } from "../state/setupFutureLog.js";
import { refreshIndex } from "../state/setupIndex.js";
import { FileLocation } from "../components/fileLocation.jsx"

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="header.css" />
	<div id="file"></div>
	<div id="container">
		<div id="menuToggle">
			<input type="checkbox" />
			<span></span>
			<span></span>
			<span></span>
		</div>
		<section id="header" class="header">
			<div>
				<h1 id="title_page">Template Page Title</h1>
				<button class="edit-button">Edit</button>
			</div>
			<button class="new-button">New</button>
			
		</section>
	</div>
</template>

let searchBar = <aside class="search_bar" id="searchBar">
	<input class="search_input" type="text" placeholder="Search" />
	<img class="search_icon"src="../public/resources/search_icon.png" />
</aside>

let searchExpand = <aside id="searchExpand" class="search-box d-flex justify-center align-center">
	<input class="search-input" type="text" placeholder="Search..."/>
	<a class="p-20 cursor-pointer"><img class="search-btn max-h-20" src="../public/resources/search_icon.png" alt="search" /></a>
</aside>

/**
 * Class that creates Page Header
 */
export class PageHeader extends HTMLElement {

	/**
	 * PageHeader constructor
	 */
	constructor () {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.headerTitle = this.shadowRoot.getElementById("title_page");

		this.file = this.shadowRoot.getElementById("file");

		this.futureLogButton = this.shadowRoot.querySelector(".new-button");
		this.editButton = this.shadowRoot.querySelector(".edit-button");
		this.titleHeader = this.shadowRoot.querySelector(".header");
		this.imgbuttons = this.shadowRoot.querySelectorAll(".imgbutton");
		this.menuToggle = this.shadowRoot.querySelector("#menuToggle input");

	}

	/**
	 * When header is created, the callback will listen to when the menu is toggled
	 */
	connectedCallback () {
		this.futureLogButton.addEventListener("click", () => {
			const headerTopOffset = this.futureLogButton.getBoundingClientRect().top + this.futureLogButton.getBoundingClientRect().height + 16;
			const headerLeftOffset = this.futureLogButton.getBoundingClientRect().left - this.futureLogButton.getBoundingClientRect().width - 80;

			/* DropDown window appears to be 206 px, not sure why previous value was 210 */
			adderDropdown.openCreationDropdown(headerTopOffset, headerLeftOffset);
		});

		this.editButton.addEventListener("click", ()=>{
			const headerTopOffset = this.editButton.getBoundingClientRect().top + document.body.scrollTop - this.editButton.getBoundingClientRect().width;
			const headerLeftOffset = this.editButton.getBoundingClientRect().left + this.editButton.getBoundingClientRect().width + 10;
			adderDropdown.openEditDropdown(headerTopOffset, headerLeftOffset);
		});

		this.menuToggle.addEventListener("change", () => {
			navbar.toggle();
		});

		this.headerTitle.onblur = () => {
			if (this.headerTitle.contentEditable) {
				currentState.title = this.headerTitle.innerText;
				if (currentState.objectType === "futureLog") {
					localStorage.updateFutureLog(currentState, true, (err) => {
						if (err) {
							console.log(err);
						}
					});
				} else {
					localStorage.updateCollection(currentState, null, null, true, (err) => {
						if (err) {
							console.log(err);
						}
					});
				}
			}
		};
	}

	loadSearchbar () {
		if (currentState.objectType === "index") {
			if (this.shadowRoot.getElementById("searchBar")) {
				this.shadowRoot.getElementById("container").removeChild(searchBar);
			}
			this.shadowRoot.getElementById("header").removeChild(this.futureLogButton);
			this.shadowRoot.getElementById("header").appendChild(searchExpand);
			this.futureLogButton.style.marginLeft = "10px";
			this.shadowRoot.getElementById("header").appendChild(this.futureLogButton);
			this.shadowRoot.getElementById("header").style.width = "100%";
			document.querySelector("main").style.width = "calc(100% - 375px)";
			this.searchBar = searchExpand;
		} else {
			if (this.shadowRoot.getElementById("searchExpand")) {
				this.shadowRoot.getElementById("header").removeChild(searchExpand);
			}
			this.futureLogButton.style.marginLeft = "auto";
			this.shadowRoot.getElementById("header").insertAdjacentElement("afterend", searchBar);
			this.shadowRoot.getElementById("header").style.width = "63.7%";
			document.querySelector("main").style.width = "calc(100% - 325px)";
			this.searchBar = searchBar;
			this.searchButton = this.shadowRoot.querySelector(".search_icon");
		}

		if (this.searchButton) {
			this.searchButton.addEventListener("click", ()=> {
				setSearch(this.searchBar.firstChild.value);
				
				if(currentState.objectType == "dailyLog") {
					refreshDailyLog();
				} else if (currentState.objectType == "monthlyLog") {
					refreshMonthlyLog();
				} else if (currentState.objectType == "futureLog") {
					refreshFutureLog();
				}
			});
		}

		this.searchBar.firstChild.addEventListener("keypress", (e) => {
			if(e.key == "Enter"){
				setSearch(this.searchBar.firstChild.value);
            	if(currentState.objectType == "dailyLog") {
                	refreshDailyLog();
            	} else if (currentState.objectType == "monthlyLog") {
					refreshMonthlyLog();
				} else if (currentState.objectType == "futureLog") {
					refreshFutureLog();
				} else if (currentState.objectType == "index") {
					refreshIndex();
				}
			}
        });
	}


		
	/**
	 * Makes header content editable
	 */
	makeEditable () {
		this.headerTitle.contentEditable = true;
	}

	/**
	 * Makes header content uneditable
	 */
	makeUneditable () {
		this.headerTitle.contentEditable = false;
	}

	set title (title) {
		this.shadowRoot.getElementById("title_page").innerHTML = title;
	}

	/**
	 * Gets the header's current title
	 */
	get title () {
		return this.headerTitle.innerText;
	}

	/**
	 * Creates a futureLog
	 */
	createFutureLog () {
		localStorage.createFutureLog(new Date(2021, 5, 22), new Date(2021, 8, 23), [], [], [], true, (err, futureLog) => {
			if (err) {
				console.log(err);
			} else {
				localStorage.readUser((error, res) => {
					if (error) {
						console.log(error);
					} else if (res.ok) {
						console.log(futureLog);
					}
				})
			}
		});
	}
}

window.customElements.define("page-header", PageHeader);
