import { createCollection, deleteCollection, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteCollectionsTests = () => {
    describe("Tests for deleting collections", () => {
        test("tests for deleting collections in local storage with a parent", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.collections[0].id;
                let parent = user.monthlyLogs.filter(log => log.id === user.collections[0].parent)[0];
				deleteCollection(user.collections[0], parent, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.collections.filter(collection => collection.id === id).length).toBe(0);
                        expect(doc.monthlyLogs.filter(log => log.id === parent.id)[0].collections.filter(element => element.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000);

        test("tests for deleting collections in local storage without a parent", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                createCollection("New Collection", user.monthlyLogs[0].id, [], [], [], user.monthlyLogs[0], false, (failedCreate, newCollection) => {
                    expect(failedCreate == null).toBe(true);
                    let id = newCollection.id;
                    let parent = user.monthlyLogs.filter(log => log.id === newCollection.parent)[0];
                    deleteCollection(newCollection, null, true, async (err) => {
                        expect(err == null).toBe(true);
                        await expect(db.get("0000").then(doc => {
                            expect(doc.collections.filter(collection => collection.id === id).length).toBe(0);
                            expect(doc.monthlyLogs.filter(log => log.id === parent.id)[0].collections.filter(element => element.id === id).length).toBe(0);
                            done();
                        })).resolves.toBe(undefined);
                    });
                });
            })
        }, 5000);

        test("tests for deleting collections in local storage without a parent", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                createCollection("New Collection", null, [], [], [], null, false, (failedCreate, newCollection) => {
                    expect(failedCreate == null).toBe(true);
                    let id = newCollection.id;
                    deleteCollection(newCollection, null, true, async (err) => {
                        expect(err == null).toBe(true);
                        await expect(db.get("0000").then(doc => {
                            expect(doc.collections.filter(collection => collection.id === id).length).toBe(0);
                            expect(doc.index.collections.filter(element => element.id === id).length).toBe(0);
                            done();
                        })).resolves.toBe(undefined);
                    });
                });
            })
        }, 5000);
    })
}
