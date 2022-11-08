import Arweave from "arweave/node/common";
import { Account2, Account4 } from "../models/Account";
import { CeramicContext } from "./CeramicContext";
import { DotbitContext } from "./DotbitContext";
import { ENSContext } from "./ENSContext";
import { AccountKeys } from "./Wallet";

export const ViewData = {
    // The key of account you logged in
    keyOfPrimaryAccount: "",
    eth: "",
    ar: "",
    atom: "",
    sol: "",
    idena: "",
    did: {
        dotbit: "",
        ens: ""
    },
    displayName: "",
    //ceramicContext: new CeramicContext(),
    ethSigner: <any>null,
    arweave: <any>null,

    loggedIn: false,
    afterLoggedIn: () => {},

    activated: false,
    afterActivated: () => {},
};

export const EmptyDNA = {
    id: "",
    genes: {
        dotbit: "",
        ens: "",
        crypto: {
            eth: "",
            ar: "",
            atom: "",
            sol: "",
            idena: "",
            btc: "",
            ckb: ""
        },
        social: {
            twitter: "",
            github: ""
        },
    },
    hash: "",
    lastDna: "",
    updated: 0,
    schemaVersion: 0
}

export const EmptyCids = {
    "arweave": "",
    "ipfs": ""
}

export class ViewMdoelBridge {
    static DNA = EmptyDNA;
    static Cids = EmptyCids;

    static ENSContext: ENSContext;
    static DotbitContext: DotbitContext;

    static getAccount3 = (key: string, account: string): Account4 | null => {
        if(!key || !account)
            return null;
        return {
            key: key,
            account: account,
            done: false,
            working: false
        };
    }

    static getSigners = () => {
        const signers = new Array<Account4>();
        const crypto = ViewMdoelBridge.DNA.genes.crypto;

        const eth = ViewMdoelBridge.getAccount3(AccountKeys.ETH, crypto.eth);
        if(eth) signers.push(eth);

        const ar = ViewMdoelBridge.getAccount3(AccountKeys.Arweave, crypto.ar);
        if(ar) signers.push(ar);

        const atom = ViewMdoelBridge.getAccount3(AccountKeys.Atom, crypto.atom);
        if(atom) signers.push(atom);

        const sol = ViewMdoelBridge.getAccount3(AccountKeys.Solana, crypto.sol);
        if(sol) signers.push(sol);

        // Idena doesn't support Signature now.
        // const idena = ViewMdoelBridge.getAccount2(AccountKeys.Idena, crypto.idena);
        // if(idena) signers.push(idena);

        return signers;
    }

    static hasOneAccount(items: Array<Account2>, key: string){
        if(!items || !key) return false;
        const index = items.findIndex(i => i.key === key);
        return (index >= 0);
    }
    static isInChangedItems(addedItems: Array<Account2>, removedItems: Array<Account2>, key: string){
        if(!key) return false;
        const indexAdded = addedItems.findIndex(i => i.key === key);
        const indexRemoved = removedItems.findIndex(i => i.key === key);
        return (indexAdded >= 0 || indexRemoved >= 0);
    }
}