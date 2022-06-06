import { updateSignifier } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let updateSignifierTests = () => {
    describe("Tests for updating Signifier", () => {
        test("Tests update Signifier in localStorage successful", async (done) => {
            readUser((error, user) => {
                expect(error === null).toBe(true);
                let originalSignifier = user.textBlock[0];
                let originalTextBlocekID = originalTextBlock.id;
                user.textBlock[0].parent = user.monthlyLogs[1].id;
                let newParentID = user.monthlyLogs[1].id;
                updateSignifier(originalParent, user.monthlyLogs[1], true, async (err) => {
                    expect(err === null).toBe(true);
                    await expect(db.get("0000").then(doc => {
                    expect(doc.textBlock.length).toBe(1);
                    expect(doc.textBlock[0].id).toBe(originalParentID);
                    expect(doc.textBlock[0].parent).toBe(newParentID);
                    expect((doc.monthlyLogs.filter(log => log.id === originalParentID))[0].days.filter(block => block.id === originalTextBlockID).length).toBe(0);
                    expect(((doc.monthlyLogs.filter(log => log.id === newParentID))[0].days.filter(block => block.id === originalTextBlockID))[0].id).toBe(originalTextBlockID);

                    done();
                })).resolves.toBe(undefined);
            });
        });
    }, 5000);
    });
}