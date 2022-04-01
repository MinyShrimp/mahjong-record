import express, { Request, Response } from "express";
import { Info, Test, ErrorCode } from "./Interfaces";
const jwt = require("jsonwebtoken");
import Config from "./Config";
import Database from "./Database";
import { QuickSort } from "./Quicksort";

export const isCleanData = (datas: Array<Info>, deposit: number): Test => {
    if (deposit < 0) {
        return { result: false, contents: ErrorCode["MINUS_DEPOSIT"] };
    }

    let _sum_score: number = deposit;

    let arr_names = datas.map((value) => value.name);
    let set_names = new Set(arr_names);
    if (arr_names.length != set_names.size) {
        return { result: false, contents: ErrorCode["DUPLICATE_NAME"] };
    }

    for (var i = 0; i < 4; i++) {
        if (datas[i].name === "") {
            return { result: false, contents: ErrorCode["EMPTY_NAME"] };
        }

        let score: number = datas[i].score;
        _sum_score += score;

        let star = datas[i].star;
        if (star < 0) {
            return { result: false, contents: ErrorCode["MINUS_STAR"] };
        }

        let perpect = datas[i].perpect;
        perpect.pop();
        for (var j = 0; j < perpect.length; j++) {
            let _tmp = perpect[j];
            if (_tmp < 1 || _tmp > 17) {
                return {
                    result: false,
                    contents: ErrorCode["PERPECT_OUT_OF_RANGE"],
                };
            }
        }
    }

    if (_sum_score !== 0) {
        return { result: false, contents: ErrorCode["SCORE_NOT_ZERO"] };
    } else {
        return { result: true, contents: ErrorCode["SUCCESS"] };
    }
};

export const getUmas = (data: Array<Info>) => {
    const scores = data.map((value: Info) => value.score);
    const scores_count = scores.reduce((accu: any, curr: any) => {
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

// access token의 유효성 검사
export const authenticateAccessToken = (
    req: Request,
    res: Response,
    next: any
) => {
    let authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(200).json({
            code: 400,
            message: "유효하지 않은 토큰입니다.",
        });
    }

    try {
        req.body.decoded = jwt.verify(
            authHeader,
            Config.JWT.ACCESS_TOKEN_SECRET
        );
        next();
    } catch (e: any) {
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

export const addRecord = async (body: any) => {
    let data: Array<Info> = body.users;
    let deposit: number = body.deposit;

    data = QuickSort(data);
    const plus_uma = getUmas(data);

    data.forEach(async (value: Info, index: number) => {
        const rows = await Database.getInstance().selectUserByUserRecord( value.name );
        let user_data = JSON.parse(JSON.stringify(rows))[0];

        if (user_data === undefined) {
            let name = value.name;
            let score = value.score;
            let rank = [0, 0, 0, 0];
            rank[index] = 1;
            let uma = Math.round(score / 1000) + plus_uma[index];
            let star = value.star;

            let sql = `"${name}", ${uma}, ${score}, ${score}, ${star}, 1, ${rank.toString()}`;

            await Database.getInstance().insertUserByUserRecord(sql);
        } else {
            let id = user_data.ID;
            let score = parseInt(user_data.Score) + value.score;
            let uma =
                parseInt(user_data.Uma) +
                Math.round(value.score / 1000) +
                plus_uma[index];
            let maxscore = Math.max(
                parseInt(user_data.MaxScore),
                value.score
            );
            let now_star = value.star;
            let star = parseInt(user_data.Star) + now_star;
            let count = parseInt(user_data.Count) + 1;
            let rank_1 =
                index === 0
                    ? parseInt(user_data.Rank_1) + 1
                    : parseInt(user_data.Rank_1);
            let rank_2 =
                index === 1
                    ? parseInt(user_data.Rank_2) + 1
                    : parseInt(user_data.Rank_2);
            let rank_3 =
                index === 2
                    ? parseInt(user_data.Rank_3) + 1
                    : parseInt(user_data.Rank_3);
            let rank_4 =
                index === 3
                    ? parseInt(user_data.Rank_4) + 1
                    : parseInt(user_data.Rank_4);

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

    await Database.getInstance().insertIndexRecord(sql_data);
};

export const deleteRecord = async (body: any) => {
    const rows: any = await Database.getInstance().selectIndexRecordByRecordIndex(body.index);
    if (rows.length === 0) { return false; }
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i];

        var _rows: any = await Database.getInstance().selectUserByUserRecord(row.Name);
        if (_rows.length === 0) { return false; }
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

        await Database.getInstance().updateUserByUserRecord(ID, sql);
    }
    await Database.getInstance().deleteIndexRecordByRecordIndex(body.index);

    return true;
};
