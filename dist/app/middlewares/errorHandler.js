"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    const response = {
        message: err.message || "An error occurred",
        success: false,
        error: err,
    };
    if (err.name === "ValidationError") {
        response.message = "Validation failed";
    }
    res.status(400).json(response);
}
