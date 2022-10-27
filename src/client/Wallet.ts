import { getCookie } from "typescript-cookie";
import { CookieKeys } from "./RoutesData";

export const buildSignContent = (account: string) => {
    const nonce = getCookie(CookieKeys.EthSignInNonce);
    const data = {
        account: account,
        message: "Connect to DNA@RuneBox!",
        timestamp: Date.now(),
        nonce: nonce
    };
    return JSON.stringify(data);
}

export const buildCheckIdenaContent = () => {
    const data = {
        message: "Check the result of Connection with DNA.",
        timestamp: Date.now()
    };
    return JSON.stringify(data);
}