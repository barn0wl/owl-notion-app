import express from 'express';
import bodyParser from 'body-parser';
import { getTempRecurr } from './index';
const app = express();
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
getTempRecurr();
