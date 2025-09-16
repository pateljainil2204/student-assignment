import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); 


let tasks = [];
let taskid = 1;

app.get("/", (req,res) => {
  res.redirect("/register");
})

app.post("/task", (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Enter the title" });
  }

  const newTask = {
    id: taskid++,
    title,
    description: description || "",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(200).json(newTask);
});

app.get("/task", (req, res) => {
  res.json(tasks);
});

app.put("/task", (req, res) => { 
  const { id, title, description, isCompleted } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID required" });
  }

  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (isCompleted !== undefined) task.isCompleted = isCompleted;

  res.json(task);
});

app.delete("/task", (req, res) => {
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return res.redirect("/task");
  } else {
    return res.send("<h2>Invalid username or password</h2>");
  }
});


let users = []

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

 const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.send("<h2> Username already exists. Try another.</h2>");
  }

  users.push({ username, password });
  res.send("<h2> Registration successful! <a href='/login'>Login here</a></h2>");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});