import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button, Table, Form } from "react-bootstrap";
import "./Record.css";

import AddRecord from './AddRecord';
import { RankingInfo } from "../ToyBox/Interfaces";
import { roundToTwo, numberWithCommas }  from "../ToyBox/Functions";
import Config          from "../ToyBox/Config";

const Record = () => {
    const [modalShow, setModalShow] = useState(false);
    const [userDatas, setUserDatas] = useState<Array<RankingInfo>>([]);

    const get_users = async () => {
        var res: Response = await fetch(
            Config.serverIP + "/api/users",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": Config.token
                }
            }
        );

        if( res.ok ) {
            let datas = await res.json();
            setUserDatas(datas);
        } else {
            console.error(res);
        }
    }

    useEffect(() => {
        get_users();
    }, []);

    return (
        <>
            <Navbar bg="light" fixed="top">
                <Container>
                    <Navbar.Brand>순위</Navbar.Brand>
                    <Nav className="me-auto">
                        <Form.Check label={`20국 이상`} className="nav-item" id="check" />
                    </Nav>

                    <Nav className="justify-content-end">
                        <Nav.Link href="#">로그인</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className="Record-Main-Page">
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
                            })
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
