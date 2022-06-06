import { createImageBlock, readUser } from "../../../localStorage/userOperations.js";
import { originalImage as image } from "../files.js";
import { db } from "../../localStorage.test.js";

export let createImageBlockTests = () => {
	describe(" Tests for creating Image Blocks", () => {
		test("Tests Create Image Blocks in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createImageBlock(user.monthlyLogs[0], null, "center", image, true, async (err, imageBlock) => {
					expect(err === null).toBe(true);
					expect(imageBlock.objectType).toBe("imageBlock");
					expect(imageBlock.parent).toBe(user.monthlyLogs[0].id);
					expect(imageBlock.arrangement).toBe("center");
					expect(imageBlock.data).toBe(image);
					await expect(db.get("0000").then(doc => {
						expect(doc.monthlyLogs.length).toBe(4);
						expect(doc.imageBlocks.length).toBe(1);
						expect(doc.imageBlocks[0].id).toBe(imageBlock.id);
						
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].content[doc.monthlyLogs[doc.monthlyLogs.length - 1].content.length - 1]).toBe(imageBlock.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};