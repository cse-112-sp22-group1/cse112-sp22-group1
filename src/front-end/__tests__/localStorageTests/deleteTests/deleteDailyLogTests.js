import { deleteDailyLogs, deleteAudioBlockByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteAudioBlockTests = () => {
    describe("Tests for deleting AudioBlock", () => {
        test("tests for deleting AudioBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.AudioBlock[0].id;
				deleteAudioBlock(user.AudioBlock[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.AudioBlock.filter(AudioBlock => AudioBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}

export let deleteAudioBlockByIDTests = () => {
    describe("Tests for deleting AudioBlock", () => {
        test("tests for deleting AudioBlock in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.AudioBlock[0].id;
				deleteAudioBlockByID(id, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.AudioBlock.filter(AudioBlock => AudioBlock.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}