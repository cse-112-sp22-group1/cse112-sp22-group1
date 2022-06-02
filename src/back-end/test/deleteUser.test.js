/**
 * Tests export user deletion functions
 */

/* Mock envvars */
process.env.HASHKEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

/* Imports */
const { createUser } = require("../createFiles/createUser");
const { deleteUser } = require("../deleteFiles/deleteUser");
const schema = require("../schema.js");
const mongoose = require("mongoose");

describe("deleteUser Tests", () => {

    /**
     * Checks for an existing user
     *
     * @param {Object} userData Object containing email and password
     * @return true if user exists, false otherwise
     */
     const checkUser = async (userData) => {
        const user = await schema.User.findOne({ email: userData.email});
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

    test("User is properly deleted", async () => {
        const user = {
            email: "foo@gmail.com",
            pwd: "123ABC"
        }
        const KEY = "ABC123";
        await createUser(user.email, user.pwd, KEY);
        let success = await checkUser(user);
        expect(success).toBe(true);
        await deleteUser(user.email);
        let fail = await checkUser(user);
        expect(fail).toBe(false);
    });

    test("Non-existing user cannot be deleted", async () => {
        const deleteEmpty = async () => {
            const EMAIL = "faa@gmail.com";
            await deleteUser(EMAIL);
        };
        await expect(deleteEmpty).rejects.toThrow();
    });
});
