import {fade, unfade} from "../transitions.js";
/* eslint-disable */
import {GeneralSettingsPanel} from "./generalSettingsPanel.jsx";
import {ThemePanel} from "./themePanel.jsx";
import { SignifierSettingsPanel } from "./signifierSettingsPanel.jsx";
/* eslint-enable */

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="settings.css" />
    <div class="overlay">
        <div class="menu">
            <div class="sidebar">
                <slot name="settings-tab"></slot>
            </div>

            <div class="content">
                <header>
                    <h1>Settings</h1>
                    <button class="close"><img id="dismiss" src="../../public/resources/xIcon.png" /></button>
                </header>

                <div class="options">
                    <slot name="settings-panel"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

/*
 * Settings Menu
 *
 *  To add a tab to the menu:
 *
 *  Add a <settings-tab> with the 'slot' and 'title' attributes set:
 *
 *      <settings-tab slot="settings-tab" title="YOUR TITLE">
 *
 *          Add an <img> with slot="icon"
 *              <img slot="icon" src="public/resources/YOUR_IMG.png">
 *      </settings-tab>
 *
 *  Add a <settings-panel> tag right after the <settings-tab>:
 *
 *      <settings-panel slot="settings-panel">
 *
 *          Inside this tag, add your web component. See themePanel.js for an example.
 *          <your-panel></your-panel>
 *      </settings-panel>
 */
const settingsTemplate = <template>
    <style>
		{`settings-tab {
			cursor: pointer;
		}`}
	</style>
    <settings-tab slot="settings-tab" title="Account Settings">
        <p slot="icon">Account</p>
    </settings-tab>
    <settings-panel slot="settings-panel">
        <general-settings-panel />
    </settings-panel>

    <settings-tab slot="settings-tab" title="Themes">
        <p slot="icon">Themes</p>
    </settings-tab>
    <settings-panel slot="settings-panel">
        <theme-panel />
    </settings-panel>

    <settings-tab slot="settings-tab" title="Signifiers">
        <p slot="icon">Signifiers</p>
    </settings-tab>
    <settings-panel slot="settings-panel">
        <signifier-settings-panel />
    </settings-panel>
</template>;

export class SettingsMenu extends HTMLElement {
    static get observedAttributes () {
        return ["open"];
    }

    constructor () {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector(".close").addEventListener("click", () => {
            this.hide();
        });

        this.tabSlot = this.shadowRoot.querySelector("slot[name=settings-tab]");
        this.panelSlot = this.shadowRoot.querySelector("slot[name=settings-panel]");

        this.changeTab = this.changeTab.bind(this);
        this.linkPanels = this.linkPanels.bind(this);

        this.tabSlot.addEventListener("slotchange", () => this.linkPanels);
        this.panelSlot.addEventListener("slotchange", () => this.linkPanels);

        this.headerTitle = this.shadowRoot.querySelector("header h1");
    }

    connectedCallback () {
        this.innerHTML = settingsTemplate.innerHTML;

        this.classList.toggle("open", false);
        this.setAttribute("aria-hidden", true);

        this.style.display = "none";
        this.removeAttribute("open");

        Promise.all([customElements.whenDefined("settings-tab"), customElements.whenDefined("settings-panel")]).
            then(() => this.linkPanels());

        this.addEventListener("click", (event) => {
            if (event.target.getAttribute("role") !== "tab") {
                return;
            }

            this.changeTab(event.target);
        })
    }

    tabs () {
        return this.querySelectorAll("settings-tab");
    }

    panels () {
        return this.querySelectorAll("settings-panel");
    }

    linkPanels () {
        let tabs = this.tabs();

        if (tabs.length === 0) {
            return;
        }

        let selectedTab = null;
        for (let tab of tabs) {
            let panel = tab.nextElementSibling;
            tab.setAttribute("aria-controls", panel.id);
            panel.setAttribute("aria-labelledby", tab.id);

            if (selectedTab === null && tab.selected) {
                selectedTab = tab;
            }
        }

        if (selectedTab === null) {
            selectedTab = tabs.item(0);
        }

        this.changeTab(selectedTab);
    }

    changeTab (selectedTab) {
        let tabs = Array.from(this.tabs());
        let panels = Array.from(this.panels());

        // Deselect all the tabs and hide all the panels
        tabs.forEach((tab) => {
            tab.selected = false
        });
        panels.forEach((panel) => {
            panel.hidden = true
        });

        let panelId = selectedTab.getAttribute("aria-controls");
        let selectedPanel = this.querySelector(`#${panelId}`);

        if (!selectedPanel) {
            // Oh no
            console.log("panel not found");
        }

        this.headerTitle.innerText = selectedTab.getAttribute("title");

        selectedTab.selected = true;
        selectedPanel.hidden = false;
        selectedTab.focus();
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[attr] = this.hasAttribute(attr);
        }
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

    toggle () {
        this.open = !this.open;
    }

    show () {
        this.open = true;
    }

    hide () {
        this.open = false;
    }
}

customElements.define("settings-menu", SettingsMenu);

// Used to generate an id
let tabId = 0;

let settingsTabTemplate = <template>
    <link type="text/css" rel="stylesheet" href="./settingsTab.css" />
    <slot name="icon"></slot>
</template>;

export class SettingsTab extends HTMLElement {
    static get observedAttributes () {
        return ["selected"];
    }

    constructor () {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(settingsTabTemplate.content.cloneNode(true));
    }

    connectedCallback () {
        this.setAttribute("role", "tab");
        if (!this.id) {
            this.id = `settings-tab-generated-${tabId}`;
            tabId += 1;
        }

        this.setAttribute("aria-selected", "false");
    }

    attributeChangedCallback () {
        const value = this.hasAttribute("selected");
        this.setAttribute("aria-selected", value);
    }

    set selected (val) {
        let value = Boolean(val);
        if (value) {
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    get selected () {
        return this.hasAttribute("selected");
    }
}
customElements.define("settings-tab", SettingsTab);

let panelId = 0;

export class SettingsPanel extends HTMLElement {

    connectedCallback () {
        this.setAttribute("role", "tabpanel");
        if (!this.id) {
            this.id = `settings-panel-generated-${panelId}`;
            panelId += 1;
        }
    }
}
customElements.define("settings-panel", SettingsPanel);
