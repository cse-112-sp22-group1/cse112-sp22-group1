import * as localStorage from "../localStorage/userOperations.js";

// JSX Engine Import
/* eslint-disable */
/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from "../jsxEngine.js";
/* eslint-enable */

let template = <template>
	<link type="text/css" rel="stylesheet" href="generalSettingsPanel.css" />
	<label for="email">Email:</label>
	<input id="email" name="email" />
	<label for="passord">Change Password:</label>
	<span>
		<input id="password" name="password" placeholder="New Password" />
		<button id="passwordConfirm" >Confirm</button>
	</span>
    <button id="logout"> Logout </button>
	<button id="deleteUser"> Delete Account </button>
</template>

export class GeneralSettingsPanel extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.email = this.shadowRoot.getElementById("email");
		this.password = this.shadowRoot.getElementById("password");
		this.confirmPasswordChange = this.shadowRoot.getElementById("passwordConfirm");
		localStorage.readUser((err, user) => {
			if (err) {
				console.log(err);
			} else {
				this.email.value = user.email;
			}
		});
		this.logoutButton = this.shadowRoot.getElementById("logout");
		this.deleteButton = this.shadowRoot.getElementById("deleteUser");

    }

	connectedCallback () {
		this.email.onkeydown = (e) => {
			let key = e.key || e.keyCode;
			if (key === "Enter") {
				localStorage.readUser((err, user) => {
					if (err) {
						console.log(err);
					} else {
						user.email = this.email.value;
						localStorage.updateUser(user, true, (err) => {
							if (err) {
								console.log(err);
							}
						});
					}
				});
			}
		};

		this.email.onblur = () => {
			localStorage.readUser((err, user) => {
				if (err) {
					console.log(err);
				} else if (user.email !== this.email.value){
					user.email = this.email.value;
					localStorage.updateUser(user, true, (err) => {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		};

		this.confirmPasswordChange.onclick = () => {
			if (this.password.value) {
				localStorage.readUser((err, user) => {
					if (err) {
						console.log(err);
					} else {
						user.pwd = this.password.value;
						localStorage.updateUser(user, true, (err) => {
							if(err){
								console.log(err);
							}
						})
					}
				})
			}
		};

		this.logoutButton.onclick = () => {
			if (navigator.onLine) {
				localStorage.deleteDB();
				window.location.href = "/login";
			} else if (confirm("You're logging out while offline, all your local changes will be deleted if you continue!")) {
				localStorage.deleteDB();
				window.location.href = "/login";
			}
		}

		this.deleteButton.onclick = async () => {
			if (confirm("This action is irreversible, are you sure you want to delete this account?")) {
				await localStorage.deleteDB(true);
				window.location.href = "/login";
			}
		}
	}
}

customElements.define("general-settings-panel", GeneralSettingsPanel);
