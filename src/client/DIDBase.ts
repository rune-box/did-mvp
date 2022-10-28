export class DIDBase{
    did: string = "";
    evmAddress: string = "";
    avatar: string = "";
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
}