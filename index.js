const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

const dbConnection = require('./config/db');
dbConnection();

app.use(express.json());
app.get('/', (req,res) => res.send('Welcome!'));

const routes = ['users','auth','posts','comments'];
routes.forEach(route => app.use('/'+route, require('./routes/'+route)));

app.use(require('./middleware/validation'));

app.listen(PORT, () => console.log(`Server listening on 0.0.0.0:${PORT}`));

module.exports = app;
