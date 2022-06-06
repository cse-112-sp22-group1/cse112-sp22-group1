import * as localStorage from "../localStorage/userOperations.js";
const themeColors = {
    darkmode: {
        "--border-color": "#4d4d4d",
        "--content-background-color": "#2e3030",
        "--content-foreground-color": "#D4D4D4",

        "--tracker-background-color": "#1e2020",
        "--tracker-foreground-color": "#d4d4d4",
        "--tracker-border-color": "#404040",

        "--navbar-background-color": "#1e2020",
        "--navbar-foreground-color": "#d4d4d4",

        "--dropdown-background-color": "#1e2020",
        "--dropdown-foreground-color": "#d4d4d4",
        "--dropdown-hover-color": "#474a4a",

        "--icon-filter": "invert()"
    },

    lightmode: {
        "--body-background": "#FFFFFF",
        "--sidebar-background": "#FCFCFCFF",
        "--normal-font-color": "#000000",
        "--highlighted-font-color": "#FFFFFF",
        "--dim-font-color": "#C1C1C1",
        "--icon-filter": "",
        "--highlighted-icon-filter": "invert()",

        "--primary-button-color": "rgba(51, 181, 229, 1)",
        "--secondary-button-color": "rgba(255, 187, 51, 1)",
        "--danger-button-color": "rgba(249, 49, 84, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(252, 252, 252, 0.8)",
        "--card-background-dim": "rgba(236, 236, 236)",
        "--card-background-dimmer": "rgba(218, 218, 218)",

        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--tracker-background-color": "#2B2D42",
        "--tracker-foreground-color": "#FFFFFF",
        "--tracker-border-color": "#48486f",

        "--navbar-foreground-color": "#FFFFFF",

        "--dropdown-background-color": "#f7f2ec",
        "--dropdown-foreground-color": "#000000",
        "--dropdown-hover-color": "#dfdcd8"
    },

    highcontrast: {
        "--border-color": "#F2F2F2",
        "--content-background-color": "#000000",
        "--content-foreground-color": "#FFFFFF",

        "--tracker-background-color": "#0000FF",
        "--tracker-foreground-color": "#FFFFFF",
        "--tracker-border-color": "#FFFFFF",

        "--navbar-background-color": "#008F00",
        "--navbar-foreground-color": "#FFFFFF",

        "--dropdown-background-color": "#008F00",
        "--dropdown-foreground-color": "#ffffff",
        "--dropdown-hover-color": "#FF00FF",

        "--icon-filter": "invert()"
    },

    theme4: {
        "--border-color": "#F2F2F2",
        "--content-background-color": "#FFFFFF",
        "--content-foreground-color": "#000000",

        "--tracker-background-color": "#026670",
        "--tracker-foreground-color": "#FFFFFF",
        "--tracker-border-color": "#1d7d86",

        "--navbar-background-color": "#FCE181",
        "--navbar-foreground-color": "#fed442",

        "--dropdown-background-color": "#FFFFFF",
        "--dropdown-foreground-color": "#000000",
        "--dropdown-hover-color": "#efeded",

        "--icon-filter": ""
    },

    theme5: {
        "--border-color": "#8E8D8A",
        "--content-background-color": "#EAE7DC",
        "--content-foreground-color": "#000000",

        "--tracker-background-color": "#48131A",
        "--tracker-foreground-color": "#FFFFFF",
        "--tracker-border-color": "#6F474E",

        "--navbar-background-color": "#D8C3A5",
        "--navbar-foreground-color": "#000000",

        "--dropdown-background-color": "#D8C3A5",
        "--dropdown-foreground-color": "#000000",
        "--dropdown-hover-color": "#c8ae89",

        "--icon-filter": ""
    },

    theme6: {
        "--border-color": "#34375c",
        "--content-background-color": "#1A1A3D",
        "--content-foreground-color": "#E3E3E8",

        "--tracker-background-color": "#25274D",
        "--tracker-foreground-color": "#E3E3E8",
        "--tracker-border-color": "#464866",

        "--navbar-background-color": "#25274D",
        "--navbar-foreground-color": "#000000",

        "--content-placeholder-color": "#505b84",

        "--dropdown-background-color": "#D8C3A5",
        "--dropdown-foreground-color": "#000000",
        "--dropdown-hover-color": "#c8ae89",

        "--icon-filter": "invert()"
    }
}

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="themePanel.css" />
    <form id="theme">
        <label>Cool Dark <br />
            <input type="radio" name="themeradio" id="darkmode" /><img class="themeImg" src="../../public/resources/coolDark.png" />
        </label>
        <label>Minimal Light <br />
            <input type="radio" name="themeradio" id="lightmode" /><img class="themeImg" src="../../public/resources/minimalLight.png" />
        </label>
        <label>High Contrast <br />
            <input type="radio" name="themeradio" id="highcontrast" /><img class="themeImg" src="../../public/resources/highContrast.png" />
        </label>
        <label>Snazzy Light <br />
            <input type="radio" name="themeradio" id="theme4" /><img class="themeImg" src="../../public/resources/snazzyLight.png" />
        </label>
        <label>Classy Light <br />
            <input type="radio" name="themeradio" id="theme5" /><img class="themeImg" src="../../public/resources/classyLight.png" />
        </label>
        <label>Night Owl <br />
            <input type="radio" name="themeradio" id="theme6" /><img class="themeImg" src="../../public/resources/nightOwl.png" />
        </label>
    </form>
</template>

export class ThemePanel extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.themeRadios = this.shadowRoot.querySelectorAll("input[type=radio]");
    }

	connectedCallback () {
		for (let themeRadio of this.themeRadios) {
            themeRadio.addEventListener("change", () => {
				localStorage.updateTheme(themeRadio.id, true, (err) => {
					console.log("here");
					if (err) {
						console.log(err);
					} else {
						console.log("here");
						this.updateTheme(themeRadio.id);
					}
				});

			});
        }
		localStorage.readUser((err, user) => {
			if (err) {
				console.log(err);
			} else {
				let pickedTheme = this.shadowRoot.getElementById(user.theme);
				pickedTheme.toggleAttribute("checked", true);
				this.updateTheme(user.theme);
			}
		});
	}

    updateTheme (theme) {
        let root = document.documentElement;
		for (let key in themeColors[theme]) {
			if (key !== null) {
				root.style.setProperty(key, themeColors[theme][key]);
			}
		}
    }
}

customElements.define("theme-panel", ThemePanel);
