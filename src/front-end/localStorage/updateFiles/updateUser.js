import { api, origin } from "../../constants.js";

/**
 * Finds and update the user in the local db from the online db.
 * @memberof updateFunctions
 * @param {database} db The local pouch database.
 * @param {singleParameterCallback} callback Sends an error if there is one to the callback.
 */
 export function updateUserOnline (db, callback) {
	console.log("getting user");
	db.get("0000", (err, doc) => {
		if (err) {
			console.log("the user is broken in pouch");
			callback(err);
		} else {
			try {
				console.log("this is the user now", doc);
				console.log("about to fetch");
				fetch(`${api}/user`, {
                    credentials: "include",
					headers: {
						"content-type": "application/json; charset=UTF-8",
						"Origin": origin
					},
					body: JSON.stringify(doc),
					method: "PUT"
				}).then((data) => data.json()).then((userData) => {
					console.log("fetch succesful");
					console.log(userData);
				});
			} catch (error) {
				console.log("there is an error when fetching");
				console.log(error.text);
			}
		}
	})
}
