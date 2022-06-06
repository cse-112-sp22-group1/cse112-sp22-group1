import { deleteEvent, deleteEventByID, readUser } from "../../../localStorage/userOperations.js";
import { db } from "../../localStorage.test.js";

export let deleteEventTests = () => {
    describe("Tests for deleting Event", () => {
        test("tests for deleting Event in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.Event[0].id;
				deleteEvent(user.Event[0], true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.Event.filter(Event => Event.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}

export let deleteEventByIDTests = () => {
    describe("Tests for deleting Event", () => {
        test("tests for deleting Event in local storage", async (done) => {
            readUser(async (error, user) => {
				expect(error == null).toBe(true);
                let id = user.Event[0].id;
				deleteEventByID(id, true, async (err) => {
                    expect(err == null).toBe(true);
					await expect(db.get("0000").then(doc => {
						expect(doc.Event.filter(Event => Event.id === id).length).toBe(0);
						done();
					})).resolves.toBe(undefined);
                })
            })
        }, 5000)
    })
}