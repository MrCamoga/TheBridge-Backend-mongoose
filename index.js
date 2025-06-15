const express = require('express');

const { PORT } = require('./config/');

const app = express();

app.use(express.json());

app.get('/', (req,res) => res.send('Welcome!'));

app.listen(PORT, () => console.log(`Server listening on 0.0.0.0:${PORT}`));
