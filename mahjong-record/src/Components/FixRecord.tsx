import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import PerpectHolder from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Config        from "../ToyBox/Config";
import { PerpectInfo, Info, RecentInfo } from "../ToyBox/Interfaces";
import { goServer } from "../ToyBox/Functions";

const FixRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];

    const [perpectID, setPerpectID] = useState<number>(0);
    const [perpectInfos, setPerpectInfos] = useState<PerpectInfo[]>([]);

    const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
    const [warningReason, setWarningReason] = useState<string>("");

    const [names, setNames] = useState([]);

    const init_data = () => {
        setIsShowWarning(false);
        setWarningReason("");
        get_names();

        var _tmp: Array<PerpectInfo> = [], _count: number = 0;
        props.info.users.forEach((user: Info) => {
            user.perpect.forEach((p: number) => {
                _tmp.push({
                    id: _count++, name: user.name, select_id: p
                });
            })
        });
        setPerpectInfos(_tmp);
        setPerpectID(_count);
    }

    const get_names = async () => {
        try {
            const rows: any = await goServer( "/api/names", "GET", Config.headers );
            if(rows.result !== 99) {
                setNames(rows.map((row: any) => row.Name));
            } else {
                console.log('error')
            }
        } catch(e) {
            console.log(e);
        }
    }

    const make_post_data = (): RecentInfo => {
        var users = [...props.info.users];
        users.forEach((user: any) => { user.perpect = [] });

        perpectInfos.forEach((value) => {
            var _index = users.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { users[_index].perpect.push( value.select_id ); }
        });

        return {
            index: props.info.index, users: users, deposit: props.info.deposit, update_time: new Date()
        };
    }

    const post_data = async () => {
        try {
            var headers = JSON.parse(JSON.stringify(Config.headers));
            headers["authorization"] = sessionStorage.getItem('a_token');
            const rows: any = await goServer( "/api/records", "PUT", headers, JSON.stringify(make_post_data()) );
            const code: number = rows.result;
            console.log(rows);
            if( code !== 0 ) {
                setIsShowWarning(true);
                setWarningReason(ErrorCode[code]);
            } else {
                props.onHide();
                window.location.reload();
            }
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => { 
        if(props.show) { init_data(); }
    }, [ props.show ]);
    
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Form>
                    {
                        props.info.users.map((value: Info, index: number) => {
                            return (
                                <Row className="mb-3" key={index}>
                                    <Col xs={1} className="form-title"> {titles[index]} </Col>
                                    <Col>
                                        <Form.Control 
                                            placeholder="이름" 
                                            onChange={(e) => {
                                                var _tmp: RecentInfo = JSON.parse(JSON.stringify(props.info));
                                                _tmp.users[index].name = e.target.value;
                                                props.setInfo(_tmp);
                                            }}
                                            value={value.name}
                                            autoComplete="on"
                                            list="names"
                                        />

                                        <datalist id="names">
                                            {
                                                names.map((value, index) => {
                                                    return (
                                                        <option value={value} key={index} />
                                                    );
                                                })
                                            }
                                        </datalist>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Control 
                                            placeholder="점수" 
                                            onChange={(e) => {
                                                var _tmp: RecentInfo = JSON.parse(JSON.stringify(props.info));
                                                _tmp.users[index].score = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                props.setInfo(_tmp);
                                            }}
                                            value={value.score === 0 ? '' : value.score}
                                            type="number"
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Control 
                                            placeholder="별" 
                                            onChange={(e) => {
                                                var _tmp: RecentInfo = JSON.parse(JSON.stringify(props.info));
                                                _tmp.users[index].star = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                props.setInfo(_tmp);
                                            }}
                                            value={value.star === 0 ? '' : value.star}
                                            type="number"
                                            min="0"
                                        />
                                    </Col>
                                </Row>
                            );
                        })
                    }

                    <PerpectHolder 
                        names={ props.info.users.map((value: Info) => value.name) }
                        perpectInfos={perpectInfos}
                        setPerpectInfos={setPerpectInfos}
                    />

                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                placeholder="공탁금" 
                                onChange={(e) => {
                                    var _tmp: RecentInfo = JSON.parse(JSON.stringify(props.info));
                                    _tmp.deposit = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    props.setInfo(_tmp);
                                }}
                                type="number"
                                value={props.info.deposit}
                                min="0"
                            />
                        </Col>
                        <Col xs={2}>
                            <Button 
                                style={{width: "100%"}} 
                                onClick={() => {
                                    setPerpectInfos( [...perpectInfos, { id: perpectID, name: props.info.users[0].name, select_id: -1 }] );
                                    setPerpectID(perpectID + 1);
                                }}
                            > 역만 </Button>
                        </Col>
                    </Row>
                    {
                        isShowWarning &&
                        <Row>
                            <Alert variant="warning" style={{ textAlign: "center" }}>
                                { warningReason }
                            </Alert>
                        </Row>
                    }
                    
                    <Row>
                        <Col style={{textAlign: "center"}}>
                            <Button 
                                style={{width: "300px"}}
                                onClick={post_data}
                            >수정</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FixRecord;
