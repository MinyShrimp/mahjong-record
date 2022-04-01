import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import PerpectHolder from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Config        from "../ToyBox/Config";
import { PerpectInfo, Info, RecentInfo } from "../ToyBox/Interfaces";
import { goServer } from "../ToyBox/Functions";
import Select       from "react-select";

const AddRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];

    const [perpectID, setPerpectID] = useState<number>(0);
    const [perpectInfos, setPerpectInfos] = useState<PerpectInfo[]>([]);

    const normal_infos = [
        { seat: 0, name: "", score: 0, star: 0, perpect: [], ranking: 0, uma: 0 },
        { seat: 1, name: "", score: 0, star: 0, perpect: [], ranking: 0, uma: 0 },
        { seat: 2, name: "", score: 0, star: 0, perpect: [], ranking: 0, uma: 0 },
        { seat: 3, name: "", score: 0, star: 0, perpect: [], ranking: 0, uma: 0 },
    ];

    const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
    const [warningReason, setWarningReason] = useState<string>("");

    const [infos, setInfos]         = useState<Info[]>(normal_infos);
    const [deposit, setDeposit]     = useState<number>(0);
    const [names, setNames]         = useState<Array<string>>([]);
    const [isPluses, setIsPluses] = useState<Array<boolean>>([ true, true, true, true ]);

    const init_data = () => {
        setInfos(normal_infos);
        setPerpectInfos([]);
        setIsShowWarning(false);
        setWarningReason("");
        setDeposit(0);
        setIsPluses([ true, true, true, true ]);
        get_names();
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
        var _tmp = [...infos];
        _tmp.forEach((item  : any) => { item.perpect = []; });
        perpectInfos.forEach((value) => {
            var _index = _tmp.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { _tmp[_index].perpect.push( value.select_id ); }
        });
        setInfos(_tmp);
        return {
            index: 0, users: infos, deposit: deposit, update_time: new Date()
        };
    }

    const post_data = async () => {
        try {
            const rows: any = await goServer( "/api/records", "POST", Config.headers, JSON.stringify(make_post_data()) );
            const code: number = rows.result;
            if( code !== 0 ) {
                console.log(rows);
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
    }, [props.show]);
    
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
                        infos.map((value, index) => {
                            return (
                                <Row className="mb-3" key={index}>
                                    <Col xs={1} className="form-title input-pd"> {titles[index]} </Col>
                                    <Col className="input-pd">
                                        <Select 
                                            onChange={(e: any) => {
                                                var _tmp = [...infos];
                                                _tmp[index].name = e.value;
                                                setInfos(_tmp);
                                            }}
                                            placeholder="이름" 
                                            options={getNames()}
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

                                                           var _users = [...infos];
                                                           _users[index].score *= _users[index].score < 0 ? 1 : -1;
                                                           setInfos(_users);
                                                       }}
                                                   >＋</button> :
                                                   <button 
                                                       className="btn btn-danger"
                                                       onClick={() => { 
                                                           var _tmp = [...isPluses];
                                                           _tmp[index] = true;
                                                           setIsPluses(_tmp); 

                                                           var _users = [...infos];
                                                           _users[index].score *= _users[index].score > 0 ? 1 : -1;
                                                           setInfos(_users);
                                                       }}
                                                   >－</button>
                                               }
                                           </div>
                                           <input 
                                                placeholder="점수" 
                                                onChange={(e) => {
                                                    var _users = [...infos];
                                                    _users[index].score = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                    setInfos(_users);

                                                    var _tmp = [...isPluses];
                                                    _tmp[index] = _users[index].score > 0;
                                                    setIsPluses(_tmp); 
                                                }}
                                                value={value.score === 0 ? '' : value.score}
                                                type="number"
                                                className="form-control"
                                            />
                                        </div> 
                                    </Col>
                                    <Col xs={2} className="input-pd">
                                        <Form.Control 
                                            placeholder="별" 
                                            onChange={(e) => {
                                                var _tmp = [...infos];
                                                _tmp[index].star = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                setInfos(_tmp);
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
                        names={infos.map((value: Info) => value.name)}
                        perpectInfos={perpectInfos}
                        setPerpectInfos={setPerpectInfos}
                    />

                    <Row className="mb-3">
                        <Col className="input-pd">
                            <Form.Control 
                                placeholder="공탁금" 
                                onChange={(e) => {
                                    setDeposit(e.target.value === '' ? 0 : parseInt(e.target.value));
                                }}
                                type="number"
                                value={deposit === 0 ? '' : deposit}
                                min="0"
                            />
                        </Col>
                        <Col xs={2} className="input-pd">
                            <Button 
                                style={{width: "100%"}} 
                                onClick={() => {
                                    setPerpectInfos( [...perpectInfos, { id: perpectID, name: infos[0].name, select_id: -1 }] );
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
                            >등록</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRecord;
