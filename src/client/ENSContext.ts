import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { DIDBase } from "./DIDBase";

export class ENSContext extends DIDBase{
    provider: Web3Provider;
    constructor(provider: ethers.providers.Web3Provider | null){
        super();
        this.provider = provider ?? new ethers.providers.Web3Provider((window as any).ethereum);
    }

    async useAddress(address: string){
        this.evmAddress = address;
        const result = await this.provider.lookupAddress(address);
        this.did = result || "";
    }

    async useDid(ens: string){
        this.did = ens;
        console.log("DID: " + this.did);
        //const resolver = await this.provider.getResolver(ens);
        const result = await this.provider.resolveName(ens);
        console.log("ETH: " + this.evmAddress);
        this.evmAddress = result === null ? "" : result;
    }
}