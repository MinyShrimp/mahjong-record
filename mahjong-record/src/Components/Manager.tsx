/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Login from './Login';
import Config from '../ToyBox/Config';
import { goServer } from '../ToyBox/Functions';

const Manager = () => {
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [isLogin,   setIsLogin]   = useState<boolean>(false);

    var headers = JSON.parse(JSON.stringify(Config.headers));
    headers["authorization"] = sessionStorage.getItem('a_token');

    const validation = async () => {
        try {
            const rows: any = await goServer("/api/root/autho", "GET", headers);
            if( rows.code !== 200 ) {
                const id = sessionStorage.getItem('id');
                const r_token = sessionStorage.getItem('r_token');
                if(id !== null && r_token !== null) {
                    const _rows: any = await goServer(
                        "/api/root/refresh", "POST", Config.headers, 
                        JSON.stringify({
                            id: id, refreshToken: r_token
                        })
                    );
                    if(_rows.code === 200) {
                        sessionStorage.setItem('a_token', _rows.accessToken);
                    } else {
                        setModalShow(true);    
                    }
                } else {
                    setModalShow(true);
                }
            } else {
                setModalShow(false);
                setIsLogin(true);
            }
        } catch(e: any) {
            setModalShow(true);
        }
    }

    useEffect(() => {
        validation();
    }, []);

    return (
        <div>
            <Login 
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                }}
                setIsLogin={setIsLogin}
            />

            {
                isLogin ? "로그인 성공" : "로그인 실패"
            }
        </div>
    );
};

export default Manager;