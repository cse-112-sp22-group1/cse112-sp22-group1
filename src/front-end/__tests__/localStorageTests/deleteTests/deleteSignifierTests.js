import { createSignifier, deleteSignifier, deleteSignifierByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteSignifierTests = () => {
    describe("Tests for deleting Signifier", () => {
        test("tests for deleting Signifier in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.signifiers[0].id;
				deleteSignifier(user.signifiers[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.signifiers.filter(signifier => signifier.id === id).length).toBe(0);
                        doc.textBlocks.forEach(block => {
                            expect(block.signifiers.filter(signifier => signifier.id === id).length).toBe(0);
                        });
						done();
					})).resolves.toBe(undefined);
                });
            })
        }, 5000);
        
        test("tests for deleting Signifier by ID in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                createSignifier("Test Signifier", "&#128579;", false, async (err, signifier) => {
					expect(err === null).toBe(true);
                    let id = signifier.id;
                    deleteSignifierByID(signifier.id, true, async (err) => {
                        expect(err == null).toBe(true);
                        await expect(db.get("0000").then(doc => {
                            expect(doc.signifiers.filter(signifier => signifier.id === id).length).toBe(0);
                            doc.textBlocks.forEach(block => {
                                expect(block.signifiers.filter(signifier => signifier.id === id).length).toBe(0);
                            });
                            done();
                        })).resolves.toBe(undefined);
                    });
                });
            })
        }, 5000);
    });
}
