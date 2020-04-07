import React, { useState } from "react";
import { login } from "../services/svc_login";
import Header from '../components/header';
import { RemoveCookies } from "../services/svc_cookie";
import getConfig from 'next/config';

const gen = require('../assets/styles/general.scss');
const {
    publicRuntimeConfig: {
        TOKEN_COOKIE_NAME
    }
} = getConfig();

export type LoginInputs = {
    username: string
    password: string
}

function LoginPage(props: any) {

    // checking for if user was redirected here to ensure removal of auth cookie if so.

    const redirect = props.query.redirected;
    if (redirect) RemoveCookies(TOKEN_COOKIE_NAME);


    const initialValues: LoginInputs = { username: "", password: "", };

    const [inputs, setInputs] = useState(initialValues);
    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await login(inputs);
        if (res) setError(res);
    };

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        e.persist();
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={gen.main}>

            <Header />

            <div className={gen.message}>
                Login Page
            </div>
            <br />

            {error ? <p>Error: {error}</p> : null}

            <form className="container mx-auto max-w-sm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Email</label>
                    <input type="text" id="username" name="username" onChange={handleInputChange} value={inputs.username} placeholder="User" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={handleInputChange} value={inputs.password} placeholder="PW" />
                </div>
                <button type="submit">Login</button>
            </form>

        </div>
    );

}

LoginPage.getInitialProps = (ctx: any) => {

    const { query } = ctx;
    return { query };
}

export default LoginPage;