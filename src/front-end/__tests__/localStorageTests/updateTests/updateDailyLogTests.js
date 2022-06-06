import { updateDailyLog, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateDailyLogTests = () => {
    describe("Tests for updating dailyLogs", () => {
        test("Tests update dailyLogs in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalDailyLog = user.dailyLogs[0];
                let originalDailyLogID = originalDailyLog.id;
                let originalParent = (user.monthlyLogs.filter(log => log.id === originalDailyLog.parent))[0];
                let originalParentID = originalParent.id;
                user.dailyLogs[0].parent = user.monthlyLogs[1].id;
                let newParentID = user.monthlyLogs[1].id;
                updateDailyLog(user.dailyLogs[0], originalParent, user.monthlyLogs[1], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                        expect(doc.dailyLogs.length).toBe(1);
                        expect(doc.dailyLogs[0].id).toBe(originalDailyLogID);
                        expect(doc.dailyLogs[0].parent).toBe(newParentID);
                        for(let i = 0; i < doc.dailyLogs.content; i++){
                            expect(doc.dailyLogs.content[i]).toBe(originalDailyLog.content[i]);
                        }
                        for(let i = 0; i < doc.dailyLogs.collections; i++){
                            expect(doc.dailyLogs.collections[i]).toBe(originalDailyLog.collections[i]);
                        }
                        for(let i = 0; i < doc.dailyLogs.trackers; i++){
                            expect(doc.dailyLogs.trackers[i]).toBe(originalDailyLog.trackers[i]);
                        }

                        expect((doc.monthlyLogs.filter(log => log.id === originalParentID))[0].days.filter(block => block.id === originalDailyLogID).length).toBe(0);
						expect(((doc.monthlyLogs.filter(log => log.id === newParentID))[0].days.filter(block => block.id === originalDailyLogID))[0].id).toBe(originalDailyLogID);

                        done();
                    })).resolves.toBe(undefined);
                });
            });
        }, 5000);

        test("Tests update daily logs in localStorage fails null parents", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				user.dailyLogs[0].parent = user.monthlyLogs[1].id;
				updateDailyLog(user.dailyLogs[0], null, null, false, async (err) => {
					expect(err).toBe("You are changing the parent without providing the original and old one");
					done();
				});
			});
		}, 5000);
    });
};