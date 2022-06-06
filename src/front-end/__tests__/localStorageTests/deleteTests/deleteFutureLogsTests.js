import { deleteFutureLog, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteFutureLogTests = () => {
    describe("Tests for deleting FutureLog", () => {
        test("tests for deleting FutureLog in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
				deleteFutureLog(user.futureLogs[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.futureLogs.length).toBe(0);
                        expect(doc.dailyLogs.length).toBe(0);
                        expect(doc.monthlyLogs.length).toBe(0);
                        expect(doc.collections.length).toBe(0);
                        expect(doc.trackers.length).toBe(0);
                        expect(doc.textBlocks.length).toBe(0);
                        expect(doc.tasks.length).toBe(0);
                        expect(doc.events.length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}

