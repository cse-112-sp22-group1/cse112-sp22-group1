import { createDailyLog, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let createDailyLogTests = () => {
	describe(" Tests for creating Daily Log", () => {
		test("Tests Create Daily Log in localStorage successful", async (done) => {
			let date = new Date();
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createDailyLog(user.monthlyLogs[0], [], [], [], date, true, async (err, dailyLog) => {
					expect(err === null).toBe(true);
					expect(dailyLog.date.getTime()).toBe(date.getTime());
					expect(dailyLog.objectType).toBe("dailyLog");
					expect(dailyLog.parent).toBe(user.monthlyLogs[0].id);
					expect(dailyLog.content.length).toBe(0);
					expect(dailyLog.collections.length).toBe(0);
					expect(dailyLog.trackers.length).toBe(0);
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs.length).toBe(4);
						expect(doc.dailyLogs.length).toBe(1);
						expect(doc.dailyLogs[0].id).toBe(dailyLog.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};