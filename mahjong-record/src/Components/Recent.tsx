import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Container, Nav, Table, Button } from "react-bootstrap";

import Config from "../ToyBox/Config";
import { RecentUserInfo, RecentInfo } from '../ToyBox/Interfaces';
import { QuickSort } from '../ToyBox/QuickSort';
import { goServer, numberWithCommas, toStringByFormatting } from "../ToyBox/Functions";
import { Perpects } from "../ToyBox/Code";

import AddRecord from './AddRecord';

const Recent = () => {
    const titles = ['東', '南', '西', '北'];
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
    
                    var _tmp: Array<RecentUserInfo> = [];
                    for(var i = 0; i < 4; i++) {
                        var _perpects = perpects[i].split('|'); _perpects.pop();
    
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
    }, []);

    return (
        <>
            <Navbar bg="light" fixed="top">
                <Container>
                    <Navbar.Brand>최근 기록</Navbar.Brand>
                    <Nav className="me-auto">
                    </Nav>

                    {
                        //<Nav className="justify-content-end">
                        //    <Nav.Link href="#">로그인</Nav.Link>
                        //</Nav>
                    }
                </Container>
            </Navbar>

            <div className="Main-Page">
                {
                    datas.map((value, index) => {
                        return(
                            <Table bordered className="text-center mb-5" key={index}>
                                <thead className='bg-blue'>
                                    <tr>
                                        <th>風</th>
                                        <th>이름</th>
                                        <th>순위</th>
                                        <th>점수</th>
                                        <th>우마</th>
                                        <th>별</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        value.users.map((user: RecentUserInfo, index: number) => {
                                            return(
                                                <tr key={index}>
                                                    <td> { titles[user.seat] } </td>
                                                    <td> { user.name } </td>
                                                    <td> { user.ranking } </td>
                                                    <td> { numberWithCommas(user.score) } </td>
                                                    <td> { user.uma } </td>
                                                    <td> { user.star } </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                                <tfoot className="tfoot">
                                    <tr>
                                        <td colSpan={6}>
                                            { value.index } / { toStringByFormatting(value.update_time) }
                                        </td>
                                    </tr>
                                    {
                                        value.deposit !== 0 ? 
                                        <tr>
                                            <td colSpan={6}>
                                                공탁금: { value.deposit }
                                            </td>
                                        </tr> : null
                                    }
                                    {
                                        value.users.map((user: RecentUserInfo, index: number) => {
                                            if( user.perpect.length === 0 ) {
                                                return null;
                                            }
                                            return user.perpect.map((value: number, index: number) => {
                                                return (
                                                    <tr key={index}>
                                                        <td colSpan={6}>
                                                            {user.name} ({titles[user.seat]}) : { Perpects[value] }
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })
                                    }
                                </tfoot>
                            </Table>
                        );
                    })
                }
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
        </>
    );
};

export default Recent;