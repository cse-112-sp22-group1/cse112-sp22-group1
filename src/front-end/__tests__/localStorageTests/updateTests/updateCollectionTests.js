import { updateCollection, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateCollectionTests = () => {
    describe("Tests for updating Collections", () => {
        test("Tests update collections in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalCollection = user.collections[0];
                let originalCollectionID = originalCollection.id;
                let originalParent = (user.monthlyLogs.filter(log => log.id === originalCollection.parent))[0];
                let originalParentID = originalParent.id;
                user.collections[0].parent = user.monthlyLogs[0].id;
                user.collections[0].title = "Now Updated Test Collection";
                let newParentID = user.monthlyLogs[0].id;
                updateCollection(user.collections[0], originalParent, user.monthlyLogs[0], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                        expect(doc.monthlyLogs.length).toBe(4);
                        expect(doc.collections.length).toBe(1);
                        expect(doc.collections[0].id).toBe(originalCollection.id);
                        expect(doc.collections[0].parent).toBe(newParentID);
                        expect(doc.collections[0].title).toBe("Now Updated Test Collection");
                        expect(doc.collections[0].content.length).toBe(0);
                        expect(doc.collections[0].collections.length).toBe(0);
                        expect(doc.collections[0].trackers.length).toBe(0);
                        
                        // original parent no longer has this collection
                        expect((doc.monthlyLogs.filter(log => log.id === originalParentID))[0].collections.filter(block => block === originalCollectionID).length).toBe(0);
						// updated user copy has this collection
                        expect(((doc.monthlyLogs.filter(log => log.id === newParentID))[0].collections.filter(block => block === originalCollectionID))[0]).toBe(originalCollectionID);
                        done();
                    })).resolves.toBe(undefined);
                });
            });
        }, 7000);

        test("Tests update collections in localStorage fails null parents", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
                user.collections[0].parent = user.monthlyLogs[1].id;
                user.collections[0].title = "Now Updated Test Collection";
				updateCollection(user.collections[0], null, null, false, async (err) => {
					expect(err).toBe("You are changing the parent without providing the original and old one");
					done();
				});
			});
		}, 7000);
    });
};