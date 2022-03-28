import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import "./AddRecord.css";
import SupportHolder, { SupportInfo } from "./SupportHolder";
import PerpectHolder, { PerpectInfo } from "./PerpectHolder";
import { ErrorCode } from "../ToyBox/Code";
import Autocomplete from "react-autocomplete";

interface Info {
    name:    string,
    score:   string,
    star:    string,
    perpect: string
};

const AddRecord = (props: any) => {
    const titles = ['東', '南', '西', '北'];
    const [supportID, supportIDChange] = useState<number>(0);
    const [supportInfos, supportInfosChange] = useState<SupportInfo[]>([]);

    const [perpectID, perpectIDChange] = useState<number>(0);
    const [perpectInfos, perpectInfosChange] = useState<PerpectInfo[]>([]);

    const [deposit, depositChange] = useState<string>("");

    const normal_infos = [
        { name: "", score: "", star: "", perpect: "" },
        { name: "", score: "", star: "", perpect: "" },
        { name: "", score: "", star: "", perpect: "" },
        { name: "", score: "", star: "", perpect: "" },
    ];
    const [infos, infosChange] = useState<Info[]>(normal_infos);

    const [isShowWarning, isShowWarningChange] = useState<boolean>(false);
    const [warningReason, warningReasonChange] = useState<String>("");

    const init_data = () => {
        infosChange(normal_infos);
        perpectInfosChange([]);
        supportInfosChange([]);
        isShowWarningChange(false);
        warningReasonChange("");
        depositChange("");
    }

    const make_post_data = () => {
        var _tmp = [...infos];
        perpectInfos.forEach((value) => {
            var _index = _tmp.findIndex((item) => item.name === value.name );
            if( _index !== -1 ) { _tmp[_index].perpect += value.select_id + "|"; }
        })
        infosChange(_tmp);
    }

    const post_data = async () => {
        make_post_data();

        var res: Response = await fetch(
            "http://localhost:8001/api/insertRecord",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([...infos, deposit]),
            }
        );

        if( res.ok ) {
            let data = await res.json();
            const code: number = data.result;
            if( code !== 0 ) {
                isShowWarningChange(true);
                warningReasonChange(ErrorCode[code]);
            } else {
                props.onHide();
            }
        } else {
            console.error(res);
        }
    }

    useEffect(init_data, [props.show]);
    
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
                                                infosChange(_tmp);
                                            }}
                                            value={value.name}
                                            autoComplete="on"
                                            list="names"
                                        />

                                        <datalist id="names">
                                            <option value="김회민"/>
                                        </datalist>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Control 
                                            placeholder="점수" 
                                            onChange={(e) => {
                                                var _tmp = [...infos];
                                                _tmp[index].score = e.target.value;
                                                infosChange(_tmp);
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
                                                infosChange(_tmp);
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
                    
                    <SupportHolder 
                        supportInfos={supportInfos}
                        supportInfosChange={supportInfosChange}
                    />

                    <PerpectHolder 
                        perpectInfos={perpectInfos}
                        perpectInfosChange={perpectInfosChange}
                    />

                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                placeholder="공탁금" 
                                onChange={(e) => {
                                    depositChange(e.target.value);
                                }}
                                type="number"
                                value={deposit}
                                min="0"
                            />
                        </Col>
                        <Col>
                            <Button 
                                style={{width: "100%"}} 
                                onClick={() => {
                                    //supportInfosChange( [...supportInfos, { id: supportID, name: "", content: "" }] );
                                    //supportIDChange(supportID + 1);
                                }}
                            > 후원 추가 </Button>
                        </Col>
                        <Col>
                            <Button 
                                style={{width: "100%"}} 
                                onClick={() => {
                                    perpectInfosChange( [...perpectInfos, { id: perpectID, name: "", select_id: -1 }] );
                                    perpectIDChange(perpectID + 1);
                                }}
                            > 역만 추가 </Button>
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