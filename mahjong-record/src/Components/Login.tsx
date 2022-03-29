import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import * as CryptoJS from "crypto-js";
import Config from '../ToyBox/Config';
import { ErrorCode } from '../ToyBox/Code';
import { goServer } from '../ToyBox/Functions';

const Login = (props: any) => {
    const [loginData, setLoginData] = useState({
        id: '', pwd: ''
    });
    const [isShowWarning, setIsShowWarning] = useState<boolean>(false);
    const [warningReason, setWarningReason] = useState<string>("");

    const postServer = async () => {
        const pwd = CryptoJS.SHA512(loginData.pwd).toString(CryptoJS.enc.Base64);

        try {
            const rows: any = await goServer(
                "/api/root/login", 
                "POST", 
                Config.headers, 
                JSON.stringify({
                    id: loginData.id,
                    pwd: pwd
                })
            );

            if( rows.result === 13 ) {
                setIsShowWarning(false);
                sessionStorage.setItem('id', loginData.id);
                Object.keys(rows.token).forEach((key) => {
                    const value = rows.token[key];
                    sessionStorage.setItem(key, value);
                });
                props.setIsLogin(true);
                props.onHide();
                
            } else {
                setIsShowWarning(true);
                setWarningReason(ErrorCode[rows.result]);
            }
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Form>
                    <Row className="mb-3 mt-3" style={{ textAlign: "center" }}>
                        <Col>
                            <h3>Login</h3>
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
                    <Row className="mb-3">
                        <Col>
                            <Form.Label> ID </Form.Label>
                            <Form.Control 
                                placeholder="ID"
                                type="text"
                                value={loginData.id}
                                onChange={(e) => {
                                    let _tmp = JSON.parse(JSON.stringify(loginData));
                                    _tmp.id = e.target.value;
                                    setLoginData(_tmp);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col>
                            <Form.Label> Password </Form.Label>
                            <Form.Control 
                                placeholder="PWD"
                                type="password"
                                value={loginData.pwd}
                                onChange={(e) => {
                                    let _tmp = JSON.parse(JSON.stringify(loginData));
                                    _tmp.pwd = e.target.value;
                                    setLoginData(_tmp);
                                }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Col>
                            <Button 
                                type="submit"
                                onClick={postServer}
                            >Login</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Login;