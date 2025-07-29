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
exports.blockUserController = exports.getUsers = void 0;
const user_service_1 = require("./user.service");
const logger_1 = require("../../utils/logger");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
const blockUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { block } = req.body;
        const user = yield (0, user_service_1.blockUser)(id, block);
        res.status(200).json({ message: `User ${block ? 'blocked' : 'unblocked'}`, user });
    }
    catch (error) {
        logger_1.logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
});
exports.blockUserController = blockUserController;
