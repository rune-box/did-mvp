import * as React from "react"
import {
  VStack,
  InputGroup,
  InputLeftAddon,
  Input
} from "@chakra-ui/react"
import { CardsRenderer } from "../components/cards/CardsRenderer"
import { ENSContext } from "../client/ENSContext"
import { DotbitContext } from "../client/DotbitContext"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/Footer"
import { loadAppData, resetAppData } from "../client/AppData"
import { EmptyDNA, ViewData, ViewMdoelBridge } from "../client/ViewData"
import { AccountInfo } from "../components/AccountInfo"

export const ProfileView = () => {
  // const param = loadAppData();
  // const [did, setDID] = React.useState(param);
  // const [evmAddress, setEvmAddress] = React.useState('');
  // const [idenaAddress, setIdenaAddress] = React.useState('');

  // const ctxEns = new ENSContext();
  // const ctxDotbit = new DotbitContext();
  // const processDid = (newid: string) => {
  //   if(newid && newid.length > 4){
  //     const lower = newid.toLocaleLowerCase();
  //     if(lower.endsWith(".eth")){
  //       ctxEns.useDid(newid).then(() => {
  //         setEvmAddress(ctxEns.evmAddress);
  //       });
  //     }
  //     else if(lower.endsWith(".bit")){
  //       ctxDotbit.useDid(newid).then(() => {
  //         setEvmAddress(ctxDotbit.evmAddress);
  //       });
  //     }
  //     else{
  //       setEvmAddress("");
  //     }
  //   }
  //   else{
  //     resetAppData();
  //     setEvmAddress("");
  //   }
  // }

  // if(param) processDid(param);

  return (
    <VStack spacing={4}>
      <NavBar />
      <AccountInfo />
      <CardsRenderer evmAddress={ViewMdoelBridge.DNA.genes.crypto.eth} idenaAddress={ViewMdoelBridge.DNA.genes.crypto.idena} />
      <Footer />
    </VStack>
  );
}