import express from 'express';
const app = express();
app.use(express.json());

let tasks = [];
let taskid = 1;

app.post("/", (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Enter the title" });
  }

  const newTask = {
    id: taskid++,
    title,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(200).json(newTask);
});

app.get("/", (req, res) => {
  res.json(tasks);
});

app.put("/", (req, res) => { 
  const { id, title, description } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID required" });
  }

  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;

  res.json(task);
});

app.delete("/", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID required" });
  }

  const task = tasks.findIndex((t) => t.id === parseInt(id));
  if (task === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(task, 1);
  res.json({ message: "Task deleted", task: deletedTask });
});


app.listen(3000, () => {
  console.log("server is running on port 3000");
});