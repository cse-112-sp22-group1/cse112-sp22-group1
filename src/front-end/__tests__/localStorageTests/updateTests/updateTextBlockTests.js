import { updateTextBlock } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateTextBlockTests = () => {
    describe("Tests for updating TextBlock", () => {
        test("Tests update TextBlock in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalTextBlock = user.textBlock[0];
                let originalTextBlockID = originalTextBlock.id;
                let originalParent = (user.monthlyLogs.filter(log => log.id === originalTextBlockID.parent))[0];
                let originalParentID = originalParent.id;
                user.textBlock[0].parent = user.monthlyLogs[1].id;
                let newParentID = user.monthlyLogs[1].id;
                updateTextBlock(user.textBlock[0], originalParent, user.monthlyLogs[1], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                    expect(doc.textBlock.length).toBe(1);
                    expect(doc.textBlock[0].id).toBe(originalParentID);
                    expect(doc.textBlock[0].parent).toBe(newParentID);
                    for(let i = 0; i < doc.textBlock.content; i++){
                        expect(doc.textBlock.content[i]).toBe(originalTextBlock.content[i]);
                    }
                    for(let i = 0; i < doc.textBlock.collections; i++){
                        expect(doc.textBlock.collections[i]).toBe(originalTextBlock.collections[i]);
                    }
                    for(let i = 0; i < doc.textBlock.trackers; i++){
                        expect(doc.textBlock.trackers[i]).toBe(originalTextBlock.trackers[i]);
                    }
                    expect((doc.monthlyLogs.filter(log => log.id === originalParentID))[0].days.filter(block => block.id === originalTextBlockID).length).toBe(0);
                    expect(((doc.monthlyLogs.filter(log => log.id === newParentID))[0].days.filter(block => block.id === originalTextBlockID))[0].id).toBe(originalTextBlockID);

                    done();
                })).resolves.toBe(undefined);
            });
        });
    }, 5000);

        test("Tests update textBlock in localStorage fails null parents", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				user.textBlock[0].parent = user.monthlyLogs[1].id;
				updateDailyLog(user.textBlock[0], null, null, false, async (err) => {
					expect(err).toBe("You are changing the parent without providing the original and old one");
					done();
				});
			});
		}, 5000);
    });
}