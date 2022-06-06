import * as localStorage from "../../../localStorage/userOperations.js";
import { createUserPouch } from "../../../localStorage/createFiles/createUser.js";
import { db } from "../../localStorage.test.js";
import { makeRandomString, compareUsers } from "../../testFunctions.js";

export let createUserTests = () => {
	describe ("Tests for local storage create user", () => {
		test('Create User Success', async (done) => {
			let createUserFinished = async (userData) => {
				await expect(db.get("0000").then(async doc => {
					expect(compareUsers(userData, doc)).toBe(true);
					done();
				})).resolves.toBe(undefined);
			};
			localStorage.createUser("testLocalStorage@storage.com", "abcd", createUserFinished);
		}, 7000);
	});

	describe("Tests for create user Pouch", () => {
		test('Create User Failure', async (done) => {
			let userToCreate = {
				email: "tester@gmail.com",
				theme: "lightmode",
				index: {
					objectType: "index",
					futureLogs: [],
					collections: []
				},
				dailyLogs: [],
				monthlyLogs: [],
				futureLogs: [],
				trackers: [],
				collections: [],
				imageBlocks: [],
				audioBlocks: [],
				textBlocks: [],
				events: [],
				tasks: [],
				signifiers: [
					{
						id: makeRandomString(),
						objectType: "signifier",
						meaning: "Updated Signifier",
						symbol: "&#x1F7E0;"
					}
				]
			}
			
			await expect(createUserPouch(db, userToCreate, () => {
				db.get('0000').then((doc) => {
					expect(compareUsers(doc, userToCreate)).toBe(false);
					done();
				});
			})).resolves.toBe(undefined);
		});
	});
};