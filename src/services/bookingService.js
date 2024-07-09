const axios = require('axios');

const db = require('../models/index');
const { Logger } = require('../config/index');
const { InternalServerError } = require('../errors/index');
const { ServerConfig } = require('../config/index');

class BookingService { 
    constructor(bookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(data) {
        try {
            const result = db.sequelize.transaction(async function bookingImpl(t) {
                const flight = await axios.get(`${ServerConfig.FLIGHTS_SERVICE}/api/v1/flights/${data.flightId}`);
                console.log(flight.data);
                return true;
            });
        } catch (error) {
            Logger.error('Some internal server issue, cant create a booking');
            throw new InternalServerError('Something went wrong internally, booking not created');
        }
    }
}

module.exports = BookingService;