import { createCollection, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let createCollectionTests = () => {
	describe(" Tests for creating Collections", () => {
		test("Tests Create Collections in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createCollection("Test collection", user.monthlyLogs[0].id, [], [], [], user.monthlyLogs[0], true, async (err, collection) => {
					expect(err === null).toBe(true);
					expect(collection.objectType).toBe("collection");
					expect(collection.parent).toBe(user.monthlyLogs[0].id);
					expect(collection.title).toBe("Test collection");
					expect(collection.content.length).toBe(0);
					expect(collection.collections.length).toBe(0);
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].collections.length).toBe(1);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].collections[0]).toBe(collection.id);
						expect(doc.collections.length).toBe(1);
						expect(doc.collections[0].id).toBe(collection.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};