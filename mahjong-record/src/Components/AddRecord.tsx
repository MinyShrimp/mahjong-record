import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

//import SupportHolder from "./SupportHolder";
import PerpectHolder from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Config        from "../ToyBox/Config";
//import { SupportInfo, PerpectInfo, Info } from "../ToyBox/Interfaces";
import { PerpectInfo, Info } from "../ToyBox/Interfaces";
import { goServer } from "../ToyBox/Functions";

const AddRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];
    //const [supportID, setSupportID] = useState<number>(0);
    //const [supportInfos, setSupportInfos] = useState<SupportInfo[]>([]);

    const [perpectID, setPerpectID] = useState<number>(0);
    const [perpectInfos, setPerpectInfos] = useState<PerpectInfo[]>([]);

    const normal_infos = [
        { seat: 0, name: "", score: "", star: "", perpect: "" },
        { seat: 1, name: "", score: "", star: "", perpect: "" },
        { seat: 2, name: "", score: "", star: "", perpect: "" },
        { seat: 3, name: "", score: "", star: "", perpect: "" },
    ];

    const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
    const [warningReason, setWarningReason] = useState<string>("");

    const [infos, setInfos]     = useState<Info[]>(normal_infos);
    const [deposit, setDeposit] = useState<string>("");
    const [names, setNames]     = useState<Array<string>>([]);

    const init_data = () => {
        //setSupportInfos([]);
        setInfos(normal_infos);
        setPerpectInfos([]);
        setIsShowWarning(false);
        setWarningReason("");
        setDeposit("");
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

    const make_post_data = () => {
        var _tmp = [...infos];
        perpectInfos.forEach((value) => {
            var _index = _tmp.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { _tmp[_index].perpect += value.select_id + "|"; }
        })
        setInfos(_tmp);
    }

    const post_data = async () => {
        make_post_data();

        try {
            const rows: any = await goServer( "/api/records", "POST", Config.headers, JSON.stringify([...infos, deposit]) );
            const code: number = rows.result;
            if( code !== 0 ) {
                setIsShowWarning(true);
                setWarningReason(ErrorCode[code]);
            } else {
                props.onHide();
            }
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => { init_data(); }, [props.show]);
    
    return (
        <Modal
            {...props}
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
                                                _tmp[index].score = e.target.value;
                                                setInfos(_tmp);
                                            }}
                                            value={value.score}
                                            type="number"
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Control 
                                            placeholder="별" 
                                            onChange={(e) => {
                                                var _tmp = [...infos];
                                                _tmp[index].star = e.target.value;
                                                setInfos(_tmp);
                                            }}
                                            value={value.star}
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
                        infos={infos}
                        perpectInfos={perpectInfos}
                        setPerpectInfos={setPerpectInfos}
                    />

                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                placeholder="공탁금" 
                                onChange={(e) => {
                                    setDeposit(e.target.value);
                                }}
                                type="number"
                                value={deposit}
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
                                    setPerpectInfos( [...perpectInfos, { id: perpectID, name: "", select_id: -1 }] );
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
