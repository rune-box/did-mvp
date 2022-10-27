import { Box, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { DataRune, DataRunesGroup } from "../../models/DataRune";
import { APIsData } from "../../services/APIs";
import { CardRenderer, SimpleCard } from "./CardRenderer";

// type AddresseProps = {
//     address: string;
// }

// export const EvmCardsRenderer = ({address}: AddresseProps) =>{
//     if(address){
//         return (
//             <Wrap>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.evmGetTotalBalance} />
//                 </WrapItem>
//                 <WrapItem key={1}>
//                     <SimpleCard address={address} api={APIs.evmGetDebankScore} />
//                 </WrapItem>
//                 <WrapItem key={2}>
//                     <SimpleCard address={address} api={APIs.evmGetGoodghostingScore} />
//                 </WrapItem>
//             </Wrap>
//         );
//     }
//     return (
//         <p></p>
//     );
// }

// export const EthCardsRenderer = ({address}: AddresseProps) =>{
//     if(address){
//         return (
//             <Wrap>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.ethGetAgeInDays} />
//                 </WrapItem>
//                 <WrapItem key={1}>
//                     <SimpleCard address={address} api={APIs.ethGetTransactionsCountIn7Days} />
//                 </WrapItem>
//                 <WrapItem key={1}>
//                     <SimpleCard address={address} api={APIs.ethGetCountOfBlueChipNFTs} />
//                 </WrapItem>
//             </Wrap>
//         );
//     }
//     return (
//         <p></p>
//     );
// }

// export const BnbCardsRenderer = ({address}: AddresseProps) =>{
//     if(address){
//         return (
//             <Wrap>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.bnbGetAgeInDays} />
//                 </WrapItem>
//                 <WrapItem key={1}>
//                     <SimpleCard address={address} api={APIs.bnbGetTransactionsCountIn7Days} />
//                 </WrapItem>
//                 <WrapItem key={2}>
//                     <SimpleCard address={address} api={APIs.bnbHasBABToken} />
//                 </WrapItem>
//             </Wrap>
//         );
//     }
//     return (
//         <p></p>
//     );
// }

// export const PolygonCardsRenderer = ({address}: AddresseProps) =>{
//     if(address){
//         return (
//             <Wrap>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.polygonGetAgeInDays} />
//                 </WrapItem>
//                 <WrapItem key={1}>
//                     <SimpleCard address={address} api={APIs.bnbGetTransactionsCountIn7Days} />
//                 </WrapItem>
//                 <WrapItem key={2}>
//                     <SimpleCard address={address} api={APIs.polygonGetRociFiScore} />
//                 </WrapItem>
//             </Wrap>
//         );
//     }
//     return (
//         <p></p>
//     );
// }

// export const IdenaCardsRenderer = ({address}: AddresseProps) =>{
//     if(address){
//         return (
//             <Wrap>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.idenaGetIdentityState} />
//                 </WrapItem>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.idenaGetIdentityAge} />
//                 </WrapItem>
//                 <WrapItem key={0}>
//                     <SimpleCard address={address} api={APIs.idenaGetCountOfQualifiedFlips} />
//                 </WrapItem>
//             </Wrap>
//         );
//     }
//     return (
//         <p></p>
//     );
// }

type CardsRendererProps = {
    address: string;
    runes: DataRunesGroup;
}
export const SimpleCardsRenderer = ({address, runes}: CardsRendererProps) =>{
    if(address){
        return (
            <Wrap>
                {runes.items.map((item: DataRune, index: number) => (
                <WrapItem key={item.id}>
                    <SimpleCard address={address} rune={item} />
                </WrapItem>
                ))}
            </Wrap>
        );
    }
    return (
        <p></p>
    );
}

// export const TestCardsRenderer = ({address}: AddresseProps) =>{
//     const cardType = "HOLD";
//     const id = "000";
//     const name = "TEST";
//     const data: boolean = false;
//     const updated = "2022-9-11";
//     return (
//         <CardRenderer cardType={cardType} id={id} name={name} data={data} updated={updated}></CardRenderer>
//     );
// }

type AddressesProps = {
    evmAddress: string;
    idenaAddress: string;
}

const evmRunes: DataRunesGroup = {
    name: "",
    items: APIsData.evm
};
const idenaRunes: DataRunesGroup = {
    name: "",
    items: APIsData.idena
};

export const CardsRenderer = ({evmAddress, idenaAddress} : AddressesProps) => {
    return (
        <VStack spacing={4} w='100%'>
            <Box bg='gray.50' w='100%' p={2} color='gray' fontSize={24}>EVM Compatible</Box>
            <SimpleCardsRenderer address={evmAddress} runes={evmRunes} />
            <Box bg='gray.50' w='100%' p={2} color='gray' fontSize={24}>Idena</Box>
            <SimpleCardsRenderer address={idenaAddress} runes={idenaRunes} />
            {/* <Box bg='gray.50' w='100%' p={2} color='gray' fontSize={24}>TEST</Box>
            <TestCardsRenderer address={evmAddress} /> */}
        </VStack>
    );
}