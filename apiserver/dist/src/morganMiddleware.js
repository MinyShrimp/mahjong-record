"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const logDir = __dirname + "/../logs";
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const infoTransport = new winston_1.default.transports.File({
    filename: "info.log",
    dirname: logDir,
    level: "info",
});
const errorTransport = new winston_1.default.transports.File({
    filename: "error.log",
    dirname: logDir,
    level: "error",
});
const logger = winston_1.default.createLogger({
    transports: [infoTransport, errorTransport],
});
exports.logger = logger;
const stream = {
    write: (message) => {
        logger.info(message);
    },
};
exports.stream = stream;
