import jwt from "jsonwebtoken";
import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); 

app.use(express.static('public'));

let tasks = [];
let taskid = 1;

function authentication(req, res, next) {
  const authHeader = req.headers["authorization"];
  const key = authHeader && authHeader.split('Bearer ')[1];
  
  if(!key) {
    return res.status(401).json({ error: "token required" });
  }
  jwt.verify(key, "aaa", (err, user) => {
    if(err) 
      return res.status(403).json({ error: "invalid or expire token" });
    req.user = user;
    next();
  });
}


app.get("/", (req, res) => {
  res.redirect("/register");
});

app.post("/task", authentication, (req, res) => {
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

app.put("/task", authentication, (req, res) => {
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

app.delete("/task", authentication, (req, res) => {
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
    const payload = { username: user.username };
    const token = jwt.sign(payload, "aaa", { expiresIn: "1h" });
    if (req.is("application/json")) {
      return res.json({ message: "Login successful", token });
    }
    return res.render("login", { message: "Login successful" });
  } else {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    return res.render("login", { message: "Invalid username or password" });
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
    return res.status(400).json({ error: "Username already exists. Try another." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "Registration successful!" });
});



app.listen(3000, () => {
  console.log("server is running on port 3000");
});