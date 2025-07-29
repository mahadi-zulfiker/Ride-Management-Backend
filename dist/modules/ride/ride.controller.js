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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRidesController = exports.getRiderHistoryController = exports.updateRideStatusController = exports.acceptRideController = exports.cancelRideController = exports.requestRideController = void 0;
const ride_service_1 = require("./ride.service");
const logger_1 = require("../../utils/logger");
const requestRideController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pickup, destination } = req.body;
        const ride = yield (0, ride_service_1.requestRide)(req.user.id, pickup, destination);
        res.status(201).json({ message: 'Ride requested', ride });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.requestRideController = requestRideController;
const cancelRideController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ride = yield (0, ride_service_1.cancelRide)(id, req.user.id);
        res.status(200).json({ message: 'Ride canceled', ride });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.cancelRideController = cancelRideController;
const acceptRideController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ride = yield (0, ride_service_1.acceptRide)(id, req.user.id);
        res.status(200).json({ message: 'Ride accepted', ride });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.acceptRideController = acceptRideController;
const updateRideStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ride = yield (0, ride_service_1.updateRideStatus)(id, req.user.id, status);
        res.status(200).json({ message: 'Ride status updated', ride });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.updateRideStatusController = updateRideStatusController;
const getRiderHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield (0, ride_service_1.getRiderHistory)(req.user.id);
        res.status(200).json(rides);
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.getRiderHistoryController = getRiderHistoryController;
const getAllRidesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield (0, ride_service_1.getAllRides)();
        res.status(200).json(rides);
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.getAllRidesController = getAllRidesController;
