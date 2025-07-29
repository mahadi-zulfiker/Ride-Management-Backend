"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRides = exports.getRiderHistory = exports.updateRideStatus = exports.acceptRide = exports.cancelRide = exports.requestRide = void 0;
const ride_model_1 = __importDefault(require("./ride.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const requestRide = (riderId, pickup, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const rider = yield user_model_1.default.findById(riderId);
    if (!rider || rider.isBlocked) {
        throw new Error('Invalid or blocked rider');
    }
    const ride = yield ride_model_1.default.create({
        rider: riderId,
        pickupLocation: pickup,
        destinationLocation: destination,
        statusHistory: [{ status: 'requested' }]
    });
    return ride;
});
exports.requestRide = requestRide;
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.default.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }
    if (ride.rider.toString() !== riderId) {
        throw new Error('Unauthorized');
    }
    if (ride.status !== 'requested') {
        throw new Error('Cannot cancel ride after acceptance');
    }
    const timeDiff = (new Date().getTime() - ride.createdAt.getTime()) / 1000 / 60;
    if (timeDiff > 5) {
        throw new Error('Cancellation window expired');
    }
    ride.status = 'canceled';
    ride.statusHistory.push({ status: 'canceled' });
    yield ride.save();
    return ride;
});
exports.cancelRide = cancelRide;
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.default.findById(rideId);
    if (!ride || ride.status !== 'requested') {
        throw new Error('Ride not available');
    }
    const driver = yield user_model_1.default.findById(driverId);
    if (!driver || driver.role !== 'driver' || !driver.isApproved || !driver.isOnline) {
        throw new Error('Invalid or unavailable driver');
    }
    const activeRide = yield ride_model_1.default.findOne({ driver: driverId, status: { $in: ['accepted', 'picked_up', 'in_transit'] } });
    if (activeRide) {
        throw new Error('Driver already has an active ride');
    }
    ride.driver = new (require('mongoose').Types.ObjectId)(driverId);
    ride.status = 'accepted';
    ride.statusHistory.push({ status: 'accepted' });
    yield ride.save();
    return ride;
});
exports.acceptRide = acceptRide;
const updateRideStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validStatuses = ['picked_up', 'in_transit', 'completed'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }
    const ride = yield ride_model_1.default.findById(rideId);
    if (!ride || ((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
        throw new Error('Ride not found or unauthorized');
    }
    if (ride.status === 'canceled' || ride.status === 'completed') {
        throw new Error('Ride cannot be updated');
    }
    ride.status = status;
    ride.statusHistory.push({ status });
    if (status === 'completed') {
        ride.fare = Math.random() * 100;
    }
    yield ride.save();
    return ride;
});
exports.updateRideStatus = updateRideStatus;
const getRiderHistory = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.default.find({ rider: riderId }).populate('driver');
});
exports.getRiderHistory = getRiderHistory;
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.default.find().populate('rider driver');
});
exports.getAllRides = getAllRides;
