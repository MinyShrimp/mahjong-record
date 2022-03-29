import { createConnection, Connection } from "mysql";
import Config from "./Config";

export default class Database {
    private static instance: Database;
    private connection: Connection;

    private constructor() {
        this.connection = createConnection({
            host:     Config.MySQL.ip,
            user:     Config.MySQL.id,
            port:     Config.MySQL.port,
            password: Config.MySQL.pwd,
            database: Config.MySQL.database
        });
        this.connection.connect();
    }

    public static getInstance() {
        return this.instance || (this.instance = new this())
    }

    public select(callback: Function) {
        let sql = 'select * from IndexRecord;';
        this.connection.query(sql, callback);
    }

    private _promise = async (sql: string, str: string) => {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, res) => {
                if(err) { reject(Error(str)); }
                else { resolve(res); }
            });
        });
    }

    //////////////////////////////////////////////////
    // UserRecord
    //////////////////////////////////////////////////
    public findUserByUserRecord(name: string) {
        let sql = `
            SELECT ID, Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord 
            WHERE Name = "${name}";
        `;
        return this._promise(sql, "find user error");
    }

    public updateUserByUserRecord(id: string, data: string) {
        let sql = `
            UPDATE UserRecord
            SET ${data}
            WHERE ID = ${id};
        `;
        return this._promise(sql, "update user error");
    }

    public insertUserByUserRecord(data: string) {
        let sql = `
            INSERT INTO 
            UserRecord(Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4) 
            VALUES(${data});
        `;
        return this._promise(sql, "insert user error");
    }

    public selectAllByUserRecord() {
        let sql = `
            SELECT Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord
            ORDER BY Uma DESC;
        `;
        return this._promise(sql, "select user error");
    }

    //////////////////////////////////////////////////
    // IndexRecord
    //////////////////////////////////////////////////
    public getRecentIndexByIndexRecord() {
        let sql = 'SELECT MAX(RecordIndex) AS maxindex FROM IndexRecord;';
        return this._promise(sql, "select index error");
    }

    public insertIndexRecord(data: string) {
        let sql = `
            INSERT INTO 
            IndexRecord(Name, RecordIndex, Score, Ranking, Seat, Uma, Star, Perpect, Deposit) 
            ${data};
        `;
        return this._promise(sql, "insert index error");
    }

    public getRecentAllByIndexRecord() {
        let sql = `
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
            ORDER BY RecordIndex DESC;
        `;
        return this._promise(sql, "select all index error");
    }
}