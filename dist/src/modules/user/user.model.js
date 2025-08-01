"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'rider', 'driver'], required: true },
    isBlocked: { type: Boolean, default: false },
    vehicleInfo: {
        type: { type: String },
        licensePlate: { type: String }
    },
    isApproved: { type: Boolean, default: true },
    isOnline: { type: Boolean, default: false }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
