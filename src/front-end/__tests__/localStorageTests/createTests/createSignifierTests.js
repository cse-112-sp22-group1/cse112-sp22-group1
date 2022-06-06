import { createSignifier, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let createSignifierTests = () => {
	describe(" Tests for creating signifiers", () => {
		test("Tests Create signifiers in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createSignifier("Test Signifier", "&#128579;", true, async (err, signifier) => {
					expect(err === null).toBe(true);
					expect(signifier.objectType).toBe("signifier");
					expect(signifier.meaning).toBe("Test Signifier");
					expect(signifier.symbol).toBe("&#128579;");
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs.length).toBe(4);
						expect(doc.signifiers.length).toBe(2);
						expect(doc.signifiers[1].id).toBe(signifier.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};