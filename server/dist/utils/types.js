"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomApiError = void 0;
class CustomApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'CustomApiError';
        // Ensures proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, CustomApiError.prototype);
    }
}
exports.CustomApiError = CustomApiError;
