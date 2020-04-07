import React, { useEffect } from 'react';
import { withAuth, AuthProps } from '../components/withAuth'
import Header from '../components/header';
import { SetTokenCookie } from "../services/svc_cookie";
const gen = require('../assets/styles/general.scss');

type Props = AuthProps & {
    message: string
}

function DashboardPage(props: any) {

    // existing token or a refreshtoken is always passed down from withAuth and cookie cached here.
    useEffect(() => {
        SetTokenCookie(props.authToken.tokenCookie);
    });

    return (
        <div className={gen.main}>
            <Header signedIn={true} />

            <div className={gen.message}>
                {props.message}
            </div>
        </div>
    );
}

DashboardPage.getInitialProps = async ({ authToken }: AuthProps): Promise<Props> => {

    let message = "This is my dashboard"
    return { authToken, message }
}

export default withAuth(DashboardPage);