import { createAudioBlock, readUser } from "../../../localStorage/userOperations.js";
import { originalAudio as audio } from "../files.js";
import { db } from "../../localStorage.test.js";

export let createAudioBlockTests = () => {
	describe("Tests for creating Audio Blocks", () => {
		test("Tests Create Audio Blocks in localStorage successful", async (done) => {
			readUser((error, user) => {
				expect(error === null).toBe(true);
				createAudioBlock(user.monthlyLogs[0], null, "center", audio, true, async (err, audioBlock) => {
					expect(err === null).toBe(true);
					expect(audioBlock.objectType).toBe("audioBlock");
					expect(audioBlock.parent).toBe(user.monthlyLogs[0].id);
					expect(audioBlock.arrangement).toBe("center");
					expect(audioBlock.data).toBe(audio);
					await expect(db.get("0000").then(doc => {
						expect(doc.audioBlocks.length).toBe(1);
						expect(doc.audioBlocks[0].id).toBe(audioBlock.id);
						expect(doc.monthlyLogs[doc.monthlyLogs.length - 1].content[doc.monthlyLogs[doc.monthlyLogs.length - 1].content.length - 1]).toBe(audioBlock.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
	});
};