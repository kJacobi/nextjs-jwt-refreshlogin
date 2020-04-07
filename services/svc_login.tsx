import { LoginInputs } from "../pages/login";
import Http from "./svc_rest";
import getConfig from 'next/config';
import { SetTokenCookie, RemoveCookies } from "./svc_cookie";
import Router from "next/router";
import { AuthToken, StoredToken } from './svc_token'


const {
    publicRuntimeConfig: {
        API_BASE_URL,
        TOKEN_COOKIE_NAME
    }
} = getConfig();

// login is for client side login handler
export async function login(inputs: LoginInputs): Promise<string | void> {

    const data = inputs;
    const res: any = await Http.post(`${API_BASE_URL}/api/v1/Login`, data);

    if (res.error) {
        return res.error;
    } else if (!res.data || !res.data.token) {
        return "Something went wrong!";
    }

    const { data: tokenData } = res;

    // store the token data into cookies
    SetTokenCookie(tokenData);
    await Router.push("/dashboard");
}

// refresh can be server side (from withAuth) or client side from header
export async function refreshLogin(svcToken: AuthToken) {

    var apiEndPoint = `${API_BASE_URL}/api/v1/Refresh`;
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json;'
        }
    };

    const refreshData = {
        token: svcToken.tokenCookie.token,
        refreshToken: svcToken.tokenCookie.refreshToken
    }

    return await Http.post(apiEndPoint, refreshData, axiosConfig);
}


export async function logout() {
    RemoveCookies(TOKEN_COOKIE_NAME);
    await Router.push("/login");
}


