import { createFutureLog } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let createFutureLogTests = () => {
	describe(" Tests for creating Future Log", () => {
		test("Tests Create Future Log in localStorage successful", async (done) => {
			let startDate = new Date();
			let endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 3);
			createFutureLog("Testing Future Log", startDate, endDate, [], [], [],[], true, async (err, futureLog) => {
				expect(err === null).toBe(true);
				expect(futureLog.startDate.getTime()).toBe(startDate.getTime());
				expect(futureLog.endDate.getTime()).toBe(endDate.getTime());
				expect(futureLog.objectType).toBe("futureLog");
				expect(futureLog.months.length).toBe(4);
				expect(futureLog.content.length).toBe(0);
				expect(futureLog.collections.length).toBe(0);
				expect(futureLog.trackers.length).toBe(0);
				expect(futureLog.recurringTrackers.length).toBe(0);
				await expect(db.get("0000").then(doc => {
					expect(doc.monthlyLogs.length).toBe(4);
					expect(doc.index.futureLogs.length).toBe(1);
					expect(doc.index.futureLogs[0]).toBe(futureLog.id);
					for(let i = 0; i < futureLog.months.length; i++){
						expect(doc.monthlyLogs.filter(month => month.id === futureLog.months[i].id).length > 0).toBe(true);
					}
					done();
				})).resolves.toBe(undefined);
			});
		}, 5000);
	});
};