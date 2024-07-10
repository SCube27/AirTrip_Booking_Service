const axios = require('axios');

const db = require('../models/index');
const { Logger } = require('../config/index');
const { InternalServerError, BadRequestError } = require('../errors/index');
const { ServerConfig } = require('../config/index');

class BookingService { 
    constructor(bookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(data) {
        return new Promise((resolve, reject) => {
            const result = db.sequelize.transaction(async function bookingImpl(t) {
                const flight = await axios.get(`${ServerConfig.FLIGHTS_SERVICE}/api/v1/flights/${data.flightId}`);  
                const flightData = flight.data.data;
                if(data.noOfSeats > flightData.totalSeats) {
                    Logger.error("Booking failed due to attempt of booking more seats than remaining.")
                    reject(new BadRequestError('noOfSeats', "No of seats booked should be less than remaining seats"));
                }
                resolve(true);
            });
        });
    }
}

module.exports = BookingService;