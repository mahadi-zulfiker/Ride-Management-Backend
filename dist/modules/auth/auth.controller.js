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
exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const logger_1 = require("../../utils/logger");
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.register)(req.body);
        res.status(201).json({ message: 'User registered', user });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, token } = yield (0, auth_service_1.login)(email, password);
        res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.loginController = loginController;
