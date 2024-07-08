class BaseError extends Error {
    constructor(name, statusCode, description, details) {
        super(description);
        this.name = name;
        this.statusCode = statusCode;
        // Error.captureStackTrace(this);
        this.details = details;
    }
}

module.exports = BaseError;