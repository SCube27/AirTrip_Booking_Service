const express = require('express');

const v1Router = require('./v1');
const { InfoController } = require('../controllers/index');

const apiRouter = express.Router();

apiRouter.get('/info', InfoController.serverStartup);

apiRouter.use('/v1', v1Router);

module.exports = apiRouter;