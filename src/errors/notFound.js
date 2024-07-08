const { StatusCodes } = require("http-status-codes");
const BaseError = require("./baseError");

class NotFoundError extends BaseError {
    constructor(data, message) {
        super(`NotFoundError`, StatusCodes.NOT_FOUND, message, {
            data
        });
    }
}

module.exports = NotFoundError;