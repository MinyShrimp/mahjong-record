import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { SupportInfo } from "../ToyBox/Interfaces";

const SupportItem = (props: any) => {
    return(
        <Row className="mb-3">
            <Col xs={1} className="form-title">
                후원
            </Col>
            <Col xs={3}>
                <Form.Control 
                    placeholder="이름" 
                    onChange={(value) => {
                        let _tmp = [...props.infos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].name = value.target.value; }
                        props.infosChange(_tmp);
                    }}
                    value={props.value.name}
                />
            </Col>
            <Col>
                <Form.Select aria-label="Default select example">
                    <option>후원</option>
                </Form.Select>
            </Col>
            <Col xs={1}>
                <Button 
                    className="btn-danger"
                    onClick={()=>{
                        let _tmp = [...props.infos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp.splice(index, 1); }
                        props.infosChange(_tmp);
                    }}
                >-</Button>
            </Col>
        </Row>
    );
}

const SupportHolder = (props: any) => {
    return (
        <div id="Support-Holder">
            {
                props.supportInfos.map((value: SupportInfo, index: number) => {
                    return <SupportItem
                        key={index}
                        value={value}
                        infos={props.supportInfos}
                        infosChange={props.supportInfosChange}
                    />
                })
            }
        </div>
    );
};

export default SupportHolder;