import express, { Request, Response } from "express";
import { createConnection } from "mysql";
import cors from "cors";
import bodyParser from "body-parser";
import { Info, Test, ErrorCode } from "./Interfaces";
import { isCleanData } from "./Functions";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = createConnection({
    host: '172.17.0.2',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'Mahjong'
});
connection.connect();

app.get('/', (req: Request, res: Response) => {
    let sql = 'select * from IndexRecord;';
    connection.query(sql, (err: any, rows: any) => {
        if (err) {
            res.send('Opps. Error happened\n');
        } else {
            res.send(rows);
        }
    });
});

app.post('/api/insertRecord', (req: Request, res: Response) => {
    let body = req.body;

    try{
        let data: Array<Info> = body.slice(0, 4);
        let deposit = body.slice(4)[0];
    
        let data_test: Test = isCleanData(data, deposit);
        
        if(data_test.result) {
            // TODO
        }
    
        res.send(JSON.stringify({result: data_test.contents}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({result: ErrorCode["UNDEFIND_ERROR"]}));
    } finally {
        
    }
});

app.get('/api/test', (req: Request, res: Response) => {
    res.send(req.query)
});

app.listen('8001', () => {});