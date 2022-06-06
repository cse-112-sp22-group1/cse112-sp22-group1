import PouchDB from 'pouchdb';
import { setupStorage, deleteDB } from '../localStorage/userOperations.js';
import { createUserTests } from "./localStorageTests/createTests/createUserTest.js";
import { createFutureLogTests } from './localStorageTests/createTests/createFutureLogTest.js';
import { createDailyLogTests } from './localStorageTests/createTests/createDailyLogTests.js';
import { createCollectionTests } from './localStorageTests/createTests/createCollectionTests.js';
import { createTrackerTests } from './localStorageTests/createTests/createTrackerTests.js';
import { createSignifierTests } from './localStorageTests/createTests/createSignifierTests.js';
import { createImageBlockTests } from './localStorageTests/createTests/createImageBlockTests.js';
import { createAudioBlockTests } from './localStorageTests/createTests/createAudioBlockTests.js';
import { createTextBlockTests } from './localStorageTests/createTests/createTextBlockTests.js';

import { deleteCollectionsTests } from './localStorageTests/deleteTests/deleteCollectionTests.js';
import { deleteSignifierTests } from './localStorageTests/deleteTests/deleteSignifierTests.js';
import { deleteTrackerTests } from './localStorageTests/deleteTests/deleteTrackerTests.js';
import { deleteFutureLogTests } from './localStorageTests/deleteTests/deleteFutureLogsTests.js';

import { updateAudioBlockTests } from './localStorageTests/updateTests/updateAudioBlockTests.js';
import { updateCollectionTests } from './localStorageTests/updateTests/updateCollectionTests.js';
import { updateDailyLogTests } from './localStorageTests/updateTests/updateDailyLogTests.js';
import { updateFutureLogTests } from './localStorageTests/updateTests/updateFutureLogTests.js';

import fetch from "node-fetch";
import fetchCookie from "fetch-cookie";

let jar = new fetchCookie.toughCookie.CookieJar();
global.fetch = fetchCookie(fetch, jar);

PouchDB.plugin(require('pouchdb-adapter-memory'));
export let db = new PouchDB("Users", {adapter: 'memory'});
beforeAll(() => {
	setupStorage(db);
});

describe ("All tests for localStorage", () => {
	
	createUserTests();
	createFutureLogTests();
	createDailyLogTests();
	createCollectionTests();
	createTrackerTests();
	createSignifierTests();
	// createImageBlockTests();
	createTextBlockTests();
	// createAudioBlockTests();

	// updateAudioBlockTests();
	updateCollectionTests();
	updateDailyLogTests();
	// updateFutureLogTests();

	deleteCollectionsTests();
	deleteSignifierTests();
	deleteTrackerTests();
	deleteFutureLogTests();

	afterAll(async () => {
		await deleteDB(true);
		jar.removeAllCookies();
		db = null;
	});
});

