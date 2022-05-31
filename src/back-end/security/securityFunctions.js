/**
 * Security Functions
 * @namespace securityFunctions
 */
require("dotenv").config();
const CryptoJS = require("crypto-js");
const schema = require(`${__dirname}/../schema.js`);

/* Matching key for hashing and encrypting */
const KEY = process.env.HASHKEY;

/**
 * Hashes the password passed in and then returns it.
 * @memberof securityFunctions
 * @param {String} password The password to hash.
 * @return Returns the hashed password.
 */
const passHash = (password) => {
    let hashed = CryptoJS.HmacSHA256(password, KEY);
    hashed = hashed.toString();
    return hashed;
}

/**
 * Encrypts the message using the password as key and then returns the encrypted message.
 * @memberof securityFunctions
 * @param {String} message The text to encrypt.
 * @param {String} password The password to user as a key.
 * @return The encrypted message.
 */
const encrypt = (message, password) => {
    let encrypted = CryptoJS.AES.encrypt(message, password).toString();
    return encrypted;
}

/**
 * Decrypts the data using the password as key and then returns it.
 * @memberof securityFunctions
 * @param {String} data The text to decrypt.
 * @param {String} password The password to user as key.
 * @return Returns the decrypted data.
 */
const decrypt = (data, password) => {
    try {
        let decrypted = CryptoJS.AES.decrypt(data, password);
        let originalText = decrypted.toString(CryptoJS.enc.Utf8);
        return originalText;
    } catch (err) {
        return "";
    }
}

/**
 * Authenticates the user based on email and password in userDate
 * @memberof securityFunctions
 * @param {Object} userData The object that contains the email and password to authenticate.
 * @callback (response) Sends either true or false based on whether the email and password were authenticated or not.
 */
const authenticate = (userData, callback) => {
    schema.User.findOne({ email: userData.email }, (error, user) => {
        if (error || user === null) {
            callback(false);
        } else {
            let hashedPwd = passHash(userData.pwd);
            callback(user.pwd === hashedPwd);
        }
    })
}

/* For exporting */
module.exports = {
    passHash: passHash,
    encrypt: encrypt,
    decrypt: decrypt,
    authenticate: authenticate
}
