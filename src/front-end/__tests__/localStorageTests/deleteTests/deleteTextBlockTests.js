import { deleteTextBlock, deleteTextBlockByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteTextBlockTests = () => {
    describe("Tests for deleting TextBlock", () => {
        test("tests for deleting TextBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.TextBlock[0].id;
				deleteTextBlock(user.TextBlock[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.TextBlock.filter(TextBlock => TextBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}

export let deleteTextBlockByIDTests = () => {
    describe("Tests for deleting TextBlock", () => {
        test("tests for deleting TextBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.TextBlock[0].id;
				deleteTextBlockByID(id, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.TextBlock.filter(TextBlock => TextBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}