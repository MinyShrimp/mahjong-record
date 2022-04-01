import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";

import Config from "../ToyBox/Config";
import { Info, RecentInfo } from '../ToyBox/Interfaces';
import { QuickSort } from '../ToyBox/QuickSort';
import { goServer } from "../ToyBox/Functions";

import AddRecord from './AddRecord';
import RecentItem from './RecentItem';

const Recent = (props: any) => {
    const [ modalShow, setModalShow ] = useState(false);
    const [ datas, setDatas ] = useState<Array<RecentInfo>>([]);

    const { id } = useParams();

    const get_recents = async () => {
        try {
            const rows: any = await goServer(`/api/records/${id}`, "GET", Config.headers);
            if( rows.result !== 99 ) {
                let result: Array<RecentInfo> = [];
                rows.forEach((value: any) => {
                    const index      = value.RecordIndex;
                    const deposit    = value.Deposit;
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
                        var _perpects = perpects[i].split('|');
                        if( _perpects[0] === '' ) { _perpects.pop(); }
    
                        _tmp.push({
                            name:        names[i],
                            perpect:     _perpects,
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

    useEffect(()=>{
        get_recents();
        props.setLabel("최근 기록");
    }, []);

    return (
        <div className="Main-Container">
            <div className="Main-Page">
                { datas.map((value, index) => <RecentItem key={index} value={value} isLogin={props.isLogin} />) }
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