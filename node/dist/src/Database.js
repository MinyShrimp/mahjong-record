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
const mysql_1 = require("mysql");
const Config_1 = __importDefault(require("./Config"));
class Database {
    constructor() {
        this._promise = (sql, str) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        reject(Error(str));
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });
        this.connection = (0, mysql_1.createConnection)({
            host: Config_1.default.MySQL.ip,
            user: Config_1.default.MySQL.id,
            port: Config_1.default.MySQL.port,
            password: Config_1.default.MySQL.pwd,
            database: Config_1.default.MySQL.database
        });
        this.connection.connect();
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
    select(callback) {
        const sql = 'select * from IndexRecord;';
        this.connection.query(sql, callback);
    }
    //////////////////////////////////////////////////
    // UserRecord
    //////////////////////////////////////////////////
    selectUserByUserRecord(name) {
        const sql = `
            SELECT ID, Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord 
            WHERE Name = "${name}";
        `;
        return this._promise(sql, "find user error");
    }
    updateUserByUserRecord(id, data) {
        const sql = `
            UPDATE UserRecord
            SET ${data}
            WHERE ID = ${id};
        `;
        return this._promise(sql, "update user error");
    }
    insertUserByUserRecord(data) {
        const sql = `
            INSERT INTO 
            UserRecord(Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4) 
            VALUES(${data});
        `;
        return this._promise(sql, "insert user error");
    }
    selectAllByUserRecord() {
        const sql = `
            SELECT Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord
            WHERE Count != 0
            ORDER BY Uma DESC;
        `;
        return this._promise(sql, "select user error");
    }
    selectAllNameByUserRecord() {
        const sql = `
            SELECT Name 
            FROM UserRecord
            WHERE Count != 0
            ORDER BY UpdateTime DESC, Name;
        `;
        return this._promise(sql, "select user name error");
    }
    //////////////////////////////////////////////////
    // IndexRecord
    //////////////////////////////////////////////////
    getRecentIndexByIndexRecord() {
        const sql = 'SELECT MAX(RecordIndex) AS maxindex FROM IndexRecord;';
        return this._promise(sql, "select index error");
    }
    insertIndexRecord(data) {
        const sql = `
            INSERT INTO 
            IndexRecord(Name, RecordIndex, Score, Ranking, Seat, Uma, Star, Perpect, Deposit) 
            ${data};
        `;
        return this._promise(sql, "insert index error");
    }
    getRecentAllByIndexRecord(page) {
        const range = 10;
        const start = (page - 1) * range;
        const sql = `
            SELECT 
                b.RecordIndex, a.Names, a.Rankings, a.Scores, 
                a.Seats, a.Perpects, a.Umas, a.Stars, 
                b.UpdateTime, b.Deposit
            FROM IndexRecord AS b
            JOIN (
                SELECT 
                    RecordIndex, GROUP_CONCAT(Name) AS Names, 
                    GROUP_CONCAT(Ranking) AS Rankings, GROUP_CONCAT(Score) AS Scores, 
                    GROUP_CONCAT(Seat) AS Seats, GROUP_CONCAT(Perpect) AS Perpects,
                    GROUP_CONCAT(Uma) AS Umas, GROUP_CONCAT(Star) AS Stars
                FROM IndexRecord
                GROUP BY RecordIndex
            ) AS a
            ON a.RecordIndex=b.RecordIndex
            WHERE Ranking=1
            ORDER BY RecordIndex DESC
            LIMIT ${range} OFFSET ${start};
        `;
        return this._promise(sql, "select all index error");
    }
    selectIndexRecordByRecordIndex(index) {
        const sql = `
            SELECT * FROM IndexRecord
            WHERE RecordIndex=${index};
        `;
        return this._promise(sql, "delete index error");
    }
    deleteIndexRecordByRecordIndex(index) {
        const sql = `
            DELETE FROM IndexRecord
            WHERE RecordIndex=${index};
        `;
        return this._promise(sql, "delete index error");
    }
    //////////////////////////////////////////////////
    // Autho
    //////////////////////////////////////////////////
    selectByAutho(name) {
        const sql = `
            SELECT * 
            FROM Autho
            WHERE ID="${name}";
        `;
        return this._promise(sql, "select autho error");
    }
}
exports.default = Database;
