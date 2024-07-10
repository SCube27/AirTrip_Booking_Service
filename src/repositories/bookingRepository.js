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

    async get(data, transaction) {
        const response = await this.model.findByPk(data, {transaction: transaction});

        if(!response) {
            Logger.error(`The data has not been found in database for the ID ${data}`);
            throw new NotFoundError(response, "Requested data is not found!");
        }

        return response;
    }

    async update(id, data, transaction) {
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, {transaction: transaction});

        return response;
    }
}

module.exports = BookingRepository;