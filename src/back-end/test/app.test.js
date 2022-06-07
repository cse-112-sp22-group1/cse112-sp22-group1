/**
 * Tests app.js routes
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const app = require("../app.js");
const constants = require("../constants.js");
const createUser = require("../createFiles/createUser.js");
const schema = require("../schema.js");
const security = require("../security/securityFunctions.js");
const mongoose = require("mongoose");
const request = require("supertest");

/**
 * Generates the user's encryption key from their password.
 *
 * @param {String} password The password to generate the key from.
 * @returns The symmetric encryption key for user data.
 */
const genKeyFromPass = (password) => security.passHash(security.encrypt(password, constants.sessionSecret));

describe("Test /auth route", () => {

    /**
     * Adds a user directly to the database.
     *
     * @param {String} email The email of the user to add.
     * @param {String} password The password of the user to add.
     * @returns The added user.
     */
    const addUser = async (email, password) => {
        const key = genKeyFromPass(password);
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
