const express = require("express"); //express import
const bodyParser = require("body-parser");
const app = express(); //app initialization
const sqlite3 = require("sqlite3").verbose();
require("./config/db");

const { Task } = require("./models/task2Model");

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

app.get("/", (req, res) => {
	return res.send("Привіт, Expess!");
});

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find();
		return res.status(200).json(tasks);
	} catch (e) {
		console.error("Task creation error", e);
		return res.status(500).json({ error: e.message });
	}
}); // запит до БД, що повертає всі записи з нашими завданнями

app.post("/tasks", async (req, res) => {
	try {
		const newTask = req.body; //отримаємо дані з тіла запиту
		const task = await Task.create({
			text: newTask.text,
		});
		if (!task) {
			return res.status(404).json({ message: "Завдання не створене" });
		}
		return res.status(201).json(task);
	} catch (e) {
		console.error("Task creation error", e);
		return res.status(500).json({ error: e.message });
	}
});

app.get("/tasks/:id", async (req, res) => {
	try {
		const taskId = req.params.id;
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Завдання не знайдене" });
		}
		return res.status(200).json(task);
	} catch (e) {
		console.error("Task creation error", e);
		return res.status(500).json({ error: e.message });
	}
});

app.put("/tasks/:id", async (req, res) => {
	try {
		const { text, isCompleted } = req.body; // отримуємо дані з тіла запиту
		const taskId = req.params.id; // id параметр приходить у вигляді строки, трансформуємо в число
		const task = await Task.findByIdAndUpdate(taskId, { text, isCompleted }, { new: true });
		if (!task) {
			return res.status(404).json({ message: "Завдання не знайдене" });
		}
		return res.status(200).json(task);
	} catch (e) {
		console.error("Task creation error", e);
		return res.status(500).json({ error: e.message });
	}
});

app.delete("/tasks/:id", async (req, res) => {
	try {
		const taskId = req.params.id; // отримуємо id завданняж
		const task = await Task.findByIdAndDelete(taskId);
		if (!task) {
			return res.status(404).json({ message: "Завдання не знайдене" });
		}
		return res.status(204).send(); // відповісти повідомленням про успіх
	} catch (e) {
		console.error("Task creation error", e);
		return res.status(500).json({ error: e.message });
	}
});

app.listen(port, () => {
	console.log(`Слухаємо на http://localhost:${port}`);
});
