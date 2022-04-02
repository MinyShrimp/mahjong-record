"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const jwt = require("jsonwebtoken");
const CryptoJS = __importStar(require("crypto-js"));
const morganMiddleware_1 = require("./morganMiddleware");
const Interfaces_1 = require("./Interfaces");
const Config_1 = __importDefault(require("./Config"));
const Database_1 = __importDefault(require("./Database"));
const Functions_1 = require("./Functions");
const app = (0, express_1.default)();
const cor = (0, cors_1.default)({ origin: '*', optionsSuccessStatus: 200 });
app.use(cor);
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined', { stream: morganMiddleware_1.stream }));
app.get('/helloworld/:id', (req, res) => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const id = req.params.id;
    const pwd = CryptoJS.SHA512(salt + CryptoJS.SHA512(id).toString()).toString();
    res.send(JSON.stringify({ salt: salt, pwd: pwd }));
});
//////////////////////////////////////////////////
// /api
//////////////////////////////////////////////////
app.use('/api/:id', (req, res, next) => {
    if (req.get('token') !== Config_1.default.token) {
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
    else {
        next();
    }
});
//////////////////////////////////////////////////
// /api/record
//////////////////////////////////////////////////
app.post('/api/records', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body.users;
        let deposit = req.body.deposit;
        let data_test = (0, Functions_1.isCleanData)(data, deposit);
        if (data_test.result) {
            yield (0, Functions_1.addRecord)(req.body);
        }
        res.send(JSON.stringify({ result: data_test.contents }));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
app.get('/api/records/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield Database_1.default.getInstance().getRecentAllByIndexRecord(parseInt(req.params.id));
        res.send(JSON.stringify(rows));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
app.delete('/api/records', Functions_1.authenticateAccessToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Functions_1.deleteRecord)(req.body);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["DELETE_SUCCESS"] }));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
app.put('/api/records', Functions_1.authenticateAccessToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body.users;
        let deposit = req.body.deposit;
        let data_test = (0, Functions_1.isCleanData)(data, deposit);
        if (data_test.result) {
            const fl = yield (0, Functions_1.deleteRecord)(req.body);
            if (fl) {
                yield (0, Functions_1.addRecord)(req.body);
            }
        }
        res.send(JSON.stringify({ result: data_test.contents }));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
//////////////////////////////////////////////////
// /api/users
//////////////////////////////////////////////////
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Database_1.default.getInstance().selectAllByUserRecord();
        res.send(JSON.stringify(data));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
//////////////////////////////////////////////////
// /api/names
//////////////////////////////////////////////////
app.get('/api/names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Database_1.default.getInstance().selectAllNameByUserRecord();
        res.send(JSON.stringify(data));
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
//////////////////////////////////////////////////
// /api/root/autho
//////////////////////////////////////////////////
app.get('/api/root/autho', Functions_1.authenticateAccessToken, (req, res) => {
    const decoded = req.body.decoded;
    return res.status(200).json({
        code: 200,
        message: '토큰은 정상입니다.',
        data: {
            decoded: decoded
        }
    });
});
//////////////////////////////////////////////////
// /api/root/refresh
//////////////////////////////////////////////////
app.post("/api/root/refresh", (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken)
        return res.sendStatus(200).json({ code: 400 });
    try {
        jwt.verify(refreshToken, Config_1.default.JWT.REFRESH_TOKEN_SECRET);
        const accessToken = (0, Functions_1.generateAccessToken)(req.body.id);
        res.json({ accessToken: accessToken, code: 200 });
    }
    catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(200).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        if (e.name === 'JsonWebTokenError') {
            return res.status(200).json({
                code: 401,
                message: '유효하지 않은 토큰입니다.'
            });
        }
    }
});
//////////////////////////////////////////////////
// /api/root/login
//////////////////////////////////////////////////
app.post('/api/root/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const client_id = body.id;
        const client_pwd = CryptoJS.enc.Base64.parse(body.pwd).toString();
        const rows = yield Database_1.default.getInstance().selectByAutho(body.id);
        if (rows.length !== 0) {
            const pwd = rows[0].PWD;
            const salt = rows[0].SALT;
            const a_token = (0, Functions_1.generateAccessToken)(client_id);
            const r_token = (0, Functions_1.generateRefreshToken)(client_id);
            if (CryptoJS.SHA512(salt + client_pwd).toString() === pwd) {
                res.send(JSON.stringify({
                    result: Interfaces_1.ErrorCode["LOGIN_SUCCESS"],
                    token: { a_token, r_token }
                }));
            }
            else {
                res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["LOGIN_FAILED_NOT_MATCH_PWD"] }));
            }
        }
        else {
            res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["LOGIN_FAILED_NOT_FOUND_ID"] }));
        }
    }
    catch (e) {
        console.log(e);
        res.send(JSON.stringify({ result: Interfaces_1.ErrorCode["UNDEFIND_ERROR"] }));
    }
}));
app.listen('8001', () => { });
