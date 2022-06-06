import { updateFutureLog, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateFutureLogTests = () => {
    describe("Tests for updating futurelogs", () => {
        test("Tests update futurelogs in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalFutureLogs = user.futureLogs[0];
                updateCollection(user.collections[0], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                        expect(doc.futureLogs);
                        expect(doc.futureLogs.toBe(1));
                        expect(doc.futureLogs[0].id).toBe(originalFutureLogs.id);
                        for(let i = 0; i < doc.futureLogs.content; i++){
                            expect(doc.futureLogs.content[i]).toBe(originalFutureLogs.content[i]);
                        }
                        for(let i = 0; i < doc.futureLogs.collections; i++){
                            expect(doc.futureLogs.collections[i]).toBe(originalFutureLogs.collections[i]);
                        }
                        for(let i = 0; i < doc.futureLogs.trackers; i++){
                            expect(doc.futureLogs.trackers[i]).toBe(originalFutureLogs.trackers[i]);
                        }
                        for(let i = 0; i < doc.futureLogs.trackers; i++){
                            expect(doc.futureLogs.recurringTrackers[i]).toBe(originalFutureLogs.recurringTrackers[i]);
                        }

                        done();
                    })).resolves.toBe(undefined);
                });
            });
        }, 5000);
    });
};
