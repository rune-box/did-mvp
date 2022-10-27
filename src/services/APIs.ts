import { AppSettings } from "../client/AppData";

const APIPrefix_Runebox = AppSettings.APIPrefix; //"https://localhost:7153/v0/"; //"https://api.runebox.xyz/v0/"; // 
const queryPart = "&address=";

export const APIs = {
    Account_Authenticate: "/connect/wallet-authenticate",
    CheckIdena: "/connect/check-idena",
    ActivateEvm: "/dna/activate-evm",
    Mutate: "/dna/mutate",
    Save: "/dna/save"
};

export const APIsData = {
    evm: [
        {
            "id": "e2bcbdfac5ca45ccb57cf0c030a1acdc",
            "title": "Discord is verified - Galxe",
            "description": "",
            "dataType": "boolean",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/galxe/fetch-item?rune=e2bcbdfac5ca45ccb57cf0c030a1acdc" + queryPart,
                    "provider": "Galxe",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "discord is verified",
                "galxe",
                "galaxy"
            ],
            "schemaVersion": 0
        },
        {
            "id": "95b868a0799b4cb5995714d74a025024",
            "title": "Github is verified - Galxe",
            "description": "",
            "dataType": "boolean",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/galxe/fetch-item?rune=95b868a0799b4cb5995714d74a025024" + queryPart,
                    "provider": "Galxe",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "galxe",
                "github is verified",
                "galaxy"
            ],
            "schemaVersion": 0
        },
        {
            "id": "21f24a2edbe849e5a9303ca9e7f4abcc",
            "title": "Twitter is verified - Galxe",
            "description": "",
            "dataType": "boolean",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/galxe/fetch-item?rune=21f24a2edbe849e5a9303ca9e7f4abcc" + queryPart,
                    "provider": "Galxe",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "twitter is verified",
                "galxe",
                "galaxy"
            ],
            "schemaVersion": 0
        },
        {
            "id": "3e864bd2f55447739274e16c476f0e3e",
            "title": "Email is verified - Galxe",
            "description": "",
            "dataType": "boolean",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/galxe/fetch-item?rune=3e864bd2f55447739274e16c476f0e3e" + queryPart,
                    "provider": "Galxe",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "email is verified",
                "galxe",
                "galaxy"
            ],
            "schemaVersion": 0
        },
        {
            "id": "07a36eec52dc438799efefd42bacc10a",
            "title": "Galxe ID",
            "description": "",
            "dataType": "text",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/galxe/fetch-item?rune=" + queryPart,
                    "provider": "Galxe",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "galxe",
                "id",
                "account",
                "galaxy"
            ],
            "schemaVersion": 0
        },
        {
            "id": "3a09559978574ecdb29380b0309752f1",
            "title": "Score on EthRank",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/ethrank/fetch-item?rune=3a09559978574ecdb29380b0309752f1" + queryPart,
                    "provider": "EthRank",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "score",
                "ethrank"
            ],
            "schemaVersion": 0
        },
        {
            "id": "a3353d6bac6c49488cad5a32f4a0e280",
            "title": "Score on Goodghosting",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/goodghosting/fetch-item?rune=a3353d6bac6c49488cad5a32f4a0e280" + queryPart,
                    "provider": "Goodghosting",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "score",
                "goodghosting"
            ],
            "schemaVersion": 0
        },
        {
            "id": "c960e67a5f124afcbe97e04c48058f8c",
            "title": "Score on RociFi",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/rocifi/fetch-item?rune=c960e67a5f124afcbe97e04c48058f8c" + queryPart,
                    "provider": "RociFi",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "score",
                "rocifi"
            ],
            "schemaVersion": 0
        },
        // {
        //     "id": "43a6c3b30dac45e5ab7e249eb0a2d6dc",
        //     "title": "Assets Balance of All Chains - USD (EVM | Debank)",
        //     "description": "",
        //     "dataType": "double",
        //     "apis": [
        //         {
        //             "uri": APIPrefix_Runebox + "products/debank/fetch-item?rune=43a6c3b30dac45e5ab7e249eb0a2d6dc&address=",
        //             "provider": "Debank",
        //             "lastPingAt": 0
        //         }
        //     ],
        //     "isTask": false,
        //     "possibleValues": [],
        //     "keywords": [
        //         "assets balance",
        //         "all chains",
        //         "multi-chains",
        //         "evm",
        //         "debank"
        //     ],
        //     "schemaVersion": 0
        // },
        // {
        //     "id": "898a1a12345c437a811c9253af45b085",
        //     "title": "Debank Account ID",
        //     "description": "",
        //     "dataType": "text",
        //     "apis": [
        //         {
        //             "uri": APIPrefix_Runebox + "products/debank/fetch-item?rune=898a1a12345c437a811c9253af45b085&address=",
        //             "provider": "Debank",
        //             "lastPingAt": 0
        //         }
        //     ],
        //     "isTask": false,
        //     "possibleValues": [],
        //     "keywords": [
        //         "debank",
        //         "id",
        //         "account"
        //     ],
        //     "schemaVersion": 0
        // },
        {
            "id": "a2a28e84339a4afaaf4e05672e14f3db",
            "title": "Debank Score",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "products/debank/fetch-item?rune=a2a28e84339a4afaaf4e05672e14f3db&address=",
                    "provider": "Debank",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [],
            "keywords": [
                "debank",
                "score",
                "evm"
            ],
            "schemaVersion": 0
        },
        // {
        //     "id": "f0e38b7f7a0a444da55723ca1ac8175c",
        //     "title": "Email is verified - Debank",
        //     "description": "",
        //     "dataType": "boolean",
        //     "apis": [
        //         {
        //             "uri": APIPrefix_Runebox + "products/debank/fetch-item?rune=f0e38b7f7a0a444da55723ca1ac8175c&address=",
        //             "provider": "Debank",
        //             "lastPingAt": 0
        //         }
        //     ],
        //     "isTask": false,
        //     "possibleValues": [],
        //     "keywords": [
        //         "email is verified",
        //         "debank"
        //     ],
        //     "schemaVersion": 0
        // },
        // {
        //     "id": "2780535a9b534689a77fb918bb7d3067",
        //     "title": "Is a Mirror author - Debank",
        //     "description": "",
        //     "dataType": "boolean",
        //     "apis": [
        //         {
        //             "uri": APIPrefix_Runebox + "products/debank/fetch-item?rune=2780535a9b534689a77fb918bb7d3067&address=",
        //             "provider": "Debank",
        //             "lastPingAt": 0
        //         }
        //     ],
        //     "isTask": false,
        //     "possibleValues": [],
        //     "keywords": [
        //         "mirror",
        //         "author",
        //         "debank"
        //     ],
        //     "schemaVersion": 0
        // },
        {
            "id": "eeaddc282ac140008ee962a7bd33e7ae",
            "title": "Has a BAB token (BNB)",
            "description": "",
            "dataType": "boolean",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/bnb/fetch-item?rune=eeaddc282ac140008ee962a7bd33e7ae" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "bab token",
                "bnb",
                "bsc",
                "kyc",
                "binance"
            ],
            "schemaVersion": 0
        },
        {
            "id": "3d1c524a5afa428c8e2d014305ddfada",
            "title": "Txs Count - 7D (BNB)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/bnb/fetch-item?rune=3d1c524a5afa428c8e2d014305ddfada" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "7 days",
                "bnb",
                "bsc",
                "transactions count"
            ],
            "schemaVersion": 0
        },
        {
            "id": "b6e10a1d92674063ae0eb6bf7029928a",
            "title": "Age in days (BNB)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/bnb/fetch-item?rune=b6e10a1d92674063ae0eb6bf7029928a" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "account age",
                "bnb",
                "bsc"
            ],
            "schemaVersion": 0
        },
        {
            "id": "a81a1f9023ac4db7840c4ae58cd8de9b",
            "title": "Age in days (Polygon)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/polygon/fetch-item?rune=a81a1f9023ac4db7840c4ae58cd8de9b" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "polygon",
                "account age"
            ],
            "schemaVersion": 0
        },
        {
            "id": "16e548f9674e4597a12104872fcdbb66",
            "title": "Txs Count - 7D (Polygon)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/polygon/fetch-item?rune=16e548f9674e4597a12104872fcdbb66" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "polygon",
                "7 days",
                "transactions count"
            ],
            "schemaVersion": 0
        },
        {
            "id": "cd1e8e478115408686ad2bb3de7f75f2",
            "title": "Txs Count - 7D (Ethereum)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/ethereum/fetch-item?rune=cd1e8e478115408686ad2bb3de7f75f2&address=",
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [],
            "keywords": [
                "7 days",
                "ethereum",
                "transactions count"
            ],
            "schemaVersion": 0
        },
        {
            "id": "746fd165da4543ca9e3643cba5d415bb",
            "title": "Age in days (Ethereum)",
            "description": "",
            "dataType": "double",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/ethereum/fetch-item?rune=746fd165da4543ca9e3643cba5d415bb&address=",
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [],
            "keywords": [
                "ethereum",
                "account age"
            ],
            "schemaVersion": 0
        },
        {
            "id": "a511be6bc4dd4221a492cd0506b2d0f6",
            "title": "Count of Blue Chip NFTs (Ethereum)",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/ethereum/fetch-item?rune=a511be6bc4dd4221a492cd0506b2d0f6&address=",
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [],
            "keywords": [
                "ethereum",
                "blue chip",
                "NFT",
                "count"
            ],
            "schemaVersion": 0
        },
    ],
    idena: [
        {
            "id": "6ca1a6a0962d4b7ab8dc144e630d4e85",
            "title": "Count of Qualified Flips (Idena)",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/idena/fetch-item?rune=6ca1a6a0962d4b7ab8dc144e630d4e85" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "idena",
                "proof of human",
                "count of qualified flips"
            ],
            "schemaVersion": 0
        },
        {
            "id": "2bd3028927804e7ab2f08a0339a6290c",
            "title": "Identity Age (Idena)",
            "description": "",
            "dataType": "integer",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/idena/fetch-item?rune=2bd3028927804e7ab2f08a0339a6290c" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                
            ],
            "keywords": [
                "identity age",
                "idena",
                "proof of human"
            ],
            "schemaVersion": 0
        },
        {
            "id": "5b2a4888875e4cd9a2370947bfc1d253",
            "title": "Identity State (Idena)",
            "description": "",
            "dataType": "text",
            "apis": [
                {
                    "uri": APIPrefix_Runebox + "chains/idena/fetch-item?rune=5b2a4888875e4cd9a2370947bfc1d253" + queryPart,
                    "provider": "Runebox",
                    "lastPingAt": 0
                }
            ],
            "isTask": false,
            "possibleValues": [
                "Newbie",
                "Verified",
                "Human"
            ],
            "keywords": [
                "identity state",
                "proof of human",
                "idena"
            ],
            "schemaVersion": 0
        },
    ]
};

