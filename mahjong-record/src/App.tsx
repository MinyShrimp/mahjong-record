import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Route, Routes, Link } from 'react-router-dom';
import Record  from './Components/Record';
import Recent  from "./Components/Recent";
import Manager from "./Components/Manager";

import "./App.css";

function App() {
    const [isLogin,   setIsLogin] = useState<boolean>(false);
    const [label,     setLabel] = useState<string>("");
    const [showLogin, setShowLogin] = useState<boolean>(false);
    
    return (
        <div className="App">
            <Navbar bg="light" fixed="top">
                <Container>
                    <Navbar.Brand>{label}</Navbar.Brand>
                    <Nav className="me-auto">
                    </Nav>

                    <Nav className="justify-content-end">
                        {
                            isLogin
                            ? <Nav.Link onClick={()=>{
                                setShowLogin(false);
                                setIsLogin(false);
                                sessionStorage.setItem('isLogin', '0');
                            }}>로그아웃</Nav.Link>

                            : <Nav.Link onClick={()=>{
                                setShowLogin(true);
                            }}>로그인</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/" element={<Record setLabel={setLabel} />} />
                <Route path="/recent/:id" element={<Recent setLabel={setLabel} isLogin={isLogin} />} />
                {/*<Route path="/root" element={<Manager isLogin={isLogin} setIsLogin={setIsLogin} />}/>*/}
            </Routes>
            
            <Navbar bg="light" fixed="bottom">
                <Container>
                    <Nav.Link as={Link} to="/">
                        순위
                    </Nav.Link>
                    <Nav.Link as={Link} to="/recent/1">
                        최근 기록
                    </Nav.Link>
                    {
                        // <Nav.Link as={Link} to="/">
                        //     후원목록
                        // </Nav.Link>
                        // <Nav.Link as={Link} to="/">
                        //     업적
                        // </Nav.Link>
                    }
                    <Nav.Link as={Link} to="#">
                        기타
                    </Nav.Link>
                </Container>
            </Navbar>

            {
                showLogin || sessionStorage.getItem('isLogin') === "1" ? <Manager isLogin={isLogin} setIsLogin={setIsLogin} setShowLogin={setShowLogin} /> : null
            }
            
        </div>
    );
}

export default App;