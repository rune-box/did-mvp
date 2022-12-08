export class DIDBase{
    did: string = "";
    evmAddress: string = "";
    avatar: string = "";
}

export class DIDKeys {
    static ETH_EIP155 = "did:pkh:eip155:1";
    static ETH_SLIP0044 = "did:pkh:slip0044:60";
    static Arweave_SLIP0044 = "did:pkh:slip0044:472";
    static Cosmos_SLIP0044 = "did:pkh:slip0044:118";
    static Polkadot_SLIP0044 = "did:pkh:slip0044:354";
    static Solana_SLIP0044 = "did:pkh:slip0044:501";
    static Idena_SLIP0044 = "did:pkh:slip0044:515";
    static BTC_SLIP0044 = "did:pkh:slip0044:0";
    static CKB_SLIP0044 = "did:pkh:slip0044:309";
    static Algorand_SLIP0044 = "did:pkh:slip0044:283";
}

export class DIDUtility {
    static isSame(dotbit: string, ens: string){
        if(!dotbit || !ens) return false;
        const indexDotbit = dotbit.lastIndexOf(".bit");
        const indexEns = ens.lastIndexOf(".eth");
        const subDotbit = dotbit.substring(0, indexDotbit);
        const subEns = ens.substring(0, indexEns);
        return (subDotbit.toLocaleLowerCase() === subEns.toLocaleLowerCase());
    }
    static isSame2(unipassid: string, dotbit: string, ens: string){
        if(!unipassid) return false;
        if(dotbit){
            const indexDotbit = dotbit.lastIndexOf(".bit");
            const subDotbit = dotbit.substring(0, indexDotbit);
            const check = (unipassid.toLocaleLowerCase() === subDotbit.toLocaleLowerCase());
            if(check) return true;
        }
        if(ens){
            const indexEns = ens.lastIndexOf(".eth");
            const subEns = ens.substring(0, indexEns);
            const check = (unipassid.toLocaleLowerCase() === subEns.toLocaleLowerCase());
            if(check) return true;
        }
        return false;
    }
}