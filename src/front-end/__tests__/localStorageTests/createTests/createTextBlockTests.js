import { createTextBlock, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

let task = null;
let event = null;

export let createTextBlockTests = () => {
    describe("Tests for create Text block and sub-dependencies", () => {
		test("Tests create text block in localStorage", async (done) => {
			readUser((err, user) => {
				expect(err === null).toBe(true);
				createTextBlock(user.futureLogs[0], null, "This is a starter test", 0, "text", null, [], null, true, async (error, textBlock) => {
					expect(error === null).toBe(true);
					expect(textBlock.objectType).toBe("textBlock");
					expect(textBlock.tabLevel).toBe(0);
					expect(textBlock.parent).toBe(user.futureLogs[0].id);
					expect(textBlock.kind).toBe("text");
					expect(textBlock.objectReference == null).toBe(true);
					expect(textBlock.text).toBe("This is a starter test");
					expect(textBlock.signifiers.length).toBe(0);
					await expect(db.get("0000").then(async doc => {
						expect(doc.textBlocks.length).toBe(1);
						expect(doc.textBlocks[doc.textBlocks.length - 1].id).toBe(textBlock.id);
						expect(doc.futureLogs[0].content.length).toBe(1);
						expect(doc.futureLogs[0].content[doc.futureLogs[0].content.length - 1]).toBe(textBlock.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);

		test("Tests create text block with new Task in localStorage", async (done) => {
			readUser((err, user) => {
				expect(err === null).toBe(true);
				createTextBlock(user.futureLogs[0], null, "This is a starter test for a task", 0, "task", null, [], null, true, async (error, textBlock) => {
					if (error) {
						console.log(error);
					}
					expect(error === null).toBe(true);
					expect(textBlock.objectType).toBe("textBlock");
					expect(textBlock.tabLevel).toBe(0);
					expect(textBlock.parent).toBe(user.futureLogs[0].id);
					expect(textBlock.kind).toBe("task");
					expect(textBlock.objectReference !== null).toBe(true);
					expect(textBlock.text).toBe("This is a starter test for a task");
					expect(textBlock.signifiers.length).toBe(0);
					await expect(db.get("0000").then( async doc => {
						expect(doc.textBlocks.length).toBe(2);
						expect(doc.tasks.length).toBe(1);
						task = doc.tasks[0];
						expect(doc.textBlocks[doc.textBlocks.length - 1].id).toBe(textBlock.id);
						expect(doc.futureLogs[0].content.length).toBe(2);
						expect(doc.futureLogs[0].content[doc.futureLogs[0].content.length - 1]).toBe(textBlock.id);
						expect(textBlock.objectReference).toBe(task.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);

		test("Tests create text block with new Event in localStorage", async (done) => {
			readUser((err, user) => {
				expect(err === null).toBe(true);
				createTextBlock(user.futureLogs[0], null, "This is a starter test for a task", 0, "event", null, [], new Date(), true, async (error, textBlock) => {
					if (error) {
						console.log(error);
					}
					expect(error === null).toBe(true);
					expect(textBlock.objectType).toBe("textBlock");
					expect(textBlock.tabLevel).toBe(0);
					expect(textBlock.parent).toBe(user.futureLogs[0].id);
					expect(textBlock.kind).toBe("event");
					expect(textBlock.objectReference !== null).toBe(true);
					expect(textBlock.text).toBe("This is a starter test for a task");
					expect(textBlock.signifiers.length).toBe(0);
					await expect(db.get("0000").then( async doc => {
						expect(doc.textBlocks.length).toBe(3);
						expect(doc.events.length).toBe(1);
						event = doc.events[0];
						expect((new Date(event.date)).getDate()).toBe((new Date()).getDate());
						expect(doc.textBlocks[doc.textBlocks.length - 1].id).toBe(textBlock.id);
						expect(doc.futureLogs[0].content.length).toBe(3);
						expect(doc.futureLogs[0].content[doc.futureLogs[0].content.length - 1]).toBe(textBlock.id);
						expect(textBlock.objectReference).toBe(event.id);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);

		test("Tests create text block with previous Task in localStorage", async (done) => {
			readUser((err, user) => {
				expect(err === null).toBe(true);
				createTextBlock(user.futureLogs[0], 0, "This is a starter test for a task", 0, "task", task.id, [], null, true, async (error, textBlock) => {
					if (error) {
						console.log(error);
					}
					expect(error === null).toBe(true);
					expect(textBlock.objectType).toBe("textBlock");
					expect(textBlock.tabLevel).toBe(0);
					expect(textBlock.parent).toBe(user.futureLogs[0].id);
					expect(textBlock.kind).toBe("task");
					expect(textBlock.objectReference !== null).toBe(true);
					expect(textBlock.text).toBe("This is a starter test for a task");
					expect(textBlock.signifiers.length).toBe(0);
					await expect(db.get("0000").then( async doc => {
						expect(doc.textBlocks.length).toBe(4);
						expect(doc.tasks.length).toBe(1);
						task = doc.tasks[0];
						expect(doc.textBlocks[doc.textBlocks.length - 1].id).toBe(textBlock.id);
						expect(doc.futureLogs[0].content.length).toBe(4);
						expect(doc.futureLogs[0].content[0]).toBe(textBlock.id);
						expect(textBlock.objectReference).toBe(task.id);
						expect(((doc.tasks.filter(docTask => docTask.id === task.id))[0].references.filter(reference => reference === textBlock.id)).length).toBe(1);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
		

		test("Tests create text block with previous Event in localStorage", async (done) => {
			readUser((err, user) => {
				expect(err === null).toBe(true);
				createTextBlock(user.futureLogs[0], null, "This is a starter test for an event", 0, "event", event.id, [], new Date(event.date), true, async (error, textBlock) => {
					if (error) {
						console.log(error);
					}
					expect(error === null).toBe(true);
					expect(textBlock.objectType).toBe("textBlock");
					expect(textBlock.tabLevel).toBe(0);
					expect(textBlock.parent).toBe(user.futureLogs[0].id);
					expect(textBlock.kind).toBe("event");
					expect(textBlock.objectReference !== null).toBe(true);
					expect(textBlock.text).toBe("This is a starter test for an event");
					expect(textBlock.signifiers.length).toBe(0);
					await expect(db.get("0000").then( async doc => {
						expect(doc.textBlocks.length).toBe(5);
						expect(doc.events.length).toBe(1);
						let originalDate = new Date(event.date);
						event = doc.events[0];
						expect((new Date(event.date)).getDate()).toBe(originalDate.getDate());
						expect(doc.textBlocks[doc.textBlocks.length - 1].id).toBe(textBlock.id);
						expect(doc.futureLogs[0].content.length).toBe(5);
						expect(doc.futureLogs[0].content[doc.futureLogs[0].content.length - 1]).toBe(textBlock.id);
						expect(textBlock.objectReference).toBe(event.id);
						expect(((doc.events.filter(docEvent => docEvent.id === event.id))[0].references.filter(reference => reference === textBlock.id)).length).toBe(1);
						done();
					})).resolves.toBe(undefined);
				});
			});
		}, 5000);
		
    });
}
