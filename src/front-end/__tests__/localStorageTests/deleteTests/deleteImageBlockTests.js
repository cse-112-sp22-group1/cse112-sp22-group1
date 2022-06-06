import { deleteImageBlock, deleteImageBlockByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteImageBlockTests = () => {
    describe("Tests for deleting ImageBlock", () => {
        test("tests for deleting ImageBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.ImageBlock[0].id;
				deleteImageBlock(user.ImageBlock[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.ImageBlock.filter(ImageBlock => ImageBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}

export let deleteImageBlockByIDTests = () => {
    describe("Tests for deleting ImageBlock", () => {
        test("tests for deleting ImageBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.ImageBlock[0].id;
				deleteImageBlockByID(id, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.ImageBlock.filter(ImageBlock => ImageBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}