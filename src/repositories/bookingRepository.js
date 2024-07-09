const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models/index');
const CrudRepository = require('./crudRepository');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository;