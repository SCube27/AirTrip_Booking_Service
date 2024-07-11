const { StatusCodes } = require('http-status-codes');

const { BookingRepository } = require('../repositories/index');
const { BookingService } = require('../services/index');

const bookingService = new BookingService(new BookingRepository);

const inMemDb = {};

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

async function makePayment(req, res, next) {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];

        if(!idempotencyKey) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Idempotency key not present',
                error: {},
            });
        }

        if(inMemDb[idempotencyKey]) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Cannot retry on a Successful Payment',
                error: {},
            });
        }

        const payment = await bookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });

        inMemDb[idempotencyKey] = idempotencyKey;

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Payment Successful for the bookings',
            error: {},
            data: payment
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
    makePayment
}