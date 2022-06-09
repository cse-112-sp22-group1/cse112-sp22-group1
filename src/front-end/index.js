/**
 * Index module
 * @module index
 */
import { CreationMenu } from "./components/creationMenu.jsx";
import { InlineDropdown } from "./components/inlineDropdown.jsx";
import { NavBar } from "./components/navbar.jsx";
import { PageHeader } from "./components/header.jsx";

// CSS imports
/* eslint-disable */
import "./index.css";
/* eslint-enable */

document.querySelector("body").style.display = "none";

export let search = "";

export function setSearch (value) {
    search = value;
}

export function getSearch () {
    return search;
}

/**
 * The index page navbar
 */
export let navbar = new NavBar();

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

export let contentWrapper = document.getElementById("contentWrapper");
document.getElementById("adderDropdown").appendChild(adderDropdown);
document.getElementById("creationMenu").appendChild(creationMenu);
document.getElementById("topbar").appendChild(header);
document.getElementById("sidebar").appendChild(navbar);

window.onresize = () => {
	let viewPort = document.getElementById("contentWrapper");
	console.log(viewPort.getClientRects());
	viewPort.style.height = `${window.innerHeight - viewPort.getClientRects()[0].y}px`;
};

