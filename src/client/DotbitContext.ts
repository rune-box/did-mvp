import { createInstance } from "dotbit";
import { DotBit } from "dotbit/lib/DotBit";
import { DIDBase } from "./DIDBase";

export class DotbitContext extends DIDBase{
    dotbit: DotBit;
    constructor(){
        super();
        this.dotbit = createInstance();
    }

    async useAddress(address: string){
        this.evmAddress = address;
        const account = await this.dotbit.reverse({
            key: address
          });
        if(account){
            this.did = account.account;
            this.avatar = "https://display.did.id/identicon/" + this.did;
        }
    }

    async useDid(did: string){
        this.did = did;
        const ethAddrs = await this.dotbit.addrs(did, 'eth');
        this.evmAddress = ethAddrs.length > 0 ? ethAddrs[0].value : "";
    }
}