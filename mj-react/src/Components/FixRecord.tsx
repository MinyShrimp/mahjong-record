import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import PerpectHolder from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Config        from "../ToyBox/Config";
import { PerpectInfo, Info, RecentInfo } from "../ToyBox/Interfaces";
import { goServer }  from "../ToyBox/Functions";
import Creatable     from "react-select/creatable";

const FixRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];

    const [perpectID, setPerpectID]         = useState<number>(0);
    const [perpectInfos, setPerpectInfos]   = useState<PerpectInfo[]>([]);

    const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
    const [warningReason, setWarningReason] = useState<string>("");

    const [names, setNames]                 = useState<Array<string>>([]);
    const [isPluses, setIsPluses]           = useState<Array<boolean>>([ true, true, true, true ]);

    const init_data = () => {
        setIsShowWarning(false);
        setWarningReason("");
        getNamesInServer();
        setIsPluses([ true, true, true, true ]);

        var _tmp: Array<PerpectInfo> = [], _count: number = 0;
        var _isplus: Array<boolean> = [];
        props.info.users.forEach((user: Info) => {
            let perpects = user.perpect.split('|'); perpects.pop();
            perpects.forEach((p: string) => {
                _tmp.push({
                    id: _count++, name: user.name, select_id: parseInt(p)
                });
            })
            _isplus.push(user.score >= 0);
        });
        setPerpectInfos(_tmp);
        setPerpectID(_count);
        setIsPluses(_isplus);
    }

    const getNamesInServer = async () => {
        try {
            const rows: any = await goServer( "/api/names", "GET", Config.headers );
            if(rows.result !== 99) {
                setNames(rows.map((row: any) => row.Name));
            } else {
                console.log('error');
            }
        } catch(e) {
            console.log(e);
        }
    }

    const getNames = () => {
        var _result: Array<any> = [];
        names.forEach((_v: string, _i:number) => {
            if( _v !== '' ) {
                _result.push({ "value": _v, "label": _v })
            }
        });
        return _result;
    }

    const make_post_data = (): RecentInfo => {
        var users = [...props.info.users];
        users.forEach((user: any) => { user.perpect = ""; });

        perpectInfos.forEach((value) => {
            var _index = users.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { users[_index].perpect += value.select_id + '|'; }
        });

        return {
            index: props.info.index, users: users, deposit: props.info.deposit, link: props.info.link, update_time: new Date()
        };
    }

    const post_data = async () => {
        console.log(make_post_data())
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
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Form>
                    {
                        props.info.users.map((value: Info, index: number) => {
                            return (
                                <Row className="mb-3" key={index}>
                                    <Col xs={1} className="form-title input-pd"> {titles[index]} </Col>
                                    <Col>
                                        <Creatable 
                                            onChange={(e: any) => {
                                                var _info = JSON.parse(JSON.stringify(props.info));
                                                _info.users[index].name = e.value;
                                                props.setInfo(_info);
                                            }}
                                            placeholder="이름" 
                                            options={getNames()}
                                            defaultValue={{ "value": value.name, "label": value.name }}
                                        />
                                    </Col>
                                    <Col xs={4} className="input-pd">
                                    <div className="input-group">
                                           <div className="input-group-btn">
                                               {
                                                   isPluses[index] ? 
                                                   <button 
                                                       className="btn btn-info"
                                                       onClick={() => { 
                                                           var _tmp = [...isPluses];
                                                           _tmp[index] = false;
                                                           setIsPluses(_tmp); 

                                                           var _info = JSON.parse(JSON.stringify(props.info));
                                                           _info.users[index].score *= _info.users[index].score < 0 ? 1 : -1;
                                                           props.setInfo(_info);
                                                       }}
                                                   >＋</button> :
                                                   <button 
                                                       className="btn btn-danger"
                                                       onClick={() => { 
                                                           var _tmp = [...isPluses];
                                                           _tmp[index] = true;
                                                           setIsPluses(_tmp); 

                                                           var _info = JSON.parse(JSON.stringify(props.info));
                                                           _info.users[index].score *= _info.users[index].score > 0 ? 1 : -1;
                                                           props.setInfo(_info);
                                                       }}
                                                   >－</button>
                                               }
                                           </div>
                                           <Form.Control  
                                                placeholder="점수" 
                                                onChange={(e) => {
                                                    var _info = JSON.parse(JSON.stringify(props.info));
                                                    _info.users[index].score = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                    props.setInfo(_info);

                                                    var _tmp = [...isPluses];
                                                    _tmp[index] = _info.users[index].score > 0;
                                                    setIsPluses(_tmp); 
                                                }}
                                                value={value.score === 0 ? '' : value.score}
                                                type="number"
                                            />
                                        </div> 
                                    </Col>
                                    <Col xs={2} className="input-pd">
                                        <Form.Control 
                                            placeholder="별" 
                                            onChange={(e) => {
                                                var _info = JSON.parse(JSON.stringify(props.info));
                                                _info.users[index].star = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                props.setInfo(_info);
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
                        <Col className="input-pd">
                            <Form.Control 
                                placeholder="공탁금" 
                                onChange={(e) => {
                                    var _info = JSON.parse(JSON.stringify(props.info));
                                    _info.deposit = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    props.setInfo(_info);
                                }}
                                type="number"
                                value={props.info.deposit === 0 ? '' : props.info.deposit}
                                min="0"
                            />
                        </Col>
                        <Col className="input-pd">
                            <Form.Control 
                                placeholder="패보 URL" 
                                onChange={(e) => {
                                    var _info = JSON.parse(JSON.stringify(props.info));
                                    _info.link = e.target.value;
                                    props.setInfo(_info);
                                }}
                                value={props.info.link}
                            />
                        </Col>
                        <Col xs={2} className="input-pd">
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
