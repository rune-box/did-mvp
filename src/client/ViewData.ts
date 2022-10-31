import Arweave from "arweave/node/common";
import { CeramicContext } from "./CeramicContext";
import { DotbitContext } from "./DotbitContext";
import { ENSContext } from "./ENSContext";

export const ViewData = {
    eth: "",
    ar: "",
    sol: "",
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
}