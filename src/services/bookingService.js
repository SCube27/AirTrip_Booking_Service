const axios = require('axios');

const db = require('../models/index');
const { Logger } = require('../config/index');
const { InternalServerError, BadRequestError } = require('../errors/index');
const { ServerConfig } = require('../config/index');
const { Enums } = require('../utils/index');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

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

            // blocking the corresponding seats in the flight
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

    async makePayment(data) {
        const transaction = await db.sequelize.transaction();
        try {
            const bookingDetails = await this.bookingRepository.get(data.bookingId, transaction);

            if(bookingDetails.status == CANCELLED) {
                Logger.error('The booking has been deleted, since the time limit expired');
                throw new BadRequestError('Cancelled Booking', "The booking time expired, hence cancelled");
            }

            const bookingTime = new Date(bookingDetails.createdAt);
            const currentTime = new Date();

            if(currentTime - bookingTime > 300000) { 
                await this.cancelBooking(data.bookingId);
                Logger.error('The booking has been deleted, since the time limit expired');
                throw new BadRequestError('TimeOut', "The booking time expired!");
            } 

            if(bookingDetails.totalCost != data.totalCost) {
                Logger.error('The payment cost doesnt match the billing cost');
                throw new BadRequestError('totalCost', "The amount of the payment doesn't match the billing amount");
            }

            if(bookingDetails.userId != data.userId) {
                Logger.error('The userId associated with the payment doesnt match the userId of booking');
                throw new BadRequestError('userId', "The User corresponding to the booking doesn't match");
            }

            // assuming the booking is done without any problem
            await this.bookingRepository.update(data.bookingId, {status: BOOKED}, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            Logger.error('Some internal server issue occured during booking process');
            throw error;
        }
    }

    async cancelBooking(bookingId) {
        const transaction = await db.sequelize.transaction();
        try {
            const bookingDetails = await this.bookingRepository.get(bookingId, transaction);
            
            if(bookingDetails.status == CANCELLED) {
                await transaction.commit();
                return true;
            }

            await axios.patch(`${ServerConfig.FLIGHTS_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
                seats: bookingDetails.noOfSeats,
                dec: 0
            });
            await this.bookingRepository.update(bookingId, {status: CANCELLED}, transaction);
            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            Logger.error('Some internal server issue occured, cant cancel booking');
            throw error;
        }
    }
}

module.exports = BookingService;