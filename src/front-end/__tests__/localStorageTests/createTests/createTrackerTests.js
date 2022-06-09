import { createTracker, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let createTrackerTests = () => {
	describe(" Tests for creating Tracker", () => {
		test("Tests Create Tracker in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createTracker("Test Tracker", [], user.monthlyLogs[0].id, user.monthlyLogs[0], null, true, async (err, tracker) => {
					expect(err === null).toBe(true);
					expect(tracker.objectType).toBe("tracker");
					expect(tracker.title).toBe("Test Tracker");
					expect(tracker.parent).toBe(user.monthlyLogs[0].id);
					expect(tracker.content.length).toBe(0);
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs.length).toBe(4);
						expect(doc.trackers.length).toBe(1);
						expect(doc.trackers[0].id).toBe(tracker.id);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].trackers.length).toBe(1);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].trackers[0]).toBe(tracker.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);

		test("Tests Create Recurring Tracker in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createTracker("Test Tracker", [], user.monthlyLogs[0].id, user.monthlyLogs[0], user.dailyLogs[0], true, async (err, tracker) => {
					expect(err === null).toBe(true);
					expect(tracker.objectType).toBe("tracker");
					expect(tracker.title).toBe("Test Tracker");
					expect(tracker.parent).toBe(user.monthlyLogs[0].id);
					expect(tracker.content.length).toBe(0);
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs.length).toBe(4);
						expect(doc.trackers.length).toBe(3);
						expect(doc.trackers[doc.trackers.length - 2].id).toBe(tracker.id);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].recurringTrackers.length).toBe(1);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].recurringTrackers[0]).toBe(tracker.id);
						expect(doc.dailyLogs[doc.dailyLogs.length - 1].trackers.length).toBe(1);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};