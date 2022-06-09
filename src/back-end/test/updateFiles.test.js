/**
 * Tests exported security functions.
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const schema = require("../schema.js");
const { readUser } = require("../readFiles/readUser.js");
const { updateUser } = require("../updateFiles/updateUser.js");
const security = require("../security/securityFunctions.js");
const mongoose = require("mongoose");

/* eslint-disable max-lines-per-function */
describe("updateUser() Tests", () => {
    const ENCRYPTION_KEY = "KEYKEYKEYKEYKEYKEYKEYKEY";

    /**
     * Create an empty user object with the username and password.
     *
     * @param {String} email The email of the user to create.
     * @param {String} password The password of the user.
     */
     const createEmptyUser = (email) => ({
        email: email,
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
        signifiers: []
    });

    /**
     * Removes Mongo userIds from userdata.
     *
     * @param {Object} user The object to remove the IDs from.
     */
    const removeIds = (user) => {
        delete user.__v;
        delete user._id;
        for (let obj of user.dailyLogs) {
            delete obj._id;
        }
        for (let obj of user.monthlyLogs) {
            delete obj._id;
            for (let day of obj.days) {
                delete day._id;
            }
        }
        for (let obj of user.futureLogs) {
            delete obj._id;
            for (let month of obj.months) {
                delete month._id;
            }
        }
        for (let obj of user.trackers) {
            delete obj._id;
        }
        for (let obj of user.collections) {
            delete obj._id;
        }
        for (let obj of user.imageBlocks) {
            delete obj._id;
        }
        for (let obj of user.audioBlocks) {
            delete obj._id;
        }
        for (let obj of user.textBlocks) {
            delete obj._id;
        }
        for (let obj of user.events) {
            delete obj._id;
        }
        for (let obj of user.tasks) {
            delete obj._id;
        }
        for (let obj of user.signifiers) {
            delete obj._id;
        }
        return user;
    };

    /**
     * Inserts a user into the database.
     *
     * @param {Object} user The user to insert.
     */
    const insertUser = async (user) => {
        await new schema.User(user).save();
    };

    /**
     * Gets a user with all it's data still encrypted.
     *
     * @param {String} email The email of the user to find.
     * @returns A user if found, null otherwise.
     */
    const getUser = async (email) => {
        const user = await schema.User.findOne({ email: email }).exec();
        return user;
    };

    /* Connect to the in-memory Mongo server */
    beforeAll(async () => {
        mongoose.set("useCreateIndex", true);
        await mongoose.connect(`${globalThis.__MONGO_URI__}${globalThis.__MONGO_DB_NAME__}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    });

    /* Drop the database */
    afterEach(async () => {
        await schema.User.deleteMany({});
    });

    /* Clean up the connection */
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("User can't update email", async (done) => {
        const USER_EMAIL = "user@example.com";
        const BAD_EMAIL = "other@example.com";

        const insertedUser = createEmptyUser(USER_EMAIL);
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* User returned by updateUser should not have a new email */
        let user = await updateUser(USER_EMAIL, ENCRYPTION_KEY, createEmptyUser(BAD_EMAIL));
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* This should also be reflected by readUser */
        user = await readUser(USER_EMAIL, ENCRYPTION_KEY);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* The user with the other email should not exist */
        readUser(BAD_EMAIL, ENCRYPTION_KEY).
        then(() => {
            expect(true).toBe(false);
            done();
        }).
        catch((err) => {
            expect(err.message).toBe("User does not exist!");
            done();
        });
    });

    test("User can't update password", async () => {
        const PASSWORD = "password";
        const insertedUser = createEmptyUser("user@example.com", PASSWORD);
        await insertUser(insertedUser);

        await updateUser(insertedUser.email, ENCRYPTION_KEY, createEmptyUser(insertedUser.email, "newPassword"));
        const user = await getUser(insertedUser.email);
        expect(user.pwd).toBe(insertedUser.pwd);
    });

    test("Password is not returned", async () => {
        const insertedUser = createEmptyUser("user@example.com", "password");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        const user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        expect(user.pwd).toBeUndefined();
    });

    test("Update user with collection", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.collections.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "Collection",
            parent: "CAFEBEEF",
            content: ["First", "Second", "Third"],
            collections: ["342q34234", "34234243"],
            trackers: ["34254235", "455423544"]
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.collections[0].title, ENCRYPTION_KEY)).toBe(insertedUser.collections[0].title);
    });

    test("Update user with text block", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.textBlocks.push({
            id: "DEADBEEF",
            objectType: "signifier",
            tabLevel: 0,
            parent: "BEEFBEEF",
            kind: "Event",
            objectReference: "DEADEAD",
            text: "This is some text",
            signifiers: ["orange", "purple"]
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.textBlocks[0].text, ENCRYPTION_KEY)).toBe(insertedUser.textBlocks[0].text);
    });

    test("Update user with task", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.tasks.push({
            id: "CAFEBEEF",
            objectType: "task",
            references: ["DEADBEEF"],
            text: "A task",
            complete: 0
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.tasks[0].text, ENCRYPTION_KEY)).toBe(insertedUser.tasks[0].text);
    });

    test("Update user with event", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.events.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            title: "A title",
            references: ["DEADBEEF"],
            date: JSON.parse(JSON.stringify(new Date()))
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.events[0].title, ENCRYPTION_KEY)).toBe(insertedUser.events[0].title);
    });

    test("Update user with signifier", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.signifiers.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            meaning: "general",
            symbol: "&#x1F7E0;"
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.signifiers[0].meaning, ENCRYPTION_KEY)).toBe(insertedUser.signifiers[0].meaning);
    });

    test("Update user with trackers", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.trackers.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "Tacker",
            content: ["Lorem", "Ipsum", "Novo"],
            parent: "CAFEBEEF"
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Check for valid encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.trackers[0].title, ENCRYPTION_KEY)).toBe(insertedUser.trackers[0].title);
    });

    test("Update user with daily log", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.dailyLogs.push({
            id: "DEADBEEF",
            collections: ["BEEFBEEF", "CAFECAFE"],
            objectType: "signifier",
            date: JSON.parse(JSON.stringify(new Date(0))),
            parent: "CAFEBEEF",
            content: ["First String", "Second String", "Third String"],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"]
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);
    });

    test("Update user with monthly log", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.monthlyLogs.push({
            id: "DEADBEEF",
            objectType: "signifier",
            parent: "CAFEBEEF",
            startDate: JSON.parse(JSON.stringify(new Date(0))),
            endDate: JSON.parse(JSON.stringify(new Date(2000 * 200))),
            content: ["BEEFCAFE"],
            collections: ["AAAAAAA"],
            days: [
                {
                    id: "CAFECAFE",
                    date: JSON.parse(JSON.stringify(new Date(0)))
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"],
            recurringTrackers: ["TRACEKRS TRACKERS"]
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);
    });

    test("Update user with future log", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.futureLogs.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "The Lorax",
            startDate: JSON.parse(JSON.stringify(new Date(0))),
            endDate: JSON.parse(JSON.stringify(new Date(100000000))),
            content: ["CFEFVED", "ASDASFDF"],
            collections: ["72132432", "34235325"],
            months: [
                {
                    id: "CAFECAFE",
                    date: JSON.parse(JSON.stringify(new Date(787878)))
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"],
            recurringTrackers: ["Hoop", "la"]
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);
    });

    test("Update user theme", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.theme = "darkmode";
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);
    });

    test("Update user index", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.index = {
            objectType: "index",
            futureLogs: ["hoo", "haa", "hey"],
            collections: ["huh", "what is it good 4?"]
        };
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);
    });

    test("Update everything", async () => {
        const insertedUser = createEmptyUser("user@example.com");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        /* Test for valid insertion */
        insertedUser.index = {
            objectType: "index",
            futureLogs: ["hoo", "haa", "hey"],
            collections: ["huh", "what is it good 4?"]
        };
        insertedUser.theme = "darkmode";
        insertedUser.dailyLogs.push({
            id: "DEADBEEF",
            collections: ["BEEFBEEF", "CAFECAFE"],
            objectType: "signifier",
            date: JSON.parse(JSON.stringify(new Date(0))),
            parent: "CAFEBEEF",
            content: ["First String", "Second String", "Third String"],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"]
        });
        insertedUser.monthlyLogs.push({
            id: "DEADBEEF",
            objectType: "signifier",
            parent: "CAFEBEEF",
            startDate: JSON.parse(JSON.stringify(new Date(0))),
            endDate: JSON.parse(JSON.stringify(new Date(2000 * 200))),
            content: ["BEEFCAFE"],
            collections: ["AAAAAAA"],
            days: [
                {
                    id: "CAFECAFE",
                    date: JSON.parse(JSON.stringify(new Date(0)))
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"],
            recurringTrackers: ["TRACEKRS TRACKERS"]
        });
        insertedUser.tasks.push({
            id: "CAFEBEEF",
            objectType: "task",
            references: ["DEADBEEF"],
            text: "A task",
            complete: 0
        });
        insertedUser.futureLogs.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "The Lorax",
            startDate: JSON.parse(JSON.stringify(new Date(0))),
            endDate: JSON.parse(JSON.stringify(new Date(100000000))),
            content: ["CFEFVED", "ASDASFDF"],
            collections: ["72132432", "34235325"],
            months: [
                {
                    id: "CAFECAFE",
                    date: JSON.parse(JSON.stringify(new Date(787878)))
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"],
            recurringTrackers: ["Hoop", "la"]
        });
        insertedUser.trackers.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "Tacker",
            content: ["Lorem", "Ipsum", "Novo"],
            parent: "CAFEBEEF"
        });
        insertedUser.collections.push({
            id: "DEADBEEF",
            objectType: "signifier",
            title: "Collection",
            parent: "CAFEBEEF",
            content: ["First", "Second", "Third"],
            collections: ["342q34234", "34234243"],
            trackers: ["34254235", "455423544"]
        });
        insertedUser.events.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            title: "A title",
            references: ["DEADBEEF"],
            date: JSON.parse(JSON.stringify(new Date()))
        });
        insertedUser.textBlocks.push({
            id: "DEADBEEF",
            objectType: "signifier",
            tabLevel: 0,
            parent: "BEEFBEEF",
            kind: "Event",
            objectReference: "DEADEAD",
            text: "This is some text",
            signifiers: ["orange", "purple"]
        });
        insertedUser.signifiers.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            meaning: "general",
            symbol: "&#x1F7E0;"
        });
        let user = await updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser);
        user = removeIds(JSON.parse(JSON.stringify(user)));
        expect(user).toEqual(insertedUser);

        /* Verify encryption */
        user = await getUser(insertedUser.email);
        expect(security.decrypt(user.collections[0].title, ENCRYPTION_KEY)).toBe(insertedUser.collections[0].title);
        expect(security.decrypt(user.textBlocks[0].text, ENCRYPTION_KEY)).toBe(insertedUser.textBlocks[0].text);
        expect(security.decrypt(user.tasks[0].text, ENCRYPTION_KEY)).toBe(insertedUser.tasks[0].text);
        expect(security.decrypt(user.events[0].title, ENCRYPTION_KEY)).toBe(insertedUser.events[0].title);
        expect(security.decrypt(user.signifiers[0].meaning, ENCRYPTION_KEY)).toBe(insertedUser.signifiers[0].meaning);
        expect(security.decrypt(user.trackers[0].title, ENCRYPTION_KEY)).toBe(insertedUser.trackers[0].title);
    });

    test("Update user that doesn't exist", (done) => {
        const badUser = createEmptyUser("user@example.com", "password");
        delete badUser.pwd;

        updateUser(badUser.email, ENCRYPTION_KEY, badUser).
        then(() => {
            expect(true).toBe(false);
            done();
        }).
        catch((err) => {
            expect(err.message).toBe("User does not exist!");
            done();
        });
    });

    test("Update user with bad schema", async (done) => {
        const insertedUser = createEmptyUser("user@example.com", "password");
        await insertUser(insertedUser);
        delete insertedUser.pwd;

        delete insertedUser.dailyLogs;
        updateUser(insertedUser.email, ENCRYPTION_KEY, insertedUser).
        then(() => {
            expect(true).toBe(false);
            done();
        }).
        catch(() => done());
    });
});
/* eslint-enable max-lines-per-function */
