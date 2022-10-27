import { getCookie } from "typescript-cookie";
import { CookieKeys } from "./RoutesData";

export const buildSignContent = (account: string) => {
    const nonce = getCookie(CookieKeys.EthSignInNonce);
    const data = {
        account: account,
        message: "Connect to RuneBox!",
        timestamp: Date.now(),
        nonce: nonce
    };
    return JSON.stringify(data);
}