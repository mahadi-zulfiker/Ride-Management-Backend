"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    destinationLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'canceled'],
        default: 'requested'
    },
    fare: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    statusHistory: [{
            status: String,
            timestamp: { type: Date, default: Date.now }
        }]
});
exports.default = (0, mongoose_1.model)('Ride', rideSchema);
