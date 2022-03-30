import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { PerpectInfo } from "../ToyBox/Interfaces";
import { Perpects } from "../ToyBox/Code";

const PerpectItem = (props: any) => {
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
                        props.setPerpectInfos(_tmp);
                    }}
                    value={props.value.name}
                >
                    {
                        props.names.map((_tmp: string, index: number) => _tmp !== '' && <option value={_tmp} key={index}> {_tmp} </option>)
                    }
                </Form.Select>
            </Col>
            <Col>
                <Form.Select
                    onChange={(e) => {
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].select_id = e.target.value; }
                        props.setPerpectInfos(_tmp);
                    }}
                    value={ props.value.select_id }
                >
                    <option value="-1">역만</option>
                    {
                        Object.values(Perpects).map((value, index) =>  <option key={index} value={index+1}> {value} </option>)
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
                        props.setPerpectInfos(_tmp);
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
                        names={props.names}
                        perpectInfos={props.perpectInfos}
                        setPerpectInfos={props.setPerpectInfos}
                    />
                })
            }
        </div>
    );
};

export default PerpectHolder;