import React from 'react';
import cookie from 'cookie';
import jscookie from 'js-cookie';
import getConfig from 'next/config';

const {
    publicRuntimeConfig: {
        TOKEN_COOKIE_NAME,
        HOURS_TOKENCOOKIE_EXPIRES
    }
} = getConfig();

export function ParseCookies(req: any) {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export function SetCookie(cookieName: string, cookieData: any, expiration: number) {
    try {
        jscookie.set(cookieName, JSON.stringify(cookieData), { expires: expiration });
    }
    catch{
        return null
    }
}

export function SetTokenCookie(cookieData: any) {

    var dt = new Date();
    dt.setHours(dt.getHours() + HOURS_TOKENCOOKIE_EXPIRES);

    try {
        jscookie.set(TOKEN_COOKIE_NAME, JSON.stringify(cookieData), { expires: dt });
    }
    catch {
        return null
    }
}


export function GetCookie(cookieName: string) {

    try {
        return JSON.parse(jscookie.get(cookieName) || "{}");
    }
    catch{
        return null
    }
}

export function RemoveCookies(strCookies: string) {
    strCookies.split(",").forEach(function (item) {
        jscookie.remove(item);
    });
}