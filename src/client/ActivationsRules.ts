import { AppSettings } from "./AppData";

export const ActivationsRules_DAOSquare = {
    "title": "DAOSquare Role",
    "description": "",
    "rules": [
        {
            "id": "df982d73937241de990162643a93c707",
            "factor": 1,
            "rune": {
                "id": "df982d73937241de990162643a93c707",
                "title": "Hold a role of Matrix - DAOSquare",
                "description": "",
                "dataType": "boolean",
                "apis": [
                    {
                        "uri": AppSettings.APIPrefix + "products/daosquare/fetch-item?rune=df982d73937241de990162643a93c707&address=",
                        "provider": "DAOSquare",
                        "lastPingAt": 0
                    }
                ],
                "isTask": false,
                "possibleValues": [],
                "keywords": [
                    "daosquare",
                    "role",
                    "matrix"
                ],
                "schemaVersion": 0
            },
            "boolRules": [
                {
                    "id": "1945808f66cc4eff90c298dc15ed30c8",
                    "trueScore": 1,
                    "falseScore": 0
                }
            ],
            "numberRules": [],
            "textRules": []
        },
        {
            "id": "363ffa96c6e343009365b77e320cacb8",
            "factor": 1,
            "rune": {
                "id": "363ffa96c6e343009365b77e320cacb8",
                "title": "Hold a role of Cafeteria - DAOSquare",
                "description": "",
                "dataType": "boolean",
                "apis": [
                    {
                        "uri": AppSettings.APIPrefix + "products/daosquare/fetch-item?rune=363ffa96c6e343009365b77e320cacb8&address=",
                        "provider": "DAOSquare",
                        "lastPingAt": 0
                    }
                ],
                "isTask": false,
                "possibleValues": [],
                "keywords": [
                    "daosquare",
                    "role",
                    "cafeteria"
                ],
                "schemaVersion": 0
            },
            "boolRules": [
                {
                    "id": "823730cc495e48c59fbb29a5996ac027",
                    "trueScore": 1,
                    "falseScore": 0
                }
            ],
            "numberRules": [],
            "textRules": []
        },
        {
            "id": "0dba48be9afb489886b47dd419b6910e",
            "factor": 1,
            "rune": {
                "id": "0dba48be9afb489886b47dd419b6910e",
                "title": "Hold a role of Passport - DAOSquare",
                "description": "",
                "dataType": "boolean",
                "apis": [
                    {
                        "uri": AppSettings.APIPrefix + "products/daosquare/fetch-item?rune=0dba48be9afb489886b47dd419b6910e&address=",
                        "provider": "DAOSquare",
                        "lastPingAt": 0
                    }
                ],
                "isTask": false,
                "possibleValues": [],
                "keywords": [
                    "daosquare",
                    "role",
                    "passport"
                ],
                "schemaVersion": 0
            },
            "boolRules": [
                {
                    "id": "96d5b59fd82c464fb185ae017316f57d",
                    "trueScore": 1,
                    "falseScore": 0
                }
            ],
            "numberRules": [],
            "textRules": []
        }
    ],
    "schemaVersion": 0
};

