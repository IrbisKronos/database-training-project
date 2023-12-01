const express = require("express"); //express import
const bodyParser = require("body-parser");
const app = express(); //app initialization
const sqlite3 = require("sqlite3").verbose();

const Task = require("./models/task2Model");

const dbName = "tasks.db";
const port = 3000;

const db = new sqlite3.Database(dbName);

let tasks = [
	{
		id: 1,
		text: "Go to shop",
	},
	{
		id: 2,
		text: "Bye map",
	},
	{
		id: 3,
		text: "Go for a run",
	},
	{
		id: 4,
		text: "Read book",
	},
	{
		id: 5,
		text: "Call mom",
	},
];

app.use(bodyParser.json());

const checkExist = (task, res) => {
	if (!task) {
		return res.status(404).json({ error: "Завдання не знайдене" });
	}
};

const serverError = (err, res) => {
	if (err) {
		return res.status(500).json({ error: err.message });
	}
};

app.get("/", (req, res) => {
	return res.send("Привіт, Expess!");
});

app.get("/tasks", (req, res) => {
	db.all("SELECT * FROM tasks", (err, rows) => {
		serverError(err, res);

		return res.status(200).json(rows);
	});
}); // запит до БД, що повертає всі записи з нашими завданнями

app.post("/tasks", (req, res) => {
	const newTask = req.body; //отримаємо дані з тіла запиту

	db.run("INSERT INTO tasks (text) VALUES (?)", [newTask.text], (err) => {
		serverError(err, res);
		// Відповідаємо повідомленням про успіх або новоствореною задачею(created - 201)

		return res.status(201).json({ id: this.lastID });
	});
});

app.get("/tasks/:id", (req, res) => {
	const taskId = parseInt(req.params.id);
	// знаходимо завдання за отриманим ідентифікатором
	bd.get("SELECT * FROM tasks WHERE id = ?", taskId, (err, row) => {
		serverError(err, res);
		checkExist(row, res);

		return res.status(200).json(row);
	});
});

app.put("/tasks/:id", (req, res) => {
	const { text } = req.body; // отримуємо дані з тіла запиту
	const taskId = parseInt(req.params.id); // id параметр приходить у вигляді строки, трансформуємо в число

	db.run("UPDATE tasks SET text = ? WHERE id = ?", [text, taskId], (err) => {
		serverError(err, res);

		return res.status(200).json({ id: taskId, text });
	});
});

app.delete("/tasks/:id", (req, res) => {
	const taskId = parseInt(req.params.id); // отримуємо id завданняж

	db.run("DELETE from tasks WHERE id = ?", taskId, (err) => {
		serverError(err, res);

		return res.status(204).send(); // відповісти повідомленням про успіх
	});
});

app.listen(port, () => {
	console.log(`Слухаємо на http://localhost:${port}`);
});
