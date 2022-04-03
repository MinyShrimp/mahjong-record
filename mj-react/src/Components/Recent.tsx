import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "react-bootstrap";
import QueryString from 'qs';

import Config from "../ToyBox/Config";
import { Info, RecentInfo } from '../ToyBox/Interfaces';
import { QuickSort } from '../ToyBox/QuickSort';
import { goServer } from "../ToyBox/Functions";

import AddRecord from './AddRecord';
import RecentItem from './RecentItem';

const Recent = (props: any) => {
    const [ modalShow, setModalShow ] = useState(false);
    const [ datas, setDatas ] = useState<Array<RecentInfo>>([]);
    const [ pages, setPages ] = useState<number>(0);
    const location = useLocation();

    const getRecents = async (page: number) => {
        try {
            const rows: any = await goServer(`/api/records?page=${page}`, "GET", Config.headers);
            if( rows.result !== 99 ) {
                let result: Array<RecentInfo> = [];
                rows.forEach((value: any) => {
                    const index      = value.RecordIndex;
                    const deposit    = value.Deposit;
                    const link       = value.Link;
                    const updateTime = value.UpdateTime;
    
                    const names      = value.Names.split(',');
                    const perpects   = value.Perpects.split(',');
                    const rankings   = value.Rankings.split(',');
                    const scores     = value.Scores.split(',');
                    const seats      = value.Seats.split(',');
                    const stars      = value.Stars.split(',');
                    const umas       = value.Umas.split(',');
    
                    var _tmp: Array<Info> = [];
                    for(var i = 0; i < 4; i++) {
                        _tmp.push({
                            name:        names[i],
                            perpect:     perpects[i],
                            ranking:     parseInt(rankings[i]),
                            score:       parseInt(scores[i]),
                            seat:        parseInt(seats[i]),
                            star:        parseInt(stars[i]),
                            uma:         parseInt(umas[i])
                        });
                    }
                    _tmp = QuickSort(_tmp);
                    result.push({
                        index:       index,
                        users:       _tmp,
                        deposit:     deposit,
                        link:        link,
                        update_time: new Date(updateTime)
                    });
                })
                setDatas(result);
            } else {
                setDatas([]);
            }
        } catch(e) {
            setDatas([]);
            console.log(e);
        }
    }

    const getPages = async () => {
        try {
            const rows: any = await goServer(`/api/pages`, "GET", Config.headers);
            if( rows.result !== 99 ) {
                setPages( Math.floor((rows[0].Count - 1) / 10) + 1 );
            } else {
                setPages(0);
            }
        } catch(e) {
            setPages(0);
            console.log(e);
        }
    }

    const PageComponent = () => {
        const result = [];

        const queryData: any = QueryString.parse(location.search, { ignoreQueryPrefix: true });
        const nowPage = queryData.page;

        var start =  1 + Math.floor((nowPage - 1) / 10) * 10;
        var end   = 10 + Math.floor((nowPage - 1) / 10) * 10;
        if( end > pages ) { end = pages; }

        if( start !== 1 ) {
            result.push(
                <li className="page-item" key={start-10}>
                    <Link className="page-link" to={`/recent?page=${start-10}`} onClick={() => { getRecents(start-10);}}>{"<<"}</Link>
                </li>
            );
        }
        for(let i = start; i <= end; i++) {
            result.push(
                <li className="page-item" key={i}>
                    <Link className="page-link" to={`/recent?page=${i}`} onClick={() => { getRecents(i);}}>{i}</Link>
                </li>
            );
        }
        if( end + 1 <= pages ) {
            result.push(
                <li className="page-item" key={end+1}>
                    <Link className="page-link" to={`/recent?page=${end+1}`} onClick={() => { getRecents(end+1);}}>{">>"}</Link>
                </li>
            );
        }
        return result;
    }

    useEffect(()=>{
        const queryData: any = QueryString.parse(location.search, { ignoreQueryPrefix: true });
        getRecents(queryData.page);
        getPages();
        props.setLabel("최근 기록");
    }, []);

    return (
        <div className="Main-Container">
            <div className="Main-Page">
                { datas.map((value, index) => <RecentItem key={index} value={value} isLogin={props.isLogin} />) }

                <nav>
                    <ul className="pagination justify-content-center">
                        { PageComponent() }
                    </ul>
                </nav>
            </div>

            <Button 
                className="btn-fixed"
                onClick={() => {
                    setModalShow(true);
                }}
            >+</Button>
            <AddRecord 
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                }}
            />
        </div>
    );
};

export default Recent;