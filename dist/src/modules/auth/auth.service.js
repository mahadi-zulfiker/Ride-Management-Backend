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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../user/user.model"));
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role, vehicleInfo } = data;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const userData = { email, password: hashedPassword, name, role };
    if (role === 'driver' && vehicleInfo) {
        userData.vehicleInfo = vehicleInfo;
        userData.isApproved = false;
        userData.isOnline = false;
    }
    const user = yield user_model_1.default.create(userData);
    return user;
});
exports.register = register;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    if (user.role === 'driver' && !user.isApproved) {
        throw new Error('Driver not approved');
    }
    if (user.isBlocked) {
        throw new Error('Account is blocked');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
});
exports.login = login;
