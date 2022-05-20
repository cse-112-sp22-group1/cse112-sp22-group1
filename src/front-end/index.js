/**
 * Index module
 * @module index
 */
import { CreationMenu } from "./components/creationMenu.jsx";
import { InlineDropdown } from "./components/inlineDropdown.jsx";
import { NavBar } from "./components/navbar.jsx";
import { PageHeader } from "./components/header.jsx";
import { router, setUrl, setPageType } from "./state/router.js";
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
