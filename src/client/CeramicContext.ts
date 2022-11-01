// import { CeramicClient } from '@ceramicnetwork/http-client'
// import { DID } from 'dids'
// import { getResolver as getKeyResolver } from 'key-did-resolver'
// import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
// import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
// import { DIDBase } from "./DIDBase";

//import { SelfID } from "@self.id/framework";

// export class CeramicContext{
//     threeID: ThreeIdConnect = new ThreeIdConnect();
//     ceramic: CeramicClient = new CeramicClient();
//     account: string = "";
//     //did: DID;
//     constructor(){
//     }

//     async connect(ethereumProvider: any){
//         // Request accounts from the Ethereum provider
//         const accounts = await ethereumProvider.request({
//             method: 'eth_requestAccounts',
//         });
//         // Create an EthereumAuthProvider using the Ethereum provider and requested account
//         const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0]);
//         // Connect the created EthereumAuthProvider to the 3ID Connect instance so it can be used to
//         // generate the authentication secret
//         await this.threeID.connect(authProvider);

//         const did = new DID({
//             // Get the DID provider from the 3ID Connect instance
//             provider: this.threeID.getDidProvider(),
//             resolver: {
//               ...get3IDResolver(this.ceramic),
//               ...getKeyResolver(),
//             },
//         })

//         await did.authenticate();
//         this.ceramic.did = did;
//         this.account = accounts[0];
//     }
// }


export class CeramicContext{
    //selfid: SelfID | null = null;
    constructor(){
        //
    }

    // async load(id: string){
    //     const r = await this.selfid?.client.ceramic.loadStream(id);
    //     return r;
    // }
}