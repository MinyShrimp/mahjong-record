import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";

import AddRecord from './AddRecord';
import { RankingInfo } from "../ToyBox/Interfaces";
import { roundToTwo, numberWithCommas, goServer } from "../ToyBox/Functions";
import Config from "../ToyBox/Config";

const Record = (props: any) => {
    const [modalShow, setModalShow] = useState(false);
    const [userDatas, setUserDatas] = useState<Array<RankingInfo>>([]);

    const get_users = async () => {
        try{
            const datas: any = await goServer("/api/users", "GET", Config.headers);
            if(datas.result !== 99) {
                setUserDatas(datas);
            }
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        get_users();
        props.setLabel("순위");
    }, []);

    return (
        <>
            <div className="Main-Page">
                <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>이름</th>
                            <th>우마</th>
                            <th>평우마</th>
                            <th>점수</th>
                            <th>평점</th>
                            <th>최고점</th>
                            <th>별</th>
                            <th>평별</th>
                            <th>국수</th>
                            <th>1등</th>
                            <th>2등</th>
                            <th>3등</th>
                            <th>4등</th>
                            <th>1위율</th>
                            <th>1,2위율</th>
                            <th>4위율</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userDatas.length !== 0 ? 
                            userDatas.map((user: RankingInfo, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>{ user.Name }</td>
                                        <td>{ numberWithCommas( user.Uma ) }</td>
                                        <td>{ numberWithCommas( roundToTwo( user.Uma / user.Count ) ) }</td>
                                        <td>{ numberWithCommas( user.Score ) }</td>
                                        <td>{ numberWithCommas( Math.round( user.Score / user.Count ) ) }</td>
                                        <td>{ numberWithCommas( user.MaxScore ) }</td>
                                        <td>{ numberWithCommas( user.Star ) }</td>
                                        <td>{ roundToTwo( user.Star / user.Count ) }</td>
                                        <td>{ user.Count }</td>
                                        <td>{ user.Rank_1 }</td>
                                        <td>{ user.Rank_2 }</td>
                                        <td>{ user.Rank_3 }</td>
                                        <td>{ user.Rank_4 }</td>
                                        <td>{ roundToTwo( user.Rank_1 / user.Count ) }</td>
                                        <td>{ roundToTwo( ( user.Rank_1 + user.Rank_2 ) / user.Count ) }</td>
                                        <td>{ roundToTwo( user.Rank_4 / user.Count ) }</td>
                                    </tr>
                                );
                            }): null
                        }
                    </tbody>
                </Table>
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
                    get_users();
                }}
            />
        </>
    );
};

export default Record;
