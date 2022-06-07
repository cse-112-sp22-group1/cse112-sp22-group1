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

describe("Test /auth route", () => {

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
