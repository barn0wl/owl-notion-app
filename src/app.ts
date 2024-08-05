import express from 'express';
import bodyParser from 'body-parser';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { getAllTasks } from './services/notionService.js';

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

getAllTasks()
.then(res => console.log("Query results:", res))
.catch(err => console.log("Error:", err))