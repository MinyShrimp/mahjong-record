import express, { Request, Response } from "express";
import { Info, Test, ErrorCode } from "./Interfaces";
const jwt = require("jsonwebtoken");
import Config from "./Config";

export const isCleanData = (datas: Array<Info>, deposit: string) : Test => {
    
    let _tmp = deposit === '' ? 0 : parseInt(deposit);
    if( isNaN(_tmp) ) {
        return { result: false, contents: ErrorCode["ERROR_DEPOSIT"] };
    } else if( _tmp < 0 ) {
        return { result: false, contents: ErrorCode["MINUS_DEPOSIT"] };
    }

    let _sum_score: number = _tmp;

    let arr_names = datas.map((value) => value.name);
    let set_names = new Set(arr_names);
    if( arr_names.length != set_names.size ) {
        return { result: false, contents: ErrorCode["DUPLICATE_NAME"] };
    }

    for (var i = 0; i < 4; i++) {
        if( datas[i].name === '' ) { 
            return { result: false, contents: ErrorCode["EMPTY_NAME"] };
        }

        let score = parseInt( datas[i].score );
        if( isNaN(score) ) { 
            return { result: false, contents: ErrorCode["EMPTY_SCORE"] };
        } else { 
            _sum_score += score; 
        }

        let star = datas[i].star === '' ? 0 : parseInt( datas[i].star );
        if( isNaN(star) ) { 
            return { result: false, contents: ErrorCode["ERROR_STAR"] };
        } else if( star < 0 ) {
            return { result: false, contents: ErrorCode["MINUS_STAR"] };
        }

        let perpect = datas[i].perpect.split('|');
        perpect.pop();
        for( var j = 0; j < perpect.length; j++ ) {
            let _tmp = parseInt(perpect[j]);
            if( isNaN( _tmp ) ) {
                return { result: false, contents: ErrorCode["ERROR_PERPECT"] };
            }

            if( _tmp < 1 || _tmp > 17 ) {
                return { result: false, contents: ErrorCode["PERPECT_OUT_OF_RANGE"] };
            }
        }
    }

    if( _sum_score !== 0 ) {
        return { result: false, contents: ErrorCode["SCORE_NOT_ZERO"] };
    } else {
        return { result: true, contents: ErrorCode["SUCCESS"] };
    }
}

export const getUmas = ( data: Array<Info> ) => {
    const scores = data.map((value: Info) => parseInt(value.score))
    const scores_count = scores.reduce((accu: any, curr: any) => { 
        accu[curr] = (accu[curr] || 0)+1; 
        return accu;
    }, {});
    const result = scores.map(s => scores_count[s]).toString();

    switch( result ) {
        case '4,4,4,4':
            return [0, 0, 0, 0];
        case '3,3,3,1':
            return [10, 10, 10, -30];
        case '2,2,2,2':
            return [15, 15, -15, -15];
        case '2,2,1,1':
            return [15, 15, -10, -20];
        case '1,2,2,1':
            return [30, 0, 0, -30];
        case '1,1,2,2':
            return [20, 10, -15, -15];
    }
    return [20, 10, -10, -20];
}

// access token을 secret key 기반으로 생성
export const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, Config.JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

// refersh token을 secret key  기반으로 생성
export const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, Config.JWT.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
    });
};

// // access token의 유효성 검사
export const authenticateAccessToken = (req: Request, res: Response, next: any) => {
    let authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(200).json({
            code: 400,
            message: '유효하지 않은 토큰입니다.'
        });
    }

    try {
        req.body.decoded = jwt.verify(authHeader, Config.JWT.ACCESS_TOKEN_SECRET);
        next();
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
};