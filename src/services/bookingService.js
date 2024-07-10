const axios = require('axios');

const db = require('../models/index');
const { Logger } = require('../config/index');
const { InternalServerError, BadRequestError } = require('../errors/index');
const { ServerConfig } = require('../config/index');

class BookingService { 
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    async createBooking(data) {
        const transaction = await db.sequelize.transaction();
        try {
            const flight = await axios.get(`${ServerConfig.FLIGHTS_SERVICE}/api/v1/flights/${data.flightId}`);  
            
            const flightData = flight.data.data;

            // checking for the seats requirement
            if(data.noOfSeats > flightData.totalSeats) {
                Logger.error("Booking failed due to attempt of booking more seats than remaining.")
                throw new BadRequestError('noOfSeats', "No of seats booked should be less than remaining seats")
            }

            // calculating the billing amount for the number of seats booked
            const totalBillingAmount = data.noOfSeats * flightData.price;
            
            const bookingPayload = { ...data, totalCost: totalBillingAmount };
            const booking = await this.bookingRepository.createBooking(bookingPayload, transaction);

            await axios.patch(`${ServerConfig.FLIGHTS_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
                seats: data.noOfSeats
            });

            await transaction.commit();
            return booking;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = BookingService;