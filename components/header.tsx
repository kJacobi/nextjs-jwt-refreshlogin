import React, { useEffect, useState } from "react";
import { AuthToken } from "../services/svc_token";
import { GetCookie, RemoveCookies } from "../services/svc_cookie";
import { logout } from "../services/svc_login";
import { refreshLogin } from '../services/svc_login'
import { SetTokenCookie } from "../services/svc_cookie";
import getConfig from 'next/config';


const {
    publicRuntimeConfig: {
        TOKEN_COOKIE_NAME
    }
} = getConfig();

interface UserStatus {
    signedIn?: boolean
}

const Header: React.FC<UserStatus> = ({ signedIn = false }) => {

    // Header controls if displaying "login" or "logout" hyperlink.
    // Header must have refresh capability too, otherwise hyperlink text will not see the updated cookie when checking isAuthenticated.

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const tokenData = GetCookie(TOKEN_COOKIE_NAME);
        const auth = new AuthToken(tokenData);

        if (signedIn == true) {
            setLoggedIn(signedIn);
        }
        else if (auth.isAuthenticated) {
            setLoggedIn(true)
        }
        else {
            // use await method to call refreshLogin so is required from an extracted async method (tryRefreshLogin).
            tryRefreshLogin();
        }

        // attempt to refresh token from client side
        async function tryRefreshLogin() {
            const res: any = await refreshLogin(auth);

            if (res.error) {
                signedIn = false;
            }
            else if (!res.data || !res.data.token) {
                signedIn = false;
            }
            else if (res.data.successful == false) {
                signedIn = false;
            }
            else {
                signedIn = true;
            }

            if (signedIn == false)
                RemoveCookies(TOKEN_COOKIE_NAME)
            else
                SetTokenCookie(res.data);


            setLoggedIn(signedIn)
        }
    });

    return (
        <>
            <div><a href={"/"}>Home</a></div>

            {
                loggedIn == true
                    ? <div><a href="#" onClick={logout}>Logout</a></div>
                    : <div><a href={"/login"}>Login</a></div>
            }

            <div><a href={"/dashboard"}>Dashboard (protected)</a></div>
        </>
    );
}

export default Header;
