import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import urls from '../Urls';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                urls.loginUrl,
                { username: username, password: password },
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', username);
                    history.push('/game');
                }
            })
            .catch((err) => alert('Wrong password or username'));

    };

    return (
        <div className="container">
            <form>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">{"Email address"}</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">{"Password"}</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    );
}

