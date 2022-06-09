import * as localStorage from "../localStorage/userOperations.js";
const themeColors = {
    minimalLight: {
        "--body-background": "#FFFFFF",
        "--sidebar-background": "#FCFCFCFF",
        "--normal-font-color": "#000000",
        "--highlighted-font-color": "#FFFFFF",

        "--primary-button-color": "rgba(51, 181, 229, 1)",
        "--secondary-button-color": "rgba(255, 187, 51, 1)",
        "--danger-button-color": "rgba(249, 49, 84, 1)",
        
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(255, 255, 255, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(252, 252, 252, 0.8)",
        "--card-background-dim": "rgba(236, 236, 236)",
        "--card-background-dimmer": "rgba(218, 218, 218)",
        "--card-font-color": "rgb(0, 0, 0)",

        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--signifiers-background": "rgba(236, 236, 236)",
        "--itemcard-font-filter": "",
        "--icon-filter": "",
        "--text-filter": ""
    },

    coolDark: {
        "--body-background": "#1C1C1CFF",
        "--sidebar-background": "rgba(42, 42, 42, 1)",
        "--normal-font-color": "#FFFFFFFF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(0, 153, 204, 1)",
        "--secondary-button-color": "rgba(255, 136, 0, 1)",

        "--danger-button-color": "rgba(200, 0, 0, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(255, 255, 255, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(42, 42, 42, 1)",
        "--card-background-dim": "rgb(36, 36, 36)",
        
        "--card-background-dimmer": "rgb(32, 32, 32)",
        "--divider-color": "rgba(255, 255, 255, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(96, 96, 96, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgba(255, 255, 255)",
        "--card-font-color": "rgb(255, 255, 255)",

        "--signifiers-background": "rgb(36, 36, 36)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
        "--icon-filter": "invert()"
    },

    theLightSide: {
        "--body-background": "#F3F3F3FF",
        "--sidebar-background": "#F3F3F3FF",
        "--normal-font-color": "#000000FF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(46, 155, 255, 1)",
        "--secondary-button-color": "rgba(10, 184, 59, 1)",

        "--danger-button-color": "rgba(249, 49, 84, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(255, 255, 255, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(248, 248, 248, 1)",
        "--card-background-dim": "rgba(232, 232, 232, 1)",
        
        "--card-background-dimmer": "rgba(216, 216, 216, 1)",
        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(0, 0, 0, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgb(0, 0, 0)",
        "--card-font-color": "rgb(0, 0, 0)",

        "--signifiers-background": "rgba(232, 232, 232, 1)",
        "--itemcard-font-filter": "",
        "--text-filter": "",
        "--icon-filter": ""
    },

    theDarkSide: {
        "--body-background": "#262626FF",
        "--sidebar-background": "#262626FF",
        "--normal-font-color": "#FFFFFFFF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(200, 0, 0, 1)",
        "--secondary-button-color": "rgba(190, 190, 190, 1)",

        "--danger-button-color": "rgba(200, 0, 0, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(0, 0, 0, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(34, 34, 34, 1)",
        "--card-background-dim": "rgb(28, 28, 28)",
        
        "--card-background-dimmer": "rgb(24, 24, 24)",
        "--divider-color": "rgba(255, 255, 255, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(96, 96, 96, 1)",
        "--calendar-today-font-color": "rgb(255, 255, 255)",
        "--sidebar-font-color": "rgb(255, 255, 255)",
        "--card-font-color": "rgb(255, 255, 255)",

        "--signifiers-background": "rgb(28, 28, 28)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
        "--icon-filter": "invert()"
    },

    snazzyLight: {
        "--body-background": "#F4F4F8FF",
        "--sidebar-background": "#FE4A49FF",
        "--normal-font-color": "#000000FF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(42, 183, 202, 1)",
        "--secondary-button-color": "rgba(254, 215, 102, 1)",

        "--danger-button-color": "rgba(249, 49, 84, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(0, 0, 0, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(230, 230, 234, 1)",
        "--card-background-dim": "rgba(216, 216, 218, 1)",
        
        "--card-background-dimmer": "rgba(200, 200, 202, 1)",
        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(0, 0, 0, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgb(0, 0, 0)",
        "--card-font-color": "rgb(0, 0, 0)",

        "--signifiers-background": "rgba(216, 216, 218, 1)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
        "--icon-filter": ""
    },

    highContrast: {
        "--body-background": "#1C1C1CFF",
        "--sidebar-background": "#00FF00FF",
        "--normal-font-color": "#FFFFFFFF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(255, 0, 0, 1)",
        "--secondary-button-color": "rgba(255, 0, 255, 1)",

        "--danger-button-color": "rgba(255, 0, 0, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(255, 255, 255, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(255, 255, 0, 1)",
        "--card-background-dim": "rgba(239, 239, 0, 1)",
        
        "--card-background-dimmer": "rgba(223, 223, 202, 1)",
        "--divider-color": "rgba(255, 255, 255, 1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.3)",

        "--calendar-font-color": "rgba(0, 0, 0, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgb(0, 0, 0)",
        "--card-font-color": "rgb(0, 0, 0)",

        "--signifiers-background": "rgba(239, 239, 0, 1)",
        "--itemcard-font-filter": "invert()",
        "--text-filter": "",
        "--icon-filter": "invert()"
    },

    comfyPanda: {
        "--body-background": "#FCEBDEFF",
        "--sidebar-background": "#FE9C8FFF",
        "--normal-font-color": "#000000FF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(255, 121, 103, 1)",
        "--secondary-button-color": "rgba(210, 178, 154, 1)",

        "--danger-button-color": "rgba(249, 49, 84, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(255, 255, 255, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(250, 215, 188, 1)",
        "--card-background-dim": "rgba(234, 199, 172, 1)",
        
        "--card-background-dimmer": "rgba(218, 183, 156, 1)",
        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(0, 0, 0, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgb(0, 0, 0)",
        "--card-font-color": "rgb(0, 0, 0)",

        "--signifiers-background": "rgba(234, 199, 172, 1)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
        "--icon-filter": ""
    },

    nightOwl: {
        "--body-background": "#112240FF",
        "--sidebar-background": "#233554FF",
        "--normal-font-color": "#FFFFFFFF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(73, 86, 112, 1)",
        "--secondary-button-color": "rgba(204, 214, 246, 1)",

        "--danger-button-color": "rgba(169, 0, 0, 1)",
        "--primary-button-font-color": "rgba(255, 255, 255, 1)",
        "--secondary-button-font-color": "rgba(0, 0, 0, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(35, 53, 84, 1)",
        "--card-background-dim": "rgba(28, 45, 76, 1)",
        
        "--card-background-dimmer": "rgba(20, 37, 68, 1)",
        "--divider-color": "rgba(255, 255, 255, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(96, 96, 96, 1)",
        "--calendar-today-font-color": "rgba(255, 255, 255, 1)",
        "--sidebar-font-color": "rgb(255, 255, 255)",
        "--card-font-color": "rgb(255, 255, 255)",

        "--signifiers-background": "rgba(28, 45, 76, 1)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
        "--icon-filter": "invert()"
    },

    sunnyBeach: {
        "--body-background": "#FAF1EAFF",
        "--sidebar-background": "#F9D199FF",
        "--normal-font-color": "#000000FF",

        "--highlighted-font-color": "#000000FF",
        "--primary-button-color": "rgba(187, 219, 247, 1)",
        "--secondary-button-color": "rgba(249, 209, 153, 1)",

        "--danger-button-color": "rgba(255, 71, 71, 1)",
        "--primary-button-font-color": "rgba(0, 0, 0, 1)",
        "--secondary-button-font-color": "rgba(0, 0, 0, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(100, 171, 227, 1)",
        "--card-background-dim": "rgba(84, 155, 211, 1)",
        
        "--card-background-dimmer": "rgba(66, 139, 195, 1)",
        "--divider-color": "rgba(0, 0, 0, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(255, 255, 255, 1)",
        "--calendar-today-font-color": "rgba(0, 0, 0, 1)",
        "--sidebar-font-color": "rgb(255, 255, 255)",
        "--card-font-color": "rgb(255, 255, 255)",

        "--signifiers-background": "rgba(230, 221, 214, 1)",
        "--itemcard-font-filter": "invert()",
        "--text-filter": "",
        "--icon-filter": ""
    },

    darkForest: {
        "--body-background": "#162C1BFF",
        "--sidebar-background": "#223A27FF",
        "--normal-font-color": "#FFFFFFFF",

        "--highlighted-font-color": "#FFFFFFFF",
        "--primary-button-color": "rgba(145, 88, 63, 1)",
        "--secondary-button-color": "rgba(246, 227, 204, 1)",

        "--danger-button-color": "rgba(169, 0, 0, 1)",
        "--primary-button-font-color": "rgba(0, 0, 0, 1)",
        "--secondary-button-font-color": "rgba(0, 0, 0, 1)",

        "--card-shadow": "rgba(0, 0, 0, 0.25)",
        "--card-background": "rgba(34, 58, 39, 1)",
        "--card-background-dim": "rgba(26, 50, 31, 1)",
        
        "--card-background-dimmer": "rgba(22, 46, 27, 1)",
        "--divider-color": "rgba(255, 255, 255, 0.1)",
        "--lighter-divider-color": "rgba(140, 140, 140, 0.1)",

        "--calendar-font-color": "rgba(255, 255, 255, 1)",
        "--calendar-today-font-color": "rgba(0, 0, 0, 1)",
        "--sidebar-font-color": "rgb(255, 255, 255)",
        "--card-font-color": "rgb(255, 255, 255)",

        "--signifiers-background": "rgba(26, 50, 31, 1)",
        "--itemcard-font-filter": "",
        "--text-filter": "invert()",
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
        <label>Minimal Light <br />
            <input type="radio" name="themeradio" id="minimalLight" /><img class="themeImg" src="../../public/resources/minimalLight.png" />
        </label>
        <label>Cool Dark <br />
            <input type="radio" name="themeradio" id="coolDark" /><img class="themeImg" src="../../public/resources/coolDark.png" />
        </label>
        <label>The Light Side <br />
            <input type="radio" name="themeradio" id="theLightSide" /><img class="themeImg" src="../../public/resources/theLightSide.png" />
        </label>
        <label>The Dark Side <br />
            <input type="radio" name="themeradio" id="theDarkSide" /><img class="themeImg" src="../../public/resources/theDarkSide.png" />
        </label>
        <label>Snazzy Light <br />
            <input type="radio" name="themeradio" id="snazzyLight" /><img class="themeImg" src="../../public/resources/snazzyLight.png" />
        </label>
        <label>High Contrast <br />
            <input type="radio" name="themeradio" id="highContrast" /><img class="themeImg" src="../../public/resources/highContrast.png" />
        </label>
        <label>Comfy Panda <br />
            <input type="radio" name="themeradio" id="comfyPanda" /><img class="themeImg" src="../../public/resources/comfyPanda.png" />
        </label>
        <label>Night Owl <br />
            <input type="radio" name="themeradio" id="nightOwl" /><img class="themeImg" src="../../public/resources/nightOwl.png" />
        </label>
        <label>Sunny Beach <br />
            <input type="radio" name="themeradio" id="sunnyBeach" /><img class="themeImg" src="../../public/resources/sunnyBeach.png" />
        </label>
        <label>Dark Forest <br />
            <input type="radio" name="themeradio" id="darkForest" /><img class="themeImg" src="../../public/resources/darkForest.png" />
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
