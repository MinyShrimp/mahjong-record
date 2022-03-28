import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import "./App.css";
import Record  from './Components/Record';

function App() {
  return (
    <div className="App">
        
        <Record />

        <Navbar bg="light" fixed="bottom">
            <Container>
                <Nav.Link href="#">순위</Nav.Link>
                <Nav.Link href="#">최근 기록</Nav.Link>
                <Nav.Link href="#">후원목록</Nav.Link>
                <Nav.Link href="#">업적</Nav.Link>
                <Nav.Link href="#">기타</Nav.Link>
            </Container>
        </Navbar>

    </div>
  );
}

export default App;
