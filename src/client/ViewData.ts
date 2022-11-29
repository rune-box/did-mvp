import Arweave from "arweave/node/common";
import { Account2, Account4 } from "../models/Account";
import { CeramicContext } from "./CeramicContext";
import { DotbitContext } from "./DotbitContext";
import { ENSContext } from "./ENSContext";
import { AccountKeys } from "./Constants";

export const ViewData = {
    // The key of account you logged in
    keyOfPrimaryAccount: "",
    eth: "",
    ar: "",
    atom: "",
    dot: "",
    sol: "",
    idena: "",
    btc: "",
    ckb: "",
    algo: "",
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

    countOfPerPage: 20,
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
            dot: "",
            sol: "",
            idena: "",
            btc: "",
            ckb: "",
            algo: ""
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

    static LastDataSnapshot = {
        cids: EmptyCids,
        CreatedBy: "",
        createdAt: 0
    };

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

    static getSigners = (skipSig: boolean = false) => {
        const signers = new Array<Account4>();
        const crypto = ViewMdoelBridge.DNA.genes.crypto;

        const eth = ViewMdoelBridge.getAccount3(AccountKeys.ETH, crypto.eth);
        if(eth) signers.push(eth);

        const ar = ViewMdoelBridge.getAccount3(AccountKeys.Arweave, crypto.ar);
        if(ar) signers.push(ar);

        const atom = ViewMdoelBridge.getAccount3(AccountKeys.Atom, crypto.atom);
        if(atom) signers.push(atom);

        const dot = ViewMdoelBridge.getAccount3(AccountKeys.Polkadot, crypto.dot);
        if(dot) signers.push(dot);

        const sol = ViewMdoelBridge.getAccount3(AccountKeys.Solana, crypto.sol);
        if(sol) signers.push(sol);

        const algo = ViewMdoelBridge.getAccount3(AccountKeys.Algorand, crypto.algo);
        if(algo) signers.push(algo);

        if(!skipSig){
            const btc = ViewMdoelBridge.getAccount3(AccountKeys.Bitcoin, crypto.btc);
            if(btc) signers.push(btc);

            const ckb = ViewMdoelBridge.getAccount3(AccountKeys.NervosCKB, crypto.ckb);
            if(ckb) signers.push(ckb);
        }

        // Idena doesn't support Signature now.
        // const idena = ViewMdoelBridge.getAccount2(AccountKeys.Idena, crypto.idena);
        // if(idena) signers.push(idena);

        return signers;
    }
    static isInDNA(key: string, account: string){
        switch(key){
            case AccountKeys.ETH:
                return ViewMdoelBridge.DNA.genes.crypto.eth === account.toLocaleLowerCase();
            case AccountKeys.Arweave:
                return ViewMdoelBridge.DNA.genes.crypto.ar === account;
            case AccountKeys.Atom:
                    return ViewMdoelBridge.DNA.genes.crypto.atom === account;
            case AccountKeys.Solana:
                return ViewMdoelBridge.DNA.genes.crypto.sol === account;
            case AccountKeys.Algorand:
                return ViewMdoelBridge.DNA.genes.crypto.algo === account;
            case AccountKeys.Idena:
                return ViewMdoelBridge.DNA.genes.crypto.idena === account.toLocaleLowerCase();
            case AccountKeys.Bitcoin:
                return ViewMdoelBridge.DNA.genes.crypto.btc === account;
            case AccountKeys.NervosCKB:
                return ViewMdoelBridge.DNA.genes.crypto.ckb === account;
        }
        return false;
    }

    static async refreshViewDataByDNA(){
        ViewData.eth = ViewMdoelBridge.DNA.genes.crypto.eth;
      ViewData.ar = ViewMdoelBridge.DNA.genes.crypto.ar;
      ViewData.atom = ViewMdoelBridge.DNA.genes.crypto.atom;
      ViewData.dot = ViewMdoelBridge.DNA.genes.crypto.dot;
      ViewData.sol = ViewMdoelBridge.DNA.genes.crypto.sol;
      ViewData.idena = ViewMdoelBridge.DNA.genes.crypto.idena;
      ViewData.btc = ViewMdoelBridge.DNA.genes.crypto.btc;
      ViewData.ckb = ViewMdoelBridge.DNA.genes.crypto.ckb;
      ViewData.algo = ViewMdoelBridge.DNA.genes.crypto.algo;

      await ViewMdoelBridge.DotbitContext.useAddress(ViewData.eth);
      ViewData.did = {
        dotbit: ViewMdoelBridge.DNA.genes.dotbit,
        ens: ViewMdoelBridge.DNA.genes.ens
      };
      ViewData.displayName = ViewMdoelBridge.DNA.genes.dotbit || ViewMdoelBridge.DNA.genes.ens || "";
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