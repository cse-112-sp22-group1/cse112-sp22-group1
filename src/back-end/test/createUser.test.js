/**
 * Tests export user creation functions
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const { createUser } = require("../createFiles/createUser");
const schema = require("../schema.js");
const mongoose = require("mongoose");

describe("createUser Tests", () => {

    /**
     * Checks for an existing user
     *
     * @param {Object} userData Object containing email and password
     * @return true if user exists, false otherwise
     */
    const checkUser = async (userData) => {
        const user = await schema.User.findOne({ email: userData.email}).exec();
        if (user === null) {
            return false;
        }
        return true;
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

    test("createUser() produces expected user", async () => {
        const KEY = "ABC123";
        const EMAIL = "123@gmail.com";
        const PWD = "123ABC";
        let user = await createUser(EMAIL, PWD, KEY);
        let success = await checkUser(user);
        expect(success).toBe(true);
    });

    test("makeid() produces unique IDs", async () => {
        const EMAIL1 = "foo@gmail.com";
        const EMAIL2 = "faa@gmail.com";
        const PWDHASH1 = "123ABC";
        const PWDHASH2 = "456DEF";
        const KEY1 = "ABC123";
        const KEY2 = "ABC123";
        let user1 = await createUser(EMAIL1, PWDHASH1, KEY1);
        let user2 = await createUser(EMAIL2, PWDHASH2, KEY2);
        expect(user1.signifiers[0].id).not.toBe(user2.signifiers[0].id);
    });

    test("Fail creation with existing email", async () => {
        const EMAIL = "foo@gmail.com";
        const PWDHASH1 = "123ABC";
        const PWDHASH2 = "456DEF";
        const KEY = "ABC123";
        await createUser(EMAIL, PWDHASH1, KEY);
        const dupEmail = async () => {
            await createUser(EMAIL, PWDHASH2, KEY);
        };
        await expect(dupEmail).rejects.toThrow();
    });

    test("Fail creation with invalid email", async () => {
        const EMAIL = "123";
        const PWD = "123ABC";
        const KEY = "ABC123";
        const invEmail = async () => {
            await createUser(EMAIL, PWD, KEY);
        };
        await expect(invEmail).rejects.toThrow();
    });

    test("Fail creation with empty password", async () => {
        const EMAIL = "foo@gmail.com";
        const PWD = "";
        const KEY = "ABC123";
        const invPwd = async () => {
            await createUser(EMAIL, PWD, KEY);
        };
        await expect(invPwd).rejects.toThrow();
    });

    test("Fail creation with empty email and password", async () => {
        const EMAIL = "";
        const PWD = "";
        const KEY = "ABC123";
        const invEmPwd = async () => {
            await createUser(EMAIL, PWD, KEY);
        };
        await expect(invEmPwd).rejects.toThrow();
    });
});
