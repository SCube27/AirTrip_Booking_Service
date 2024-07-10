const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models/index');
const CrudRepository = require('./crudRepository');
const { InternalServerError } = require('../errors');
const { Logger } = require('../config');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        try {
            const response = await Booking.create(data, {transaction: transaction});
            return response;
        } catch (error) {
            Logger.error('Some internal problem occured, booking not created!');
            throw new InternalServerError(`Some internal problem occured can't create a booking`);
        }
    }
}

module.exports = BookingRepository;