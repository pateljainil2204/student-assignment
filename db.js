import mysql from "mysql2/promise";


//connection 
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "taskdb",
});

console.log("databse connected successfully");

//create table
await db.execute(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
  )
`);   
console.log("Table 'tasks' is ready!");

//add task

const addTask = async (title, description) => {
  const [result] = await db.execute(
    "INSERT INTO tasks (title, description) VALUES (?, ?)",
    [title, description]
  );
  console.log("Task added with ID:", result.insertId);
};



//get task

const getTasks = async () => {
  const [rows] = await db.execute("SELECT * FROM tasks");
  rows.forEach(t => console.log(`ID: ${t.id} | Title: ${t.title} | Description: ${t.description}`));
};

await addTask("Learn Node.js", "Practice MySQL with Node.js");
await addTask("Build Task App", "Create a simple task manager");

await getTasks();

// export default db;