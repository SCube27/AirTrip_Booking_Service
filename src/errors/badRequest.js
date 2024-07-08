const BaseError = require("./baseError");
const { StatusCodes } = require('http-status-codes');

class BadRequestError extends BaseError {
    constructor(badpropertyName, details) {
        super('BadRequest', StatusCodes.BAD_REQUEST, `Invalid structure for ${badpropertyName}`, details);
    }
}

module.exports = BadRequestError; 