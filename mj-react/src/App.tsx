import React, { useState } from 'react';
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
            <div className="navbar navbar-inverse fixed-top">
                <div className="container">
                    <div className='navbar-header'>
                        <span className='navbar-brand'>{label}</span>
                    </div>
                    <div className="justify-content-end">
                    {
                        isLogin
                        ? <button className='btn btn-default navbar-btn' onClick={()=>{
                            setShowLogin(false);
                            setIsLogin(false);
                            sessionStorage.setItem('isLogin', '0');
                        }}>로그아웃</button>

                        : <button className='btn btn-default navbar-btn' onClick={()=>{
                            setShowLogin(true);
                        }}>로그인</button>
                    }
                    </div>
                </div>
            </div>

            <Routes>
                <Route path="/" element={<Record setLabel={setLabel} />} />
                <Route path="/recent" element={<Recent setLabel={setLabel} isLogin={isLogin} />} />
            </Routes>

            <div className="navbar navbar-default fixed-bottom">
                <div className="container">
                    <Link to="/" className='btn btn-default navbar-btn'>순위</Link>
                    <Link to="/recent?page=1" className='btn btn-default navbar-btn'>최근 기록</Link>
                    <Link to="#" className='btn btn-default navbar-btn'>기타</Link>
                </div>
            </div>

            {
                showLogin || sessionStorage.getItem('isLogin') === "1" ? <Manager isLogin={isLogin} setIsLogin={setIsLogin} setShowLogin={setShowLogin} /> : null
            }
            
        </div>
    );
}

export default App;