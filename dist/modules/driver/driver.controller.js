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
exports.getEarningsController = exports.approveDriverController = exports.setAvailabilityController = void 0;
const driver_service_1 = require("./driver.service");
const logger_1 = require("../../utils/logger");
const setAvailabilityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isOnline } = req.body;
        const user = yield (0, driver_service_1.setAvailability)(req.user.id, isOnline);
        res.status(200).json({ message: 'Availability updated', user });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.setAvailabilityController = setAvailabilityController;
const approveDriverController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const driver = yield (0, driver_service_1.approveDriver)(id);
        res.status(200).json({ message: 'Driver approved', driver });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.approveDriverController = approveDriverController;
const getEarningsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const earnings = yield (0, driver_service_1.getEarnings)(req.user.id);
        res.status(200).json(earnings);
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.getEarningsController = getEarningsController;
