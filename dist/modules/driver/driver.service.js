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
exports.getEarnings = exports.approveDriver = exports.setAvailability = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const ride_model_1 = __importDefault(require("../ride/ride.model"));
const setAvailability = (userId, isOnline) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user || user.role !== 'driver') {
        throw new Error('Driver not found');
    }
    if (!user.isApproved) {
        throw new Error('Driver not approved');
    }
    user.isOnline = isOnline;
    yield user.save();
    return user;
});
exports.setAvailability = setAvailability;
const approveDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.default.findById(driverId);
    if (!driver || driver.role !== 'driver') {
        throw new Error('Driver not found');
    }
    driver.isApproved = true;
    yield driver.save();
    return driver;
});
exports.approveDriver = approveDriver;
const getEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.default.find({ driver: driverId, status: 'completed' });
    const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    return { rides, totalEarnings };
});
exports.getEarnings = getEarnings;
