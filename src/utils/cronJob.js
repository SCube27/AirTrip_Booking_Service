const cron = require('node-cron');

const {BookingService} = require('../services/index');
const {BookingRepository} = require('../repositories/index');

const bookingService = new BookingService(new BookingRepository());

function scheduleCrons() {
    cron.schedule('*/30 * * * *', async () => {
        const response = await bookingService.cancelOldBookings();
    });
}

module.exports = scheduleCrons;