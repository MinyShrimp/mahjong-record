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

    //////////////////////////////////////////////////
    // UserRecord
    //////////////////////////////////////////////////
    public findUserByUserRecord(name: string, callback: Function) {
        let sql = `
            SELECT ID, Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord 
            WHERE Name = "${name}";
        `;
        this.connection.query(sql, callback);
    }

    public updateUserByUserRecord(id: string, data: string, callback: Function) {
        let sql = `
            UPDATE UserRecord
            SET ${data}
            WHERE ID = ${id};
        `;
        this.connection.query(sql, callback);
    }

    public insertUserByUserRecord(data: string, callback: Function) {
        let sql = `
            INSERT INTO 
            UserRecord(Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4) 
            VALUES(${data});
        `;
        this.connection.query(sql, callback);
    }

    public selectAllByUserRecord() {
        let sql = `
            SELECT
            Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 
            FROM UserRecord
            ORDER BY Uma DESC;
        `;
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, res) => {
                if(err) { reject(Error("select error")); }
                else { resolve(res); }
            });
        });
    }

    //////////////////////////////////////////////////
    // IndexRecord
    //////////////////////////////////////////////////
    public getRecentIndexByIndexRecord(callback: Function) {
        let sql = 'SELECT MAX(RecordIndex) AS maxindex FROM IndexRecord;';
        this.connection.query(sql, callback);
    }

    public insertIndexRecord(data: string, callback: Function) {
        let sql = `
            INSERT INTO 
            IndexRecord(Name, RecordIndex, Score, Ranking, Seat, Uma, Star, Perpect, Deposit) 
            ${data};
        `;
        this.connection.query(sql, callback);
    }
}