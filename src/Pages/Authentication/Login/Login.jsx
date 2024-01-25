import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"
import TokenService from '../../../Services/TokenService';
let defaultLoginDetails = {
    userid: "",
    password: ""
}
const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const uriPrefix = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix/auth"
const Login = () => {
    let [loginDetails, setLoginDetails] = useState(defaultLoginDetails);

    const navigate = useNavigate();
    // make notify functions for alert messages and error messages
    const notify = (message) => {
        toast.error(message);
    }

    // crreate login details
    const createLoginDetails = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        setLoginDetails({ ...loginDetails, [key]: value });
    }

    // post the login details
    const postLoginRequest = async () => {
        if (loginDetails.userid != "" && loginDetails.password != "") {
            await axios.post(`${uriPrefix}/user/login`, loginDetails, config)
                .then((response) => {
                    console.log(response);
                    if (response.data.login) {
                        TokenService.setToken(response.data.Token)
                        navigate("/")
                    }
                    if (response.data.userIdInvalid) {
                        notify("userid is invalid")
                    }
                    if (response.data.passwordInvalid) {
                        notify("password is invalid")
                    }
                    if (response.data.internalServerError) {
                        notify("internal server error")
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            if (loginDetails.userid == "" && loginDetails.password == "") {
                notify("bad credentials")
            } else {
                if (loginDetails.userid === "") { notify("userid is invalid") }
                if (loginDetails.password === "") { notify("password is invalid") }
            }
        }
    }

    return <>

        <section className="login-section">
            <Toaster toastOptions={{ className: 'Toaster' }} />
            <div className="login-bg-nanner">
                <div className="form">
                    <div className="heading">
                        Helix
                    </div>
                    <div className="form-group" onChange={createLoginDetails}>
                        <input value={loginDetails.userid} type="text" name='userid' />
                    </div>
                    <div className="form-group">
                        <input value={loginDetails.password} type="text" name='password' onChange={createLoginDetails} />
                    </div>
                    <div className="login-button">
                        <button onClick={postLoginRequest}>login</button>
                    </div>

                </div>
            </div>
        </section>

    </>
}

export default Login
