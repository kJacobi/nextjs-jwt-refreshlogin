import React, { Component } from 'react';
import { AuthToken } from '../services/svc_token'
import { refreshLogin } from '../services/svc_login'
import getConfig from 'next/config';
import ServerCookie from "next-cookies";
import { Router } from 'next/router';

const {
    publicRuntimeConfig: {
        TOKEN_COOKIE_NAME
    }
} = getConfig();


export type AuthProps = {
    authToken: AuthToken
}

export function withAuth(WrappedComponent: any) {

    return class extends Component<AuthProps> {

        static async getInitialProps(ctx: any) {

            //  ServerCookie needed to access a cookie from server side
            const tokenData = ServerCookie(ctx)[TOKEN_COOKIE_NAME];

            if (tokenData == null) {
                ctx.res.writeHead(302, {
                    Location: "/login?redirected=true",
                });
                ctx.res.end();
            }
            else {
                var authToken = new AuthToken(tokenData);

                if (authToken.isExpired == true) {

                    // expired token will next attempt use the refresh token from server side
                    const res: any = await refreshLogin(authToken);

                    var redirect = false;
                    if (res.error) {
                        redirect = true;
                    }
                    else if (!res.data || !res.data.token) {
                        redirect = true;
                    }
                    else if (res.data.successful == false) {
                        redirect = true;
                    }

                    if (redirect == true) {
                        ctx.res.writeHead(302, {
                            Location: "/login?redirected=true",
                        });
                        ctx.res.end();
                    }
                    else {
                        authToken = new AuthToken(res.data)
                    }

                }

                const initialProps = { authToken };

                if (WrappedComponent.getInitialProps)
                    return WrappedComponent.getInitialProps(initialProps);

                return initialProps;
            }

        }

        get auth() {
            // the server pass to the client serializes the token
            // so we have to reinitialize the authToken class
            return new AuthToken(JSON.stringify(this.props.authToken));
        }

        render() {
            return <WrappedComponent authToken={this.auth} {...this.props} />;
        }
    };
}