import { GetCookie } from './svc_cookie';
import jwtDecode from "jwt-decode";

export type StoredToken = {
    readonly token: string;
    readonly refreshToken: string;
}

// The decoded properties are dependant on the jwt info within.   Below includes sub (username) if present, and role (if user roles are also used or within jwt)  
export type DecodedToken = {
    readonly sub: string;
    readonly role: string;
    readonly exp: number;
}


// class for token and provided methods of information about the token data.   
export class AuthToken {
    readonly tokenCookie: StoredToken;
    readonly decodedToken: DecodedToken;

    constructor(readonly tokenData?: string | object) {
        this.tokenCookie = { token: "", refreshToken: "" };
        this.decodedToken = { sub: "", role: "", exp: 0 };

        try {
            if (tokenData) {
                this.tokenCookie = tokenData as StoredToken;
                this.decodedToken = jwtDecode(this.tokenCookie.token);
            }
        }
        catch (e) { }
    }

    get expiresAt(): Date {
        return new Date(this.decodedToken.exp * 1000);
    }

    get isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    get isAuthenticated(): boolean {
        return !this.isExpired;
    }

    get userName() {
        return this.decodedToken.sub;
    }

    get role() {
        return this.decodedToken.role;
    }

    get authorizationString() {
        return `Bearer ${this.tokenCookie.token}`;
    }

    get token() {
        return this.tokenCookie.token;
    }

    get refreshToken() {
        return this.tokenCookie.refreshToken;
    }
}
