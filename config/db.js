const mongoose = require("mongoose");
const { DB_PASSWORD } = require("./secret");
const URI = `mongodb+srv://irbiskronos:${DB_PASSWORD}@cluster0.tylboms.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(URI);

const db = mongoose.connection;

db.on("error", (err) => {
	console.error("Connection error:", err);
});

db.once("open", () => {
	console.log("Connected to Mongo DB");
});
