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

app.post('/api/record', async (req: Request, res: Response) => {
    try{
        let body = req.body;
        let data: Array<Info> = body.slice(0, 4);
        let deposit = body.slice(4)[0];
        deposit = deposit === '' ? "0" : deposit;
    
        let data_test: Test = isCleanData(data, deposit);
        data = QuickSort(data);

        const plus_uma = [ 20, 10, -10, -20 ];
        
        if(data_test.result) {
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
            //let recordIndex = 0;

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

app.get('/api/records',async (req: Request, res: Response) => {
    try {
        const rows = await Database.getInstance().getRecentAllByIndexRecord();
        res.send(JSON.stringify(rows));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const data = await Database.getInstance().selectAllByUserRecord();
        res.send(JSON.stringify(data));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    }
});

app.listen('8001', () => {});