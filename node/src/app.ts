import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { Info, Test, ErrorCode } from "./Interfaces";
import { isCleanData }           from "./Functions";
import Config                    from "./Config";
import Database                  from "./Database";
import { QuickSort }             from "./Quicksort";

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

app.use('/api/:id', (req: Request, res: Response, next) => {
    if( req.get('token') !== Config.token ) {
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    } else {
        next();
    }
});

app.post('/api/insertRecord', (req: Request, res: Response) => {
    try{
        let body = req.body;
        let data: Array<Info> = body.slice(0, 4);
        let deposit = body.slice(4)[0];
        deposit = deposit === '' ? "0" : deposit;
    
        let data_test: Test = isCleanData(data, deposit);
        data = QuickSort(data);
        
        if(data_test.result) {
            data.forEach((value: Info, index: number) => {
                Database.getInstance().findUserByUserRecord(value.name, (err: any, rows: any) => {
                    let user_data = JSON.parse(JSON.stringify(rows))[0];

                    if(user_data === undefined) {
                        let name        = value.name;
                        let score       = parseInt(value.score);
                        let rank        = [0, 0, 0, 0];
                        rank[index]     = 1;
                        let uma         = Math.round( score / 1000 );
                        let star        = value.star === '' ? 0 : parseInt(value.star);
                        
                        let sql = `"${name}", ${uma}, ${score}, ${score}, ${star}, 1, ${rank.toString()}`;

                        Database.getInstance().insertUserByUserRecord(sql, (e: any) => { console.log("insert", e); })
                    } else {
                        let _score = parseInt(value.score);

                        let id       = user_data.ID;
                        let score    = parseInt(user_data.Score) + _score;
                        let uma      = parseInt(user_data.Uma) + Math.round( _score / 1000 );
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

                        Database.getInstance().updateUserByUserRecord(id, sql, (e: any) => { console.log("update", e); })
                    }
                });
            });
            
            Database.getInstance().getRecentIndexByIndexRecord((err: any, rows: any) => {
                let lastIndex = JSON.parse(JSON.stringify(rows))[0].maxindex;
                let recordIndex = lastIndex !== null ? 1 : lastIndex + 1;

                let sql_data = "VALUES ";
                data.forEach((value: Info, index: number) => {
                    let name        = value.name;
                    let score       = parseInt(value.score);
                    let ranking     = index + 1;
                    let seat        = value.seat;
                    let uma         = Math.round( score / 1000 );
                    let star        = value.star === '' ? 0 : parseInt(value.star);
                    let perpect     = value.perpect;
                
                    sql_data += 
                        `('${name}', ${recordIndex}, ${score}, ${ranking}, ${seat}, ${uma}, ${star}, '${perpect}'` +
                        (index === 0 ? `, ${deposit})`: `, 0)`);
                    sql_data += index === 3 ? ';' : ',';
                });
                
                Database.getInstance().insertIndexRecord(sql_data, (e: any) => { console.log(e); });
            });
        }
    
        res.send(JSON.stringify({result: data_test.contents}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    } finally {
        
    }
});

app.get('/api/getUsers', async (req: Request, res: Response) => {
    try {
        const data = await Database.getInstance().selectAllByUserRecord();
        res.send(JSON.stringify(data));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.get('/api/test', (req: Request, res: Response) => {
    res.send(req.query)
});

app.listen('8001', () => {});