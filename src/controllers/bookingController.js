const { StatusCodes } = require('http-status-codes');

const { BookingRepository } = require('../repositories/index');
const { BookingService } = require('../services/index');

const bookingService = new BookingService(new BookingRepository);

async function createBooking(req, res, next) {
    try {
        const booking = await bookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Created a new booking for the given details',
            error: {},
            data: booking
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
}