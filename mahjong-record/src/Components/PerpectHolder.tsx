import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { PerpectInfo, Info } from "../ToyBox/Interfaces";

const PerpectItem = (props: any) => {
    const perpects = [
        { id: 1, name: "헤아림 역만" },
        { id: 2, name: "천화" },
        { id: 3, name: "지화" },
        { id: 4, name: "사암각" },
        { id: 5, name: "사암각 단기" },
        { id: 6, name: "국사무쌍" },
        { id: 7, name: "국사무쌍 13면팅" },
        { id: 8, name: "구련보등" },
        { id: 9, name: "순정구련보등" },
        { id: 10, name: "녹일색" },
        { id: 11, name: "자일색" },
        { id: 12, name: "청노두" },
        { id: 13, name: "대삼원" },
        { id: 14, name: "소사희" },
        { id: 15, name: "청노두" },
        { id: 16, name: "대사희" },
        { id: 17, name: "사깡쯔" },
    ];

    return(
        <Row className="mb-3">
            <Col xs={1} className="form-title">
                역만
            </Col>
            <Col xs={3}>
                <Form.Select
                    placeholder="이름" 
                    onChange={(e) => {
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].name = e.target.value; _tmp[index].select_id = -1; }
                        props.perpectInfosChange(_tmp);
                    }}
                    value={props.value.name}
                >
                    {
                        props.infos.map((_tmp: Info, index: number) => _tmp.name !== '' && <option value={_tmp.name} key={index}> {_tmp.name} </option>)
                    }
                </Form.Select>
            </Col>
            <Col>
                <Form.Select
                    onChange={(e) => {
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].select_id = e.target.value; }
                        props.perpectInfosChange(_tmp);
                    }}
                    value={ props.value.select_id }
                >
                    <option value="-1">역만</option>
                    {
                        perpects.map((value, index) =>  <option key={index} value={value.id}> {value.name} </option>)
                    }
                </Form.Select>
            </Col>
            <Col xs={1}>
                <Button 
                    className="btn-danger"
                    onClick={()=>{
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp.splice(index, 1); }
                        props.perpectInfosChange(_tmp);
                    }}
                >-</Button>
            </Col>
        </Row>
    );
}

const PerpectHolder = (props: any) => {
    return (
        <div id="Perpect-Holder">
            {
                props.perpectInfos.map((value: PerpectInfo, index: number) => {
                    return <PerpectItem
                        key={index}
                        value={value}
                        infos={props.infos}
                        perpectInfos={props.perpectInfos}
                        perpectInfosChange={props.perpectInfosChange}
                    />
                })
            }
        </div>
    );
};

export default PerpectHolder;