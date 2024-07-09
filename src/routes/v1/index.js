const express = require('express');

const bookingRouter = require('./bookingRoutes');

const v1Router = express.Router();

v1Router.use('/bookings', bookingRouter);

module.exports = v1Router;