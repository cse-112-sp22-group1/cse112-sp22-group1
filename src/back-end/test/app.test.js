/**
 * Tests app.js routes
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const app = require("../app.js");
const createUser = require("../createFiles/createUser.js");
const readUser = require("../readFiles/readUser.js");
const schema = require("../schema.js");
const security = require("../security/securityFunctions.js");
const mongoose = require("mongoose");
const request = require("supertest");

/**
 * Generates the user's encryption key from their password.
 *
 * @param {String} email The email of the user.
 * @param {String} password The password to generate the key from.
 * @returns The symmetric encryption key for user data.
 */
const genKeyFromPass = (email, password) => security.passHash(email + password);

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
 * Gets a valid auth cookie.
 *
 * @param {request.SuperTest<request.Test>} request The request to auth with.
 * @param {Object} user The user to authenticate as.
 * @return An authed session cookie, null if it doesn't exist.
 */
const getAuthCookie = async (user) => {
    const response = await request(app).post("/auth").send(user);
    if (response.statusCode !== 200) {
        return null;
    }
    for (let cookie of response.header["set-cookie"]) {
        cookie = cookie.split(" ")[0];
        if (cookie.startsWith("sessionAuth=")) {
            return cookie;
        }
    }
    return null;
};


/**
 * Adds a user directly to the database.
 *
 * @param {String} email The email of the user to add.
 * @param {String} password The password of the user to add.
 * @returns The added user.
 */
const addUser = async (email, password) => {
    const key = genKeyFromPass(email, password);
    const user = await createUser.createUser(email, password, key);
    return user;
};

/**
 * Reads a user from the database with data encrypted.
 *
 * @param {String} email The email of the user get.
 * @returns The user if found, null otherwise.
 */
const getEncryptedUser = async (email) => {
    const user = await schema.User.findOne({ email: email }).exec();
    return JSON.parse(JSON.stringify(user));
};

/**
 * Reads a user from the database with data decrypted and password stripped.
 *
 * @param {String} email The email of the user to get.
 * @param {String} password The password of the user to get.
 * @returns The user if found, null otherwise.
 */
const getDecryptedUser = async (email, password) => {
    const key = genKeyFromPass(email, password);
    const user = await readUser.readUser(email, key);
    return JSON.parse(JSON.stringify(user));
};


describe("Test /auth route", () => {

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

    test("Valid auth", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        const response = await request(app).post("/auth").send(user);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: null });
    });

    test("User exists, wrong password", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, "differentPassword");
        const response = await request(app).post("/auth").send(user);
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("User doesn't exist", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        const response = await request(app).post("/auth").send(user);
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("User exists, request missing password", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        delete user.pwd;
        const response = await request(app).post("/auth").send(user);
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("User exists, request missing email", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        delete user.email;
        const response = await request(app).post("/auth").send(user);
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("User exists, empty request", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        const response = await request(app).post("/auth").send({});
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("User exists, invalid body", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        const response = await request(app).post("/auth").send(null);
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: "Authentication failed!" });
    });

    test("Multiple users, valid auth", async () => {
        const user1 = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user1.email, user1.pwd);

        const user2 = {
            email: "user@instance.com",
            pwd: "PASSWORD"
        };
        await addUser(user2.email, user2.pwd);

        const user3 = {
            email: "user@incident.com",
            pwd: "drowssap"
        };
        await addUser(user3.email, user3.pwd);

        let response = await request(app).post("/auth").send(user1);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: null });

        response = await request(app).post("/auth").send(user2);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: null });

        response = await request(app).post("/auth").send(user3);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.header["set-cookie"][0]).toMatch(/sessionAuth=/);
        expect(response.header["set-cookie"][0]).toMatch(/Path=\//);
        expect(response.body).toEqual({ error: null });
    });
});

describe("Test POST /user route", () => {

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

    test("Create valid user", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        const response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        let decryptedUser = await getDecryptedUser(user.email, user.pwd);
        expect(removeIds(response.body)).toEqual(removeIds(decryptedUser));

        const encryptedUser = await getEncryptedUser(user.email, user.pwd);
        expect(encryptedUser.pwd).toBe(security.passHash(user.pwd));
    });

    test("Create existing user", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        let response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(200);

        response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "This email already has an account!" });
    });

    test("Create existing with empty email", async () => {
        const user = {
            email: "",
            pwd: "password"
        };
        const response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "Invalid email!" });
    });

    test("Create existing with invalid email", async () => {
        const user = {
            email: "user@whatever",
            pwd: "password"
        };
        const response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "Invalid email!" });
    });

    test("Create existing with empty password", async () => {
        const user = {
            email: "user@example.com",
            pwd: ""
        };
        const response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "Password is empty!" });
    });

    test("Create existing with null email", async () => {
        const user = {
            email: null,
            pwd: "password"
        };
        const response = await request(app).post("/user").send(user);
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "Cannot read properties of null (reading 'match')" });
    });
});

describe("Test DELETE /user route", () => {

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

    test("Delete valid user", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        let cookie = await getAuthCookie(user);
        expect(cookie).not.toBe(null);

        const response = await request(app).
            delete("/user").
            set("cookie", [cookie]);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.email).toBe(user.email);
    });

    test("Delete valid user, not authed", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);

        const response = await request(app).delete("/user");
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "User is not authorized to access this resource." });
    });
});

describe("Test UPDATE /user route", () => {

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

    test("User full update", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        const insertedUser = await addUser(user.email, user.pwd);
        let cookie = await getAuthCookie(user);
        expect(cookie).not.toBe(null);

        insertedUser.index = { objectType: "index", contents: ["One", "Two", "Three"] };
        insertedUser.theme = "darkmode";
        insertedUser.dailyLogs.push({
            id: "DEADBEEF",
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
            date: JSON.parse(JSON.stringify(new Date(0))),
            days: [
                {
                    id: "CAFECAFE",
                    content: ["Some content", "other content", "more content"],
                    dailyLog: "BEEFBEEF"
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"]
        });
        insertedUser.futureLogs.push({
            id: "DEADBEEF",
            objectType: "signifier",
            startDate: JSON.parse(JSON.stringify(new Date(0))),
            endDate: JSON.parse(JSON.stringify(new Date(100000000))),
            months: [
                {
                    id: "CAFECAFE",
                    content: ["Some content", "other content", "more content"],
                    monthlyLog: "BEEFBEEF"
                }
            ],
            trackers: ["First Tracker", "Second Tracker", "Third Tracker"]
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
            content: ["First", "Second", "Third"]
        });
        insertedUser.textBlocks.push({
            id: "DEADBEEF",
            objectType: "signifier",
            tabLevel: 0,
            parent: "BEEFBEEF",
            subParent: "CAFECAFE",
            kind: "Event",
            objectReference: "DEADEAD",
            text: "This is some text",
            signifier: "orange"
        });
        insertedUser.events.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            title: "A title",
            parent: "DEADBEEF",
            date: JSON.parse(JSON.stringify(new Date())),
            signifier: "Orange"
        });
        insertedUser.tasks.push({
            id: "CAFEBEEF",
            objectType: "task",
            parent: "DEADBEEF",
            text: "A task",
            complete: 0,
            signifier: "AAAAAAAAAAAAAAAAAAAAAAAAa"
        });
        insertedUser.signifiers.push({
            id: "CAFEBEEF",
            objectType: "signifier",
            meaning: "general",
            symbol: "&#x1F7E0;"
        });

        const response = await request(app).
            put("/user").
            set("cookie", [cookie]).
            send(insertedUser);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(removeIds(response.body)).toEqual(removeIds(insertedUser));

        const decryptedUser = await getDecryptedUser(user.email, user.pwd);
        expect(removeIds(decryptedUser)).toEqual(removeIds(insertedUser));
    });

    test("User can't update email", async () => {
        const GOOD_EMAIL = "user@example.com";
        const BAD_EMAIL = "devil@evil.com";
        const PASSWORD = "password";
        const user = await addUser(GOOD_EMAIL, PASSWORD);
        user.pwd = PASSWORD;
        let cookie = await getAuthCookie(user);
        delete user.pwd;
        expect(cookie).not.toBe(null);

        user.email = BAD_EMAIL;
        const response = await request(app).
            put("/user").
            set("cookie", [cookie]).
            send(user);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.email).toBe(GOOD_EMAIL);

        const decryptedUser = await getDecryptedUser(GOOD_EMAIL, PASSWORD);
        expect(decryptedUser.email).toEqual(GOOD_EMAIL);
    });

    test("User can't update password", async () => {
        const EMAIL = "user@example.com";
        const PASSWORD = "password";
        let user = await addUser(EMAIL, PASSWORD);
        user.pwd = PASSWORD;
        let cookie = await getAuthCookie(user);
        expect(cookie).not.toBe(null);

        user.pwd = "differentPassword";
        const response = await request(app).
            put("/user").
            set("cookie", [cookie]).
            send(user);
        expect(response.statusCode).toBe(200);

        user = await getEncryptedUser(EMAIL);
        const EXPECTED_PASSHASH = security.passHash(PASSWORD);
        expect(user.pwd).toBe(EXPECTED_PASSHASH);
    });

    test("User can't update a different user", async () => {
        const user1 = {
            email: "user@example.com",
            pwd: "password"
        };
        const insertedUser1 = await addUser(user1.email, user1.pwd);
        const user2 = {
            email: "tim@gmail.com",
            pwd: "drowssap"
        };
        const insertedUser2 = await addUser(user2.email, user2.pwd);

        let cookie = await getAuthCookie(user1);
        expect(cookie).not.toBe(null);

        insertedUser1.email = user2.email;
        insertedUser1.theme = "canary";
        const response = await request(app).
            put("/user").
            set("cookie", [cookie]).
            send(insertedUser1);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.email).toEqual(user1.email);

        /* Check that user1 was the one that was updated */
        let decUser = await getDecryptedUser(user1.email, user1.pwd)
        expect(decUser.theme).toEqual(insertedUser1.theme);

        /* Check that user2 was no updated */
        decUser = await getDecryptedUser(user2.email, user2.pwd)
        expect(decUser.theme).toEqual(insertedUser2.theme);
    });

    test("Update with empty object", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        const insertedUser = await addUser(user.email, user.pwd);

        let cookie = await getAuthCookie(user);
        expect(cookie).not.toBe(null);

        const response = await request(app).
            put("/user").
            set("cookie", [cookie]).
            send({});
        expect(response.statusCode).toBe(500);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.error).toBeDefined();

        const decUser = await getDecryptedUser(user.email, user.pwd)
        expect(removeIds(decUser)).toEqual(removeIds(insertedUser));
    });
});

describe("Test GET /user route", () => {

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

    test("Read empty user", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        const insertedUser = await addUser(user.email, user.pwd);
        const cookie = await getAuthCookie(user);
        expect(cookie).not.toBe(null);
        const response = await request(app).
            get("/user").
            set("cookie", [cookie]);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(removeIds(response.body)).toEqual(removeIds(insertedUser));
    });

    test("Read not authed", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        const response = await request(app).
            get("/user");
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "User is not authorized to access this resource." });
    });

    test("Read after failed auth", async () => {
        const user = {
            email: "user@example.com",
            pwd: "password"
        };
        await addUser(user.email, user.pwd);
        user.pwd = "notpassword";
        const cookie = await getAuthCookie(user);
        expect(cookie).toBe(null);
        const response = await request(app).
            get("/user");
        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toEqual({ error: "User is not authorized to access this resource." });
    });
});