export const AuthAPIs = {
    getUri_Idena_Desktop: (token: string, eth: string) => {
        return "dna://signin/v1?token=" + token + "&"
            + "callback_url=https%3A%2F%2Fdna.runebox.xyz&"
            + "nonce_endpoint=https%3A%2F%2Fdna.runebox.xyz%2Fidena%2Fstart-session&"
            + `authentication_endpoint=https%3A%2F%2Fdna.runebox.xyz%2Fidena%2Fauthenticate%2F${eth}&`
            + "favicon_url=https%3A%2F%2Fdna.runebox.xyz%2Ffavicon.ico";
    },
    getUri_Idena_Web: (token: string, eth: string) => {
        return "https://app.idena.io/dna/signin?token=" + token + "&"
            + "callback_url=https://dna.runebox.xyz&"
            + "nonce_endpoint=https://dna.runebox.xyz/idena/start-session&"
            + `authentication_endpoint=https://dna.runebox.xyz/idena/authenticate/${eth}&`
            + "favicon_url=https://dna.runebox.xyz/favicon.ico";
    },
    getUri_Idena_Desktop_TEST: (token: string, eth: string) => {
        return "dna://signin/v1?token=" + token + "&"
            + "callback_url=https%3A%2F%2Flocalhost%3A7002&"
            + "nonce_endpoint=https%3A%2F%2Flocalhost%3A7002%2Fconnect%2Fidena%2Fstart-session&"
            + `authentication_endpoint=https%3A%2F%2Flocalhost%3A7002%2Fconnect%2Fidena%2Fauthenticate%2F${eth}&`
            + "favicon_url=https%3A%2F%2Flocalhost%3A7002%2Ffavicon.ico";
    },
    getUri_Idena_Web_TEST: (token: string, eth: string) => {
        return "https://app.idena.io/dna/signin?token=" + token + "&"
            + "callback_url=https://localhost:7002&"
            + "nonce_endpoint=https://localhost:7002/connect/idena/start-session&"
            + `authentication_endpoint=https://localhost:7002/connect/idena/authenticate/${eth}&`
            + "favicon_url=https://localhost:7002/favicon.ico";
    }
}