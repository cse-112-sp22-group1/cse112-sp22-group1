/**
 * Finds and sends the user back in the callback.
 * @memberof readFunctions
 * @param {database} db The local pouch database.
 * @param {singleParameterCallback} callback Sends either the user or an error if there is one to the callback.
 */
 export function readUserPouch (db, callback) {
	db.get("0000", (err, user) => {
		/* istanbul ignore next */
		if (err) {
			/* istanbul ignore next */
			callback(err, null);
		} else {
			callback(null, user);
		}
	});
}
