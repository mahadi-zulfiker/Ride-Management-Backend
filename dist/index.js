"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const driver_routes_1 = __importDefault(require("./modules/driver/driver.routes"));
const ride_routes_1 = __importDefault(require("./modules/ride/ride.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.default)();
// Routes
app.use('/auth', auth_route_1.default);
app.use('/users', user_routes_1.default);
app.use('/drivers', driver_routes_1.default);
app.use('/rides', ride_routes_1.default);
// Error Handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
});
