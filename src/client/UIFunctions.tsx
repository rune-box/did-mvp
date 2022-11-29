import { AccountKeys } from "./Constants";
import { AlgoIcon, ArIcon, AtomIcon, BtcIcon, CkbIcon, EthIcon, IdenaIcon, SolIcon, UnipassIcon } from "../icons/Icons";

export const drawAccountIcon = (key: string) => {
    if (!key) return <UnipassIcon/>;
    switch (key) {
        case AccountKeys.ETH:
            return (<EthIcon m= { 2} />);
        case AccountKeys.Arweave:
            return (<ArIcon m= { 2} />);
        case AccountKeys.Atom:
            return (<AtomIcon m= { 2} />);
        case AccountKeys.Solana:
            return (<SolIcon m= { 2} />);
        case AccountKeys.Algorand:
            return (<AlgoIcon m= { 2} />);
        case AccountKeys.Idena:
            return (<IdenaIcon m= { 2} />);
        case AccountKeys.Bitcoin:
            return (<BtcIcon m= { 2} />);
        case AccountKeys.NervosCKB:
            return (<CkbIcon m= { 2} />);
    }
    return <UnipassIcon/>;
}
