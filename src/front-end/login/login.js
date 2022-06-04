// Removed readUser and deleteDB from import because eslint complained they're never used
import { createUser, db, getUser, loginUser, readUser } from "../localStorage/userOperations.js";
import { createUserPouch } from "../localStorage/createFiles/createUser.js";

// CSS Imports
/* eslint-disable */
import "./login.css";
/* eslint-enable */

let email = document.getElementById("email-field");
let password = document.getElementById("password-field");
let logIn = document.getElementById("login-form-submit");
let createAccount = document.getElementById("login-form-create");

readUser((err, user) => {
	if (err) {
		console.log(user);
	} else {
		window.location.href = origin;
	}
});

document.onsubmit = (e) => {
	console.log(e);
	e.preventDefault();
}

logIn.onclick = (e) => {
	e.preventDefault();
	if (email.value === "") {
		alert("You need to fill in the email field");
	} else if (password.value === "") {
		alert("You need to fill in the password field");
	} else {
        loginUser(email.value, password.value, (err) => {
            if (err.error) {
                alert(err.error);
                return;
            }
            getUser((user) => {
                if (user.error !== undefined) {
                    alert(user.error);
                } else if (user.email === undefined) {
                    alert("Wrong username or password");
                } else {
                    user.pwd = password.value;
                    console.log(user.index);
                    createUserPouch(db, user, (userData) => {
                        console.log(userData);
                        window.location.href = "/";
                    });
                }
            });
        });
	}
};

createAccount.onclick = (e) => {
	e.preventDefault();
	if (email.value === "") {
		alert("You need to fill in the email field");
	} else if (password.value === "") {
		alert("You need to fill in the password field");
	} else {
		createUser(email.value, password.value, (user) => {
			if (user.error !== undefined) {
				alert(user.error);
			} else if (user.email === undefined) {
				alert("Wrong username or password");
			} else {
				createUserPouch(db, user, () => {
					loginUser(email.value, password.value, (err) => {
						if (err.error) {
							alert(err.error);
						} else {
							window.location.href = "/";
						}
					});
				});
			}
		});
	}
};
