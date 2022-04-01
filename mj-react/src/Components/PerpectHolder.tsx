import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { PerpectInfo } from "../ToyBox/Interfaces";
import { Perpects } from "../ToyBox/Code";
import Select from "react-select";

const PerpectItem = (props: any) => {

    const getNames = () => {
        var _result: Array<any> = [];
        props.names.forEach((_v: string, _i:number) => {
            if( _v !== '' ) {
                _result.push({ "value": _v, "label": _v })
            }
        });
        return _result;
    }

    return(
        <Row className="mb-3">
            <Col xs={4} className="input-pd">
                <Select 
                    onChange={(e: any) => {
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].name = e.label; }
                        props.setPerpectInfos(_tmp);
                    }}
                    placeholder="이름" 
                    options={getNames()}
                />
            </Col>
            <Col className="input-pd">
                <Select 
                    onChange={(e: any) => {
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp[index].select_id = e.value; }
                        props.setPerpectInfos(_tmp);
                    }}
                    placeholder="역만" 
                    options={Object.values(Perpects).map((_v: string, _i: number) => { return { "value": _i + 1, "label": _v } })}
                />
            </Col>
            <Col xs={2} className="input-pd">
                <Button 
                    className="btn-danger"
                    onClick={()=>{
                        let _tmp = [...props.perpectInfos];
                        let index = _tmp.findIndex((item) => { return props.value.id === item.id; });
                        if(index !== -1) { _tmp.splice(index, 1); }
                        props.setPerpectInfos(_tmp);
                    }}
                    style={{"width": "100%"}}
                >-</Button>
            </Col>
        </Row>
    );
}

const PerpectHolder = (props: any) => {
    return (
        <>
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
        </>
    );
};

export default PerpectHolder;