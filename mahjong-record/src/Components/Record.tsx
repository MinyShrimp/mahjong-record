import React from "react";
import { Navbar, Container, Nav, Button, Table, Form, NavDropdown } from "react-bootstrap";
import "./Record.css";

import AddRecord from './AddRecord';

const Record = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Navbar bg="light" fixed="top">
                <Container>
                    <Navbar.Brand href="#">검색</Navbar.Brand>
                    <Nav className="me-auto">
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#">Something</NavDropdown.Item>
                            <NavDropdown.Item href="#">Separated link</NavDropdown.Item>
                        </NavDropdown>

                        <Form.Check label={`20국 이상`} className="nav-item" id="check" />
                    </Nav>

                    <Nav className="justify-content-end">
                        <Nav.Link href="#">로그인</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className="Record-Main-Page">
                <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>이름</th>
                            <th>우마</th>
                            <th>평우마</th>
                            <th>점수</th>
                            <th>평점</th>
                            <th>최고점</th>
                            <th>별</th>
                            <th>평별</th>
                            <th>국수</th>
                            <th>1등</th>
                            <th>2등</th>
                            <th>3등</th>
                            <th>4등</th>
                            <th>1위율</th>
                            <th>1,2위율</th>
                            <th>4위율</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>김회민</td>
                            <td>458</td>
                            <td>13.88</td>
                            <td>201,500</td>
                            <td>6,106</td>
                            <td>52,300</td>
                            <td>5</td>
                            <td>0.15</td>
                            <td>33</td>
                            <td>13</td>
                            <td>11</td>
                            <td>7</td>
                            <td>2</td>
                            <td>0.39</td>
                            <td>0.73</td>
                            <td>0.06</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <Button 
                className="btn-fixed"
                onClick={() => {
                    setModalShow(true);
                }}
            >+</Button>
            <AddRecord 
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
};

export default Record;
