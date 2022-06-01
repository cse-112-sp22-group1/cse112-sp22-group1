/**
 * Tests exported security functions.
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const security = require("../security/securityFunctions");
const schema = require("../schema.js");
const mongoose = require("mongoose");

describe("passHash() Tests", () => {
    test("HMAC-SHA256 produces expected result", () => {
        const EXPECTED = "2a4850e67920aabfa48641fbcd4e7f5cfa8e17d976e143eff7c55939a29d5742";
        const result = security.passHash("password");
        expect(result).toBe(EXPECTED);
    });

    test("Reproducability", () => {
        const EXPECTED = "2a4850e67920aabfa48641fbcd4e7f5cfa8e17d976e143eff7c55939a29d5742";
        const result1 = security.passHash("password");
        const result2 = security.passHash("password");
        expect(result1).toBe(EXPECTED);
        expect(result2).toBe(EXPECTED);
    });

    /**
     * Uses random string to test for collisions. This should never fail in our lifetimes.
     */
    test("Collision Resistence", () => {
        const EXPECTED = security.passHash("password");
        for (let i = 0; i < 100; ++i) {
            let password = Math.random().toString(36).slice(2);
            while (password === "password") {
                password = Math.random().toString(36).slice(2);
            }
            const result = security.passHash(password);
            expect(result).not.toBe(EXPECTED);
        }
    });
});

describe("encrypt() Tests", () => {
    test("Result differs from plaintext", () => {
        const EXPECTED = "Unencrypted message";
        const result = security.encrypt(EXPECTED, "PASSWORD");
        expect(result).not.toBe(EXPECTED);
    });

    test("Encrypt the empty string", () => {
        const EXPECTED = "";
        const result = security.encrypt(EXPECTED, "PASSWORD");
        expect(result).not.toBe(EXPECTED);
    });

    test("Different key, same message", () => {
        const MESSAGE = "An unencrypted message";
        const result1 = security.encrypt(MESSAGE, "PASSWORD");
        const result2 = security.encrypt(MESSAGE, "password");
        expect(result2).not.toBe(result1);
    });

    test("Same key, different message", () => {
        const ENCRYPTION_KEY = "PASSWORD";
        const result1 = security.encrypt("This is one message", ENCRYPTION_KEY);
        const result2 = security.encrypt("This is another message", ENCRYPTION_KEY);
        expect(result2).not.toBe(result1);
    });

    test("Different message, different key", () => {
        const result1 = security.encrypt("This is one message", "password");
        const result2 = security.encrypt("This is another message", "PASSWORD");
        expect(result2).not.toBe(result1);
    });
});

describe("decrypt() Tests", () => {
    test("Valid decryption", () => {
        const MESSAGE = "This is a message";
        const ENCRYPTION_KEY = "PASSWORD";
        const cyphertext = security.encrypt(MESSAGE, ENCRYPTION_KEY);
        const result = security.decrypt(cyphertext, ENCRYPTION_KEY);
        expect(MESSAGE).toBe(result);
    });

    test("Wrong key", () => {
        const MESSAGE = "This is a message";
        const cyphertext = security.encrypt(MESSAGE, "PASSWORD");
        const result = security.decrypt(cyphertext, "password");
        expect(result).not.toBe(MESSAGE);
    });

    test("Invalid cyphertext", () => {
        const CYPHERTEXT = Math.random().toString(36).slice(2);
        const result = security.decrypt(CYPHERTEXT, "PASSWORD");
        expect(result).toBe("");
    });

    test("Decrypt empty string", () => {
        const MESSAGE = "";
        const ENCRYPTION_KEY = "PASSWORD";
        const cyphertext = security.encrypt(MESSAGE, ENCRYPTION_KEY);
        const result = security.decrypt(cyphertext, ENCRYPTION_KEY);
        expect(result).toBe(MESSAGE);
    });
});

describe("authenticate() Tests", () => {

    /**
     * Inserts a user.
     *
     * @param {String} email The email of the user to insert.
     * @param {*} password The password of the user to insert.
     */
    const insertUser = async (email, password) => {
        const user = new schema.User({
            email: email,
            pwd: security.passHash(password),
            theme: "lightmode",
            index: {
                objectType: "index",
                contents: []
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
                    id: "DEADBEEF",
                    objectType: "signifier",
                    meaning: security.encrypt("general", "PASSWORD"),
                    symbol: "&#x1F7E0;"
                }
            ]
        });
        await user.save();
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

    test("Successful auth", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        security.authenticate(user, (success) => {
            expect(success).toBe(true);
            done();
        });
    });

    test("Multiple users successful auth", async (done) => {
        const user1 = {
            email: "user1@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user1.email, user1.pwd);
        const user2 = {
            email: "user2@example.com",
            pwd: "password"
        };
        await insertUser(user2.email, user2.pwd);
        const user3 = {
            email: "user3@example.com",
            pwd: "wordPASS"
        };
        await insertUser(user3.email, user3.pwd);
        security.authenticate(user1, (suc1) => {
            expect(suc1).toBe(true);
            security.authenticate(user2, (suc2) => {
                expect(suc2).toBe(true);
                security.authenticate(user3, (suc3) => {
                    expect(suc3).toBe(true);
                    done();
                });
            });
        });
    });

    test("Wrong password", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, "password");
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Non-existant username", (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Non-existant username with other users in DB", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser("user@gmail.com", "diffpassword");
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Null email", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        user.email = null;
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Null password", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        user.pwd = null;
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Undefined email", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        delete user.email;
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Undefined password", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        delete user.pwd;
        security.authenticate(user, (success) => {
            expect(success).toBe(false);
            done();
        });
    });

    test("Empty userdata", async (done) => {
        const user = {
            email: "user@example.com",
            pwd: "PASSWORD"
        };
        await insertUser(user.email, user.pwd);
        security.authenticate({}, (success) => {
            expect(success).toBe(false);
            done();
        });
    });
});
