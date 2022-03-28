import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Route, Routes, Link } from 'react-router-dom';
import Record from './Components/Record';

import "./App.css";

function App() {
  return (
    <div className="App">
        
        <Routes>
            <Route path="/" element={<Record />} />
            <Route path="/recent" element={<div>TODO</div>} />
        </Routes>
        
        <Navbar bg="light" fixed="bottom">
            <Container>
                <Nav.Link as={Link} to="/">
                    순위
                </Nav.Link>
                <Nav.Link as={Link} to="/recent">
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
                <Nav.Link as={Link} to="/">
                    기타
                </Nav.Link>
            </Container>
        </Navbar>

    </div>
  );
}

export default App;