require("dotenv").config();
const app = require(`${__dirname}/app.js`);
const mongoose = require("mongoose");

/* Connect to the database once in our startup code */
mongoose.connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

/* Listen for connection on port 2827 */
app.listen("2827", () => {
    console.log("server has started listening to port 2827");
});
