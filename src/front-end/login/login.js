// Removed readUser and deleteDB from import because eslint complained they're never used
import { createUser, db, getUser, loginUser, readUser } from "../localStorage/userOperations.js";
import { createUserPouch } from "../localStorage/createFiles/createUser.js";

// CSS Imports
/* eslint-disable */
import "./login.css";
/* eslint-enable */

const form = document.getElementById("login-form");
const email = document.getElementById("input-email");
const password = document.getElementById("input-password");
const logIn = document.getElementById("btn-login");
const createAccount = document.getElementById("btn-create");

/**
 * Displays an error message to the user.
 *
 * @param {String} err The error string to display.
 */
function displayError (err) {
	const errorContainer = document.getElementById("error-msg");
	errorContainer.innerText = err;
}

readUser((err) => {
	if (!err) {
		window.location.href = origin;
	}
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
});

logIn.addEventListener("click", (e) => {
	e.preventDefault();
	if (email.value === "") {
		displayError("You need to fill in the email field!");
	} else if (password.value === "") {
		displayError("You need to fill in the password field!");
	} else {
        loginUser(email.value, password.value, (err) => {
            if (err.error) {
                displayError(err.error);
                return;
            }
            getUser((user) => {
                if (user.error !== undefined) {
                    displayError(user.error);
                } else if (user.email === undefined) {
                    displayError("Wrong username or password");
                } else {
                    user.pwd = password.value;
                    createUserPouch(db, user, (userData) => {
                        console.log(userData);
                        window.location.href = "/";
                    });
                }
            });
        });
	}
});

createAccount.addEventListener("click", (e) => {
	e.preventDefault();
	if (email.value === "") {
		displayError("You need to fill in the email field");
	} else if (password.value === "") {
		displayError("You need to fill in the password field");
	} else {
		createUser(email.value, password.value, (user) => {
			if (user.error !== undefined) {
				console.log(user.error)
				displayError(user.error);
			} else if (user.email === undefined) {
				displayError("Wrong username or password");
			} else {
				createUserPouch(db, user, () => {
					loginUser(email.value, password.value, (err) => {
						if (err.error) {
							displayError(err.error);
						} else {
							window.location.href = "/";
						}
					});
				});
			}
		});
	}
});
