import { api, origin } from "../../constants.js";
import { readUser } from "../userOperations.js";

/**
 * Finds and update the user in the local db from the online db.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateUserOnline (callback, pwd = null) {
	readUser((err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err);
		} else {
			try {
				user.pwd = pwd;
				return fetch(`${api}/user`, {
                    credentials: "include",
					headers: {
						"content-type": "application/json; charset=UTF-8",
						"Origin": origin
					},
					body: JSON.stringify(user),
					method: "PUT"
				}).then((data) => data.json()).then((res) => {
					if (res.error === "couldn't update") {
						console.log("retrying");
						fetch(`${api}/user`, {
							credentials: "include",
							headers: {
								"content-type": "application/json; charset=UTF-8",
								"Origin": origin
							},
							body: JSON.stringify(user),
							method: "PUT"
						}).then((data) => data.json()).then((response) => {
							if (response.error) {
								callback(response.error);
							} else {
								callback(null);
							}
						});
					} else {
						callback(null);
					}
				});
			} catch (error) {
				console.log("there is an error when fetching");
				console.log(error.text);
				callback(error);
			}
		}
	});
}