export const ActivationsRules_Debank = {
    "title": "BAB + Debank Score > 42",
    "description": "",
    "rules": [
        {
            "id": "a2a28e84339a4afaaf4e05672e14f3db",
            "factor": 1,
            "rune": {
                "id": "a2a28e84339a4afaaf4e05672e14f3db",
                "title": "Debank Score",
                "description": "",
                "dataType": "double",
                "apis": [
                    {
                        "provider": "Debank",
                        "uri": AppSettings.APIPrefix + "products/debank/fetch-item?rune=a2a28e84339a4afaaf4e05672e14f3db&address=",
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
            "boolRules": [],
            "numberRules": [
                {
                    "id": "6b9e45cdbdcf4d09b06ed53d67c4f92f",
                    "leftCondition": "(",
                    "leftValue": 42,
                    "condition": "",
                    "rightCondition": "]",
                    "rightValue": 100,
                    "score": 1
                },
                {
                    "id": "0a60b43d80574f4cab63c1b4b517d3f8",
                    "leftCondition": "[",
                    "leftValue": 0,
                    "condition": "",
                    "rightCondition": "]",
                    "rightValue": 42,
                    "score": 0
                }
            ],
            "textRules": []
        },
        // {
        //     "id": "eeaddc282ac140008ee962a7bd33e7ae",
        //     "factor": 1,
        //     "rune": {
        //         "id": "eeaddc282ac140008ee962a7bd33e7ae",
        //         "title": "Has a BAB token (BNB)",
        //         "description": "",
        //         "dataType": "boolean",
        //         "apis": [
        //             {
        //                 "provider": "Runebox",
        //                 "uri": AppSettings.APIPrefix + "chains/bnb/fetch-item?rune=eeaddc282ac140008ee962a7bd33e7ae&address=",
        //                 "lastPingAt": 0
        //             }
        //         ],
        //         "isTask": false,
        //         "possibleValues": [],
        //         "keywords": [
        //             "bab token",
        //             "bnb",
        //             "bsc",
        //             "kyc",
        //             "binance"
        //         ],
        //         "schemaVersion": 0
        //     },
        //     "boolRules": [
        //         {
        //             "id": "39bb6517f98e465d9a80edc1c4184d9b",
        //             "trueScore": 1,
        //             "falseScore": 0
        //         }
        //     ],
        //     "numberRules": [],
        //     "textRules": []
        // }
    ],
    "schemaVersion": 0
};

export const ActivationsRules_Goodghosting = {
    "title": "BAB+Goodghosting",
    "description": "",
    "rules": [
        {
            "id": "eeaddc282ac140008ee962a7bd33e7ae",
            "factor": 1,
            "rune": {
                "id": "eeaddc282ac140008ee962a7bd33e7ae",
                "title": "Has a BAB token (BNB)",
                "description": "",
                "dataType": "boolean",
                "apis": [
                    {
                        "uri": AppSettings.APIPrefix + "chains/bnb/fetch-item?rune=eeaddc282ac140008ee962a7bd33e7ae&address=",
                        "provider": "Runebox",
                        "lastPingAt": 0
                    }
                ],
                "isTask": false,
                "possibleValues": [],
                "keywords": [
                    "bab token",
                    "bnb",
                    "bsc",
                    "kyc",
                    "binance"
                ],
                "schemaVersion": 0
            },
            "boolRules": [
                {
                    "id": "e2ae7ad6921e4fbcaecbc8975753b99e",
                    "trueScore": 1,
                    "falseScore": 0
                }
            ],
            "numberRules": [],
            "textRules": []
        },
        {
            "id": "a3353d6bac6c49488cad5a32f4a0e280",
            "factor": 1,
            "rune": {
                "id": "a3353d6bac6c49488cad5a32f4a0e280",
                "title": "Score on Goodghosting",
                "description": "",
                "dataType": "integer",
                "apis": [
                    {
                        "uri": AppSettings.APIPrefix + "products/goodghosting/fetch-item?rune=a3353d6bac6c49488cad5a32f4a0e280&address=",
                        "provider": "Goodghosting",
                        "lastPingAt": 0
                    }
                ],
                "isTask": false,
                "possibleValues": [],
                "keywords": [
                    "score",
                    "goodghosting"
                ],
                "schemaVersion": 0
            },
            "boolRules": [],
            "numberRules": [
                {
                    "id": "9bf2bd4fb71f4c5d83a3d84bf8144d0a",
                    "leftCondition": "(",
                    "leftValue": 15000,
                    "condition": "",
                    "rightCondition": "]",
                    "rightValue": 49999,
                    "score": 1
                }
            ],
            "textRules": []
        }
    ],
    "schemaVersion": 0
};