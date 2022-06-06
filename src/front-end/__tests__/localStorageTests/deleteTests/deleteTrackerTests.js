import { createTracker, deleteTracker, deleteTrackerByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteTrackerTests = () => {
    describe("Tests for deleting Tracker", () => {
        test("tests for deleting Tracker in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.trackers[0].id;
				let parentID = user.trackers[0].parent;
				deleteTracker(user.trackers[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.trackers.filter(tracker => tracker.id === id).length).toBe(0);
						expect(doc.monthlyLogs.filter(log => log.id === parentID)[0].trackers.length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                });
            })
        }, 5000);

		test("tests for deleting Tracker by id in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.trackers[0].id;
				let parentID = user.trackers[0].parent;
				deleteTrackerByID(user.trackers[0].id, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.trackers.filter(tracker => tracker.id === id).length).toBe(0);
						expect(doc.monthlyLogs.filter(log => log.id === parentID)[0].recurringTrackers.length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                });
            })
        }, 5000);
    });
}