import express from 'express';
import bodyParser from 'body-parser';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { getAllTasks } from './services/notionService.js';
import { parseNotionPageToTask } from './services/taskService.js';
import { connectToMongo } from './mongoConnection.js';
import { Task } from './models/task.js';
import { addTaskToMongo } from './services/mongoService.js';

dotenv.config();
const app = express();
export const notion = new Client ({auth: process.env.NOTION_KEY});
export const databaseId = process.env.NOTION_DATABASE_ID?? "";

//middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//view engine

app.set('view engine', 'pug');
app.set('views', './views');

//routes

app.get('/', (req, res) => {
    res.render('index', { title: 'Task and Notes Management' });
  });

//start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

var allTasks : Task[] = []

const addSomeTasksToMongo = async () => {
  for (let i = 0; i < 3; i++) {
    const task = allTasks[i];
    await addTaskToMongo(task)
  }
}

//mongo connection
await connectToMongo()
.then(
  () => {return getAllTasks()}
)
.then(res => {
  res.forEach(task => {
    allTasks.push(parseNotionPageToTask(task))
    console.log("New task object:", parseNotionPageToTask(task))
  })
  addSomeTasksToMongo()
})
.catch(console.dir)

// console.log(allNotionTasks)