import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";

import { Info, RecentInfo } from "../ToyBox/Interfaces";
import { goServer, numberWithCommas, toStringByFormatting } from "../ToyBox/Functions";
import { Perpects } from "../ToyBox/Code";
import FixRecord from "./FixRecord";
import { QuickSortBySeat } from "../ToyBox/QuickSort";
import Config from "../ToyBox/Config";

const RecentItem = (props: any) => {
    const titles = ['東', '南', '西', '北'];
    
    const [modalShow, setModalShow] = useState(false);
    const [info, setInfo] = useState<RecentInfo>({
        index: 0, users: [], deposit: 0, link: "", update_time: new Date()
    });

    const [isAlertShow, setIsAlertShow] = useState(false);

    const changeFixedMode = () => {
        var _users: Array<Info> = [];
        props.value.users.forEach((value: Info) => {
            _users.push(JSON.parse(JSON.stringify(value)));
        });
        _users = QuickSortBySeat(_users);

        var _tmp = JSON.parse(JSON.stringify(info));
        _tmp.index = props.value.index; _tmp.users = _users;
        _tmp.deposit = props.value.deposit; _tmp.update_time = props.value.update_time;
        _tmp.link = props.value.link;
        setInfo(_tmp);
        setModalShow(true);
    }

    const deleteItem = async () => {
        try {
            var headers = JSON.parse(JSON.stringify(Config.headers));
            headers["authorization"] = sessionStorage.getItem('a_token');
            const rows: any = await goServer( "/api/records", "DELETE", headers, JSON.stringify(props.value) );
            console.log(rows);
            if(rows.result === 14) {
                window.location.reload();
            }
        } catch(e) {
            console.log(e);
        }
    }

    const clickDeleteBtn = () => {
        if( isAlertShow === false ) {
            setIsAlertShow(true);
        } else {
            console.log("DELETE")
            deleteItem();
        }
    }

    return (
        <>
        <Table bordered className="text-center mb-5">
            <thead className="bg-blue">
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
                    props.value.users.map((user: Info, index: number) => {
                        return <tr key={index}>
                            <td> {titles[user.seat]} </td>
                            <td> {user.name} </td>
                            <td> {user.ranking} </td>
                            <td> {numberWithCommas(user.score)} </td>
                            <td> {user.uma} </td>
                            <td> {user.star} </td>
                        </tr>
                    })
                }
            </tbody>
            <tfoot className="tfoot">
                {
                    isAlertShow &&
                    <tr>
                        <td colSpan={6}>
                            <Alert variant="warning" style={{ textAlign: "center" }}>
                                정말로 삭제하시겠습니까? <br></br>
                                한 번 더 누르면 삭제됩니다.
                            </Alert>
                        </td>
                    </tr>
                }
                <tr>
                    <td colSpan={6}>
                        {props.value.index} /{" "}
                        {toStringByFormatting(props.value.update_time)}
                        { props.value.link === "" ? null : <> <span> / </span> <a className="btn btn-info btn-sm" href={props.value.link} target='_blank'>패보</a> </> }
                        { 
                            props.isLogin ? 
                            <> {" / "} 
                                <Button 
                                    className="btn-warning"
                                    onClick={changeFixedMode}
                                />{" "} 
                                <Button 
                                    className="btn-danger"
                                    onClick={clickDeleteBtn}
                                />{" "} 
                                <Button 
                                    onClick={() => { setIsAlertShow(false); }}
                                />
                            </> 
                            : null 
                        }
                    </td>
                </tr>
                {props.value.deposit !== 0 ? (
                    <tr>
                        <td colSpan={6}>공탁금: {props.value.deposit}</td>
                    </tr>
                ) : null}
                {props.value.users.map((user: Info, index: number) => {
                    if (user.perpect.length === 0) {
                        return null;
                    }
                    return (
                        <tr key={index}>
                            <td colSpan={6}>
                                {user.name} ({titles[user.seat]}) : {" "}
                                { 
                                    user.perpect.split('|').map((v: string, i: number) => {
                                        const perpect = parseInt(v);
                                        return (
                                            v !== '' ?
                                            Perpects[perpect] + ( i === user.perpect.length - 2 ? "" :  " / ") :
                                            null
                                        );
                                    })
                                }
                            </td>
                        </tr>
                    );
                })}
            </tfoot>
        </Table>
        <FixRecord 
            show={modalShow}
            onHide={() => {
                setModalShow(false);
            }}
            info={info}
            setInfo={setInfo}
        />
        </>
    );
};

export default RecentItem;
