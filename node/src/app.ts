import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
import * as CryptoJS from "crypto-js";

import { Info, Test, ErrorCode } from "./Interfaces";
import Config                    from "./Config";
import Database                  from "./Database";
import { QuickSort }             from "./Quicksort";
import { isCleanData, getUmas, generateAccessToken, generateRefreshToken, authenticateAccessToken }  from "./Functions";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    let sql = 'select * from IndexRecord;';
    Database.getInstance().select((err: any, rows: any) => {
        if (err) {
            res.send('Opps. Error happened\n');
        } else {
            res.send(rows);
        }
    });
});

//////////////////////////////////////////////////
// /api
//////////////////////////////////////////////////
app.use('/api/:id', (req: Request, res: Response, next) => {
    if( req.get('token') !== Config.token ) {
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    } else {
        next();
    }
});

//////////////////////////////////////////////////
// /api/record
//////////////////////////////////////////////////
app.post('/api/records', async (req: Request, res: Response) => {
    try{
        let body = req.body;
        let data: Array<Info> = body.slice(0, 4);
        let deposit = body.slice(4)[0];
        deposit = deposit === '' ? "0" : deposit;
    
        let data_test: Test = isCleanData(data, deposit);
        
        if(data_test.result) {
            data = QuickSort(data);
            const plus_uma = getUmas(data);

            data.forEach(async (value: Info, index: number) => {
                const rows = await Database.getInstance().findUserByUserRecord(value.name);
                let user_data = JSON.parse(JSON.stringify(rows))[0];

                if(user_data === undefined) {
                    let name        = value.name;
                    let score       = parseInt(value.score);
                    let rank        = [0, 0, 0, 0];
                    rank[index]     = 1;
                    let uma         = Math.round( score / 1000 ) + plus_uma[index];
                    let star        = value.star === '' ? 0 : parseInt(value.star);
                    
                    let sql = `"${name}", ${uma}, ${score}, ${score}, ${star}, 1, ${rank.toString()}`;

                    await Database.getInstance().insertUserByUserRecord(sql);
                } else {
                    let _score = parseInt(value.score);

                    let id       = user_data.ID;
                    let score    = parseInt(user_data.Score) + _score;
                    let uma      = parseInt(user_data.Uma) + Math.round( _score / 1000 ) + plus_uma[index];
                    let maxscore = Math.max( parseInt(user_data.MaxScore), _score );
                    let now_star = value.star === '' ? 0 : parseInt(value.star);
                    let star     = parseInt(user_data.Star) + now_star;
                    let count    = parseInt(user_data.Count) + 1;
                    let rank_1   = index === 0 ? parseInt(user_data.Rank_1) + 1 : parseInt(user_data.Rank_1);
                    let rank_2   = index === 1 ? parseInt(user_data.Rank_2) + 1 : parseInt(user_data.Rank_2);
                    let rank_3   = index === 2 ? parseInt(user_data.Rank_3) + 1 : parseInt(user_data.Rank_3);
                    let rank_4   = index === 3 ? parseInt(user_data.Rank_4) + 1 : parseInt(user_data.Rank_4);

                    let sql = `
                        Uma=${uma}, Score=${score}, MaxScore=${maxscore}, Star=${star}, Count=${count},
                        Rank_1=${rank_1}, Rank_2=${rank_2}, Rank_3=${rank_3}, Rank_4=${rank_4}
                    `;

                    await Database.getInstance().updateUserByUserRecord(id, sql);
                }
            });
            
            const rows = await Database.getInstance().getRecentIndexByIndexRecord();
            let lastIndex = JSON.parse(JSON.stringify(rows))[0].maxindex;
            let recordIndex = lastIndex !== null ? lastIndex + 1 : 1;
            
            let sql_data = "VALUES ";
            data.forEach((value: Info, index: number) => {
                let name        = value.name;
                let score       = parseInt(value.score);
                let ranking     = index + 1;
                let seat        = value.seat;
                let uma         = Math.round( score / 1000 ) + plus_uma[index];
                let star        = value.star === '' ? 0 : parseInt(value.star);
                let perpect     = value.perpect;
            
                sql_data += 
                    `('${name}', ${recordIndex}, ${score}, ${ranking}, ${seat}, ${uma}, ${star}, '${perpect}'` +
                    (index === 0 ? `, ${deposit})`: `, 0)`);
                sql_data += index === 3 ? ';' : ',';
            });
            
            await Database.getInstance().insertIndexRecord(sql_data);
        }
    
        res.send(JSON.stringify({result: data_test.contents}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.get('/api/records/:id', async (req: Request, res: Response) => {
    try {
        const rows = await Database.getInstance().getRecentAllByIndexRecord(parseInt(req.params.id));
        res.send(JSON.stringify(rows));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.delete('/api/records', async (req: Request, res: Response) => {

});

//////////////////////////////////////////////////
// /api/users
//////////////////////////////////////////////////
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const data = await Database.getInstance().selectAllByUserRecord();
        res.send(JSON.stringify(data));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

//////////////////////////////////////////////////
// /api/names
//////////////////////////////////////////////////
app.get('/api/names', async (req: Request, res: Response) => {
    try {
        const data = await Database.getInstance().selectAllNameByUserRecord();
        res.send(JSON.stringify(data));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

//////////////////////////////////////////////////
// /api/root/autho
//////////////////////////////////////////////////
app.get('/api/root/autho', authenticateAccessToken, (req: Request, res: Response) => {
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
    if (!refreshToken) return res.sendStatus(200).json({ code: 400 });

    try {
        jwt.verify( refreshToken, Config.JWT.REFRESH_TOKEN_SECRET );
        const accessToken = generateAccessToken(req.body.id);
        res.json({ accessToken: accessToken, code: 200 });
    } catch(e: any) {
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
app.post('/api/root/login', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const client_id = body.id;
        const client_pwd = CryptoJS.enc.Base64.parse(body.pwd).toString();
        const rows: any = await Database.getInstance().selectByAutho(body.id);
        if(rows.length !== 0) {
           const pwd = rows[0].PWD;
           const salt = rows[0].SALT;

           const a_token = generateAccessToken(client_id);
           const r_token = generateRefreshToken(client_id);

           if ( CryptoJS.SHA512(salt + client_pwd).toString() === pwd ) {
               res.send(
                   JSON.stringify({
                       result: ErrorCode["LOGIN_SUCCESS"], 
                       token: { a_token, r_token }
                    })
                );
           } else {
               res.send(JSON.stringify({result: ErrorCode["LOGIN_FAILED_NOT_MATCH_PWD"]}));
           }
        } else {
            res.send(JSON.stringify({result: ErrorCode["LOGIN_FAILED_NOT_FOUND_ID"]}));
        }
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.listen('8001', () => {});