const express = require('express');

const { BookingController } = require('../../controllers/index');

const bookingRouter = express.Router();

bookingRouter.post('/', BookingController.createBooking);

module.exports = bookingRouter;