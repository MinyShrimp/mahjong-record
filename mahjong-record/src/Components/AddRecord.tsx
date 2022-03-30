import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

//import SupportHolder from "./SupportHolder";
import PerpectHolder from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Config        from "../ToyBox/Config";
//import { SupportInfo, PerpectInfo, Info } from "../ToyBox/Interfaces";
import { PerpectInfo, Info, RecentInfo } from "../ToyBox/Interfaces";
import { goServer } from "../ToyBox/Functions";

const AddRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];
    //const [supportID, setSupportID] = useState<number>(0);
    //const [supportInfos, setSupportInfos] = useState<SupportInfo[]>([]);

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

    const [infos, setInfos]     = useState<Info[]>(normal_infos);
    const [deposit, setDeposit] = useState<number>(0);
    const [names, setNames]     = useState<Array<string>>([]);

    const init_data = () => {
        //setSupportInfos([]);
        setInfos(normal_infos);
        setPerpectInfos([]);
        setIsShowWarning(false);
        setWarningReason("");
        setDeposit(0);
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

    const make_post_data = (): RecentInfo => {
        var _tmp = [...infos];
        perpectInfos.forEach((value) => {
            var _index = _tmp.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { _tmp[_index].perpect.push( value.select_id ); }
        });

        return {
            index: 0, users: _tmp, deposit: deposit, update_time: new Date()
        };
    }

    const post_data = async () => {
        make_post_data();

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
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Form>
                    {
                        infos.map((value, index) => {
                            return (
                                <Row className="mb-3" key={index}>
                                    <Col xs={1} className="form-title"> {titles[index]} </Col>
                                    <Col>
                                        <Form.Control 
                                            placeholder="이름" 
                                            onChange={(e) => {
                                                var _tmp = [...infos];
                                                _tmp[index].name = e.target.value;
                                                setInfos(_tmp);
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
                                                var _tmp = [...infos];
                                                _tmp[index].score = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                setInfos(_tmp);
                                            }}
                                            value={value.score === 0 ? '' : value.score}
                                            type="number"
                                        />
                                    </Col>
                                    <Col xs={2}>
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
                    
                    {
                        // <SupportHolder 
                        //     supportInfos={supportInfos}
                        //     setSupportInfos={setSupportInfos}
                        // />
                    }

                    <PerpectHolder 
                        names={infos.map((value: Info) => value.name)}
                        perpectInfos={perpectInfos}
                        setPerpectInfos={setPerpectInfos}
                    />

                    <Row className="mb-3">
                        <Col>
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
                        {/*
                        <Col>
                            <Button 
                                style={{width: "100%"}} 
                                onClick={() => {
                                    setSupportInfos( [...supportInfos, { id: supportID, name: "", content: "" }] );
                                    setSupportID(supportID + 1);
                                }}
                            > 후원 추가 </Button>
                        </Col>
                        */}
                        <Col xs={2}>
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
