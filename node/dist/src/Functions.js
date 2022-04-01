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
exports.deleteRecord = exports.addRecord = exports.authenticateAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.getUmas = exports.isCleanData = void 0;
const Interfaces_1 = require("./Interfaces");
const jwt = require("jsonwebtoken");
const Config_1 = __importDefault(require("./Config"));
const Database_1 = __importDefault(require("./Database"));
const Quicksort_1 = require("./Quicksort");
const isCleanData = (datas, deposit) => {
    if (deposit < 0) {
        return { result: false, contents: Interfaces_1.ErrorCode["MINUS_DEPOSIT"] };
    }
    let _sum_score = deposit;
    let arr_names = datas.map((value) => value.name);
    let set_names = new Set(arr_names);
    if (arr_names.length != set_names.size) {
        return { result: false, contents: Interfaces_1.ErrorCode["DUPLICATE_NAME"] };
    }
    for (var i = 0; i < 4; i++) {
        if (datas[i].name === "") {
            return { result: false, contents: Interfaces_1.ErrorCode["EMPTY_NAME"] };
        }
        let score = datas[i].score;
        _sum_score += score;
        let star = datas[i].star;
        if (star < 0) {
            return { result: false, contents: Interfaces_1.ErrorCode["MINUS_STAR"] };
        }
        let perpect = datas[i].perpect;
        perpect.pop();
        for (var j = 0; j < perpect.length; j++) {
            let _tmp = perpect[j];
            if (_tmp < 1 || _tmp > 17) {
                return {
                    result: false,
                    contents: Interfaces_1.ErrorCode["PERPECT_OUT_OF_RANGE"],
                };
            }
        }
    }
    if (_sum_score !== 0) {
        return { result: false, contents: Interfaces_1.ErrorCode["SCORE_NOT_ZERO"] };
    }
    else {
        return { result: true, contents: Interfaces_1.ErrorCode["SUCCESS"] };
    }
};
exports.isCleanData = isCleanData;
const getUmas = (data) => {
    const scores = data.map((value) => value.score);
    const scores_count = scores.reduce((accu, curr) => {
        accu[curr] = (accu[curr] || 0) + 1;
        return accu;
    }, {});
    const result = scores.map((s) => scores_count[s]).toString();
    switch (result) {
        case "4,4,4,4":
            return [0, 0, 0, 0];
        case "3,3,3,1":
            return [10, 10, 10, -30];
        case "2,2,2,2":
            return [15, 15, -15, -15];
        case "2,2,1,1":
            return [15, 15, -10, -20];
        case "1,2,2,1":
            return [30, 0, 0, -30];
        case "1,1,2,2":
            return [20, 10, -15, -15];
    }
    return [20, 10, -10, -20];
};
exports.getUmas = getUmas;
// access token을 secret key 기반으로 생성
const generateAccessToken = (id) => {
    return jwt.sign({ id }, Config_1.default.JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, Config_1.default.JWT.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
    });
};
exports.generateRefreshToken = generateRefreshToken;
// access token의 유효성 검사
const authenticateAccessToken = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(200).json({
            code: 400,
            message: "유효하지 않은 토큰입니다.",
        });
    }
    try {
        req.body.decoded = jwt.verify(authHeader, Config_1.default.JWT.ACCESS_TOKEN_SECRET);
        next();
    }
    catch (e) {
        if (e.name === "TokenExpiredError") {
            return res.status(200).json({
                code: 419,
                message: "토큰이 만료되었습니다.",
            });
        }
        if (e.name === "JsonWebTokenError") {
            return res.status(200).json({
                code: 401,
                message: "유효하지 않은 토큰입니다.",
            });
        }
    }
};
exports.authenticateAccessToken = authenticateAccessToken;
const addRecord = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let data = body.users;
    let deposit = body.deposit;
    data = (0, Quicksort_1.QuickSort)(data);
    const plus_uma = (0, exports.getUmas)(data);
    data.forEach((value, index) => __awaiter(void 0, void 0, void 0, function* () {
        const rows = yield Database_1.default.getInstance().selectUserByUserRecord(value.name);
        let user_data = JSON.parse(JSON.stringify(rows))[0];
        if (user_data === undefined) {
            let name = value.name;
            let score = value.score;
            let rank = [0, 0, 0, 0];
            rank[index] = 1;
            let uma = Math.round(score / 1000) + plus_uma[index];
            let star = value.star;
            let sql = `"${name}", ${uma}, ${score}, ${score}, ${star}, 1, ${rank.toString()}`;
            yield Database_1.default.getInstance().insertUserByUserRecord(sql);
        }
        else {
            let id = user_data.ID;
            let score = parseInt(user_data.Score) + value.score;
            let uma = parseInt(user_data.Uma) +
                Math.round(value.score / 1000) +
                plus_uma[index];
            let maxscore = Math.max(parseInt(user_data.MaxScore), value.score);
            let now_star = value.star;
            let star = parseInt(user_data.Star) + now_star;
            let count = parseInt(user_data.Count) + 1;
            let rank_1 = index === 0
                ? parseInt(user_data.Rank_1) + 1
                : parseInt(user_data.Rank_1);
            let rank_2 = index === 1
                ? parseInt(user_data.Rank_2) + 1
                : parseInt(user_data.Rank_2);
            let rank_3 = index === 2
                ? parseInt(user_data.Rank_3) + 1
                : parseInt(user_data.Rank_3);
            let rank_4 = index === 3
                ? parseInt(user_data.Rank_4) + 1
                : parseInt(user_data.Rank_4);
            let sql = `
                    Uma=${uma}, Score=${score}, MaxScore=${maxscore}, Star=${star}, Count=${count},
                    Rank_1=${rank_1}, Rank_2=${rank_2}, Rank_3=${rank_3}, Rank_4=${rank_4}
                `;
            yield Database_1.default.getInstance().updateUserByUserRecord(id, sql);
        }
    }));
    const rows = yield Database_1.default.getInstance().getRecentIndexByIndexRecord();
    let lastIndex = JSON.parse(JSON.stringify(rows))[0].maxindex;
    let recordIndex = lastIndex !== null ? lastIndex + 1 : 1;
    let sql_data = "VALUES ";
    data.forEach((value, index) => {
        let name = value.name;
        let score = value.score;
        let ranking = index + 1;
        let seat = value.seat;
        let uma = Math.round(score / 1000) + plus_uma[index];
        let star = value.star;
        let perpect = value.perpect.join("|");
        sql_data +=
            `('${name}', ${recordIndex}, ${score}, ${ranking}, ${seat}, ${uma}, ${star}, '${perpect}'` +
                (index === 0 ? `, ${deposit})` : `, 0)`);
        sql_data += index === 3 ? ";" : ",";
    });
    yield Database_1.default.getInstance().insertIndexRecord(sql_data);
});
exports.addRecord = addRecord;
const deleteRecord = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield Database_1.default.getInstance().selectIndexRecordByRecordIndex(body.index);
    if (rows.length === 0) {
        return false;
    }
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i];
        var _rows = yield Database_1.default.getInstance().selectUserByUserRecord(row.Name);
        if (_rows.length === 0) {
            return false;
        }
        var item = _rows[0];
        const ID = item.ID;
        item.Count -= 1;
        item.Score -= row.Score;
        item.Uma -= row.Uma;
        item.Star -= row.Star;
        switch (row.Ranking) {
            case 1:
                item.Rank_1 -= 1;
                break;
            case 2:
                item.Rank_2 -= 1;
                break;
            case 3:
                item.Rank_3 -= 1;
                break;
            case 4:
                item.Rank_4 -= 1;
                break;
        }
        const sql = `
            Uma=${item.Uma}, Score=${item.Score}, MaxScore=${item.MaxScore}, Star=${item.Star}, Count=${item.Count},
            Rank_1=${item.Rank_1}, Rank_2=${item.Rank_2}, Rank_3=${item.Rank_3}, Rank_4=${item.Rank_4}
        `;
        yield Database_1.default.getInstance().updateUserByUserRecord(ID, sql);
    }
    yield Database_1.default.getInstance().deleteIndexRecordByRecordIndex(body.index);
    return true;
});
exports.deleteRecord = deleteRecord;
