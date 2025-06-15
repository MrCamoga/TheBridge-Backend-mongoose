const express = require('express');

const { PORT } = require('./config/');

const app = express();

app.use(express.json());

app.get('/', (req,res) => res.send('Welcome!'));

const routes = ['users','auth','posts','comments'];

routes.forEach(route => app.use('/'+route, require('./routes/'+route)));

app.listen(PORT, () => console.log(`Server listening on 0.0.0.0:${PORT}`));
