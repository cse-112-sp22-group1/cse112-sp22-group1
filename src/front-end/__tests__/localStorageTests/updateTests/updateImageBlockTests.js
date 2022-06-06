import { updateImageBlock } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateImageBlockTests = () => {
    describe("Tests for updating ImageBlock", () => {
        test("Tests update ImageBlock in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalImageBlock = user.imageBlock[0];
                let originalImageBlockID = originalImageBlock.id;
                let originalParent = (user.monthlyLogs.filter(log => log.id === originalImageBlockID.parent))[0];
                let originalParentID = originalParent.id;
                user.imageBlock[0].parent = user.monthlyLogs[1].id;
                let newParentID = user.monthlyLogs[1].id;
                updateImageBlock(user.imageBlock[0], originalParent, user.monthlyLogs[1], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                    expect(doc.imageBlock.length).toBe(1);
                    expect(doc.imageBlock[0].id).toBe(originalParentID);
                    expect(doc.imageBlock[0].parent).toBe(newParentID);
                    for(let i = 0; i < doc.imageBlock.content; i++){
                        expect(doc.imageBlock.content[i]).toBe(originalimageBlock.content[i]);
                    }
                    for(let i = 0; i < doc.imageBlock.collections; i++){
                        expect(doc.imageBlock.collections[i]).toBe(originalimageBlock.collections[i]);
                    }
                    for(let i = 0; i < doc.imageBlock.trackers; i++){
                        expect(doc.imageBlock.trackers[i]).toBe(originalimageBlock.trackers[i]);
                    }
                    expect((doc.monthlyLogs.filter(log => log.id === originalParentID))[0].days.filter(block => block.id === originalImageBlockID).length).toBe(0);
                    expect(((doc.monthlyLogs.filter(log => log.id === newParentID))[0].days.filter(block => block.id === originalImageBlockID))[0].id).toBe(originalImageBlockID);

                    done();
                
                })).resolves.toBe(undefined);
            });
        });
    }, 5000);

        test("Tests update imageBlock in localStorage fails null parents", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				user.imageBlock[0].parent = user.monthlyLogs[1].id;
				updateDailyLog(user.imageBlock[0], null, null, false, async (err) => {
					expect(err).toBe("You are changing the parent without providing the original and old one");
					done();
				});
			});
		}, 5000);
    });
}