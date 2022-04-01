/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Login from './Login';
import Config from '../ToyBox/Config';
import { goServer } from '../ToyBox/Functions';

const Manager = (props: any) => {
    const [modalShow, setModalShow] = useState<boolean>(false);

    const validation = async () => {
        try {
            var headers = JSON.parse(JSON.stringify(Config.headers));
            headers["authorization"] = sessionStorage.getItem('a_token');
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
                        props.setIsLogin(true);
                        sessionStorage.setItem('isLogin', '1');
                    } else {
                        setModalShow(true);
                    }
                } else {
                    setModalShow(true);
                }
            } else {
                setModalShow(false);
                props.setIsLogin(true);
                sessionStorage.setItem('isLogin', '1');
            }
        } catch(e: any) {
            setModalShow(true);
        }
    }

    useEffect(() => {
        validation();
    }, []);

    return (
        <> 
            <Login 
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    props.setShowLogin(false);
                }}
                setIsLogin={props.setIsLogin}
            />
        </>
    );
};

export default Manager;