import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const jwt = require("jsonwebtoken");
import * as CryptoJS from "crypto-js";

import { Info, Test, ErrorCode } from "./Interfaces";
import Config                    from "./Config";
import Database                  from "./Database";
import { QuickSort }             from "./Quicksort";
import { isCleanData, getUmas, generateAccessToken, generateRefreshToken, authenticateAccessToken, deleteRecord, addRecord }  from "./Functions";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/helloworld/:id', (req: Request, res: Response) => {
    console.log(req);
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const id  = req.params.id;
    const pwd = CryptoJS.SHA512( salt + CryptoJS.SHA512(id).toString() ).toString();
    res.send(JSON.stringify({ salt: salt, pwd: pwd }));
})

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
        let data: Array<Info> = req.body.users;
        let deposit: number = req.body.deposit;

        let data_test: Test = isCleanData(data, deposit);

        if (data_test.result) {
            await addRecord(req.body);
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

app.delete('/api/records', authenticateAccessToken, async (req: Request, res: Response) => {
    try {
        deleteRecord(req.body);
        res.send(JSON.stringify({result: ErrorCode["DELETE_SUCCESS"]}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.put('/api/records', authenticateAccessToken, async (req: Request, res: Response) => {
    try {
        let data: Array<Info> = req.body.users;
        let deposit: number = req.body.deposit;

        let data_test: Test = isCleanData(data, deposit);

        if (data_test.result) {
            const fl = await deleteRecord(req.body);
            if(fl) {
                await addRecord(req.body);
            }
        }

        res.send(JSON.stringify({result: data_test.contents}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
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