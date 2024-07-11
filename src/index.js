const express = require('express');
const bodyParser = require('body-parser');

const { ServerConfig } = require("./config/index");
const apiRouter = require('./routes');
const { errorHandler } = require("./utils/index");
const Crons = require('./utils/cronJob');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(ServerConfig.PORT, (req, res) => {
    console.log(`Server started at PORT ${ServerConfig.PORT}`);
    Crons();
});
