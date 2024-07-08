const { StatusCodes } = require("http-status-codes");

async function serverStartup(req, res, next) {
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Flights Service is Live!",
        errors: {},
        status: 200,
        data: {}
    });
}

module.exports = {
    serverStartup
}