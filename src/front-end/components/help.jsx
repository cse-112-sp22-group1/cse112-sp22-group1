// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

import {fade, unfade} from "../transitions.js";
let helpTemplate = <template>
	<link type="text/css" rel="stylesheet" href="help.css" />
    <div class="overlay">
        <div class="menu">
            <main class="content">
                <header>
                    <h1>Help</h1>
                    <button id="close"><img id="dismiss" src="../../public/resources/xIcon.png" /></button>
                </header>

                <article id="helpInfo">
                    <h2>What is a Bullet Journal?</h2>
                    <p>
                        A bullet journal is a visual representation of your agenda, where you can keep track of and plan tasks, goals, and events.
                        These can be tracked using Future, Monthly, and Daily Logs, which are logs that are divided by time to fit the scale of your goals.
                        The bullet journal can also contain collections of notes where you can write anything you desire.
                        </p>
                    <h2>Keyboard Commands</h2>
                    <p>Type the shortcut in a block and press space to create the corresponding Element.</p>
                    <div id="tableContainer">
                        <table>
                            <tr>
                                <th>Element</th>
                                <th>Shortcut</th>
                                <th>Example</th>
                            </tr>
                            <tr>
                                <td>Bullet Point</td>
                                <td>-</td>
                                <td><img src="../public/resources/help-bulletpoint.png"></img></td>
                            </tr>
                            <tr>
                                <td>Event</td>
                                <td>*</td>
                                <td><img src="../public/resources/help-event.png"></img></td>
                            </tr>
                            <tr>
                                <td>Task</td>
                                <td>[]</td>
                                <td><img src="../public/resources/help-task.png"></img></td>
                            </tr>
                            <tr>
                                <td>h1</td>
                                <td>#</td>
                                <td><img src="../public/resources/help-header1.png"></img></td>
                            </tr>
                            <tr>
                                <td>h2</td>
                                <td>##</td>
                                <td><img src="../public/resources/help-header2.png"></img></td>
                            </tr>
                            <tr>
                                <td>h3</td>
                                <td>###</td>
                                <td><img src="../public/resources/help-header3.png"></img></td>
                            </tr>
                        </table>
                    </div>

                    <h2>Sections</h2>

                    <h3>Index</h3>
                    <p>
                        This is the overall view of every Future Log and Collection. <br/>
                        Press the "Index" button on the left sidebar to proceed to the Index menu. <br/>
                        Press the dropdown to toggle between Future Logs and Collections. <br/>
                    </p>

                    <h3>Future Log</h3>
                    <p>
                        Future Logs are a place to divide your future plans into monthly and daily logs. <br/>
                        These can be added from the Index menu with the "Add" button. <br/>
                    </p>

                    <h3>Monthly Log</h3>
                    <p>
                        Monthly Logs contain Daily Logs and are where you can plan your goals and events for the month. <br/>
                        These can be created within Future Logs with the "Add" button. <br/>
                    </p>

                    <h3>Daily Log</h3>
                    <p>
                        Daily Logs are the most basic logs, where you can log your desired notes, events, and tasks.<br/>
                        These can be created within Monthly Logs with the "Add" button. <br/>
                    </p>

                    <h3>Goals</h3>
                    <p>
                        Goals can be added to your Future, Monthly, and Daily Logs depending on the scope of your goals. <br/>
                        You can add them using the "Add" button on the top right of each log. <br/>
                        These goals can be viewed on the right side of logs. <br/>

                    </p>
                    <h3>Settings</h3>
                    <p>
                        In the settings menu, you can view your profile as well as change themes. <br/>
                        Click on the "My Account" button to proceed to settings.
                    </p>

                </article>

            </main>
        </div>
    </div>
</template>

export class HelpMenu extends HTMLElement {
	constructor() {
        super();
        this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(helpTemplate.content.cloneNode(true));

        this.close = this.shadowRoot.querySelector("#close");
	}

    connectedCallback() {
        this.classList.toggle("open", false);
        this.setAttribute("aria-hidden", true);

        this.style.display = "none";
        this.removeAttribute("open");
        this.close.addEventListener("click", () => {
            this.toggle();
        });
    }

    toggle() {
        this.open = !this.open;
    }

    get open () {
        return this.hasAttribute("open");
    }

    set open (isOpen) {
        this.classList.toggle("open", isOpen);
        this.setAttribute("aria-hidden", !isOpen);
        if (isOpen) {
            this.setAttribute("open", "true");
            unfade(this, () => {
                this.focus();
            });
        } else {
            fade(this, () => {
                this.removeAttribute("open");
            });
        }
    }
}

window.customElements.define("help-menu", HelpMenu);
