import React from 'react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Link,
  Container,
  useDisclosure,
  Stack,
  HStack,
  Text,
  IconButton,
  useToast,
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
// import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { Logo } from '../icons/Logo';
import { ethers } from 'ethers';
import { EmptyCids, EmptyDNA, ViewData, ViewMdoelBridge } from '../client/ViewData';
// import { CeramicContext } from '../client/CeramicContext';
// import { EthereumAuthProvider, useViewerConnection } from '@self.id/framework';
import { DotbitContext } from '../client/DotbitContext';
import { ENSContext } from '../client/ENSContext';
import { RoutesData } from '../client/RoutesData';
import { buildSignContent, buildSignContent2, requestETHNetwork } from '../client/Wallet';
import axios from 'axios';
import { APIs } from '../services/APIs';
import { AppSettings } from '../client/AppData';
import { ArweaveIcon, ETHIcon, SolanaIcon } from '../icons/Icons';
import Arweave from 'arweave';
import { PermissionType } from 'arconnect';
//import * as solanaWeb3 from "@solana/web3.js";

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [connection, connect, disconnect] = useViewerConnection();
  const [currentEth, setCurrentEth] = React.useState(ViewData.eth);
  const [currentAr, setCurrentAr] = React.useState(ViewData.ar);
  const [currentSol, setCurrentSol] = React.useState(ViewData.sol);
  const [accountActivated, setAccountActivated]= React.useState(ViewData.activated);
  const [displayName, setDisplayName] = React.useState(ViewData.displayName);
  const toast = useToast();
  const navigate = useNavigate();
  //const cxtCeramic: CeramicContext = ViewData.ceramicContext;

  const getDIDs = async (provider: ethers.providers.Web3Provider) => {
    const cxtDotbit = new DotbitContext();
    await cxtDotbit.useAddress(ViewData.eth);
    ViewData.did.dotbit = cxtDotbit.did;
    ViewMdoelBridge.DotbitContext = cxtDotbit;
    
    const cxtEns = new ENSContext(provider);
    await cxtEns.useAddress(ViewData.eth);
    ViewData.did.ens = cxtEns.did;
    ViewMdoelBridge.ENSContext = cxtEns;

    ViewData.displayName = cxtDotbit.did || cxtEns.did || "";
    setDisplayName(ViewData.displayName);
    
    //console.log("DIDs:" + ViewData.displayName);
    console.log(ViewData.did);
  };

  const tryConnectETH = async () => {
    const ethereum = (window as any).ethereum;
    if(!ethereum){
      toast({
        title: 'No wallet detected!',
        description: "Please install a wallet extension first.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const ethNetwork = await requestETHNetwork(ethereum);
    if(ethNetwork){ // null = success
      toast({
        title: 'The ENS function needs ETH mainnet',
        description: "Please switch to Ethereum Mainnet.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];
    const msgContent = buildSignContent(account);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner(account);

    const signature = await signer.signMessage(msgContent);
    if(!signature)
      return;
    //console.log("signature: " + signature);
    const res = await axios.post(APIs.AuthenticateWallet_ETH, {
      message: msgContent,
      signature: signature
    });
    const data = res.data;
    if(data && data.success === true){
      ViewData.ethSigner = signer;
      ViewData.eth = account;
      setCurrentEth(ViewData.eth);
      
      console.log("Connected to: " + data.account);
      await getDIDs(provider);
      ViewData.loggedIn = true;
      toast({
        title: 'Connected!',
        description: "Your ETH address: " + ViewData.eth,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if(data.dna && data.dna.id.length > 1){ // activated
        ViewMdoelBridge.DNA = data.dna;
        ViewMdoelBridge.Cids = data.cids;
        ViewData.activated = true;
        setAccountActivated(true);
        ViewData.afterLoggedIn();
        navigate(RoutesData.Profile);
      }
      else{
        ViewData.afterLoggedIn();
        navigate(RoutesData.Activate);
      }
    }
  };

  const tryDisConnectETH = async () => {
    //disconnect();
    ViewData.eth = "";
    ViewData.displayName = "";
    ViewData.did = {dotbit: "", ens: ""};
    ViewData.loggedIn = false;
    ViewData.activated = false;
    setCurrentEth("");
    ViewMdoelBridge.DNA = EmptyDNA;
    ViewMdoelBridge.Cids = EmptyCids;
    //cxtCeramic.selfid = null;
    // toast({
    //   title: 'Disconnected!',
    //   description: "Now you're a guest!",
    //   status: 'info',
    //   duration: 3000,
    //   isClosable: true,
    // });
    navigate(RoutesData.Home);
  }

  const tryConnectArweave = async () => {
    // arweave.js
    const ar = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    const arWallet = window.arweaveWallet;
    if(!arWallet){
      toast({
        title: 'No Arweave wallet detected!',
        description: "Your should install a Arweave wallet first.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    const permissions: Array<PermissionType> = ['ACCESS_ADDRESS', 'SIGNATURE', 'ACCESS_PUBLIC_KEY'];//
    await arWallet.connect(permissions, {
      name: "DNA"
    }, {
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    const address = await arWallet.getActiveAddress();
    const pk = await arWallet.getActivePublicKey();
    if(address){
      const msgContent = buildSignContent(address);
      const msgData = Arweave.utils.stringToBuffer(msgContent);
      const sigData = await arWallet.signature(msgData, {
        name: "RSA-PSS",
        saltLength: 32,
      });
      const signature = Arweave.utils.bufferTob64(sigData);
      const res = await axios.post(APIs.AuthenticateWallet_Arweave, {
        message: msgContent,
        signature: signature,
        publicKey: pk
      });
      const data = res.data;
      console.log(data);
      if(data && data.success === true){
        if(data.account !== address){
          toast({
            title: 'Wrong account!',
            description: "Please switch to: " + data.account,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        ViewData.ar = address;
        setCurrentAr(address);
        toast({
          title: 'Connected!',
          description: "Your Arweave address: " + ViewData.ar,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }
  const tryDisconnectArweave = async () => {
    //const ar = ViewData.arweave as Arweave;
    ViewData.ar = "";
    setCurrentAr("");
    ViewData.arweave = null;
  }

  const tryConnectSolana = async () => {
    //solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), )
    const solProvider = (window as any).solana;
    if(!solProvider){
      toast({
        title: 'No wallet detected!',
        description: "Please install a Solana wallet first.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const resp = await solProvider.connect();
      console.log("Public Key: " + resp.publicKey.toString());
      const address = resp.publicKey.toString();
      if(address){
        const message = buildSignContent(address);
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await solProvider.signMessage(encodedMessage, "utf8");
        // {"signature":{"type":"Buffer","data":[220,244,147,48,85,8,90,211,153,190,218,244,15,162,88,221,208,65,146,189,176,228,118,173,84,95,110,153,0,192,139,191,253,82,137,130,34,32,155,57,203,174,84,110,33,169,234,82,15,146,39,115,71,1,249,166,152,234,155,5,122,110,231,15]},
        // "publicKey":"4Dio1pbs5jZAdkhh9n6pnXQmHXamBBCqw3eRt5Ut5hEn"}
        //const signature = new TextDecoder().decode(signedMessage.signature.data);
        const signature = JSON.stringify(signedMessage);
        const res = await axios.post(APIs.AuthenticateWallet_SOL, {
          message: message,
          signature: signature
        });
        const data = res.data;
        if(data && data.success === true){
          if(data.account !== address){
            toast({
              title: 'Wrong account!',
              description: "Please switch to: " + data.account,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }
          ViewData.sol = address;
          setCurrentSol(address);
          toast({
            title: 'Connected!',
            description: "Your Solana address: " + ViewData.sol,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || err,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
  }
  const tryDisconnectSolana = async () => {
    const solProvider = (window as any).solana;
    if(solProvider){
      solProvider.disconnect();
    }
    ViewData.sol = "";
    setCurrentSol("");
  }

  const afterActivated = () => {
    setAccountActivated(ViewData.activated);
  }
  ViewData.afterActivated = afterActivated;
  // <Button isDisabled={connection.status === 'connecting'}
  const renderConnectMenu = () => {
    return (
      <Menu>
        <MenuButton as={Button}>Connect</MenuButton>
        <MenuList>
          {currentEth && currentEth.length >= 40 ? null : <MenuItem icon={<ETHIcon/>} onClick={tryConnectETH}>ETH | EVM</MenuItem>}
          {currentAr && currentAr.length > 40 ? null : <MenuItem icon={<ArweaveIcon/>} onClick={tryConnectArweave}>Arweave</MenuItem>}
          {currentSol && currentSol.length > 40 ? null : <MenuItem icon={<SolanaIcon/>} onClick={tryConnectSolana}>Solana</MenuItem>}
        </MenuList>
      </Menu>
    );
  };
  const renderUserMenus = () => {
    if(!currentEth || currentEth.length < 42){
      return null;
    }
    return (
      <Menu>
        <MenuButton
                as={Button}
                rounded={'full'}
                cursor={'pointer'}
                minW={0}>
          <HStack>
            <Avatar size={'sm'}/>
            <Text ml={1} verticalAlign="middle">{displayName}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          {/* <MenuItem as={ReactLink} to={RoutesData.Activate} visibility={accountActivated ? "hidden" : "visible"}>Activate</MenuItem> */}
          {/* <MenuItem as={ReactLink} to={RoutesData.Manage}>Manage</MenuItem> */}
          <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect ETH</MenuItem>
          {currentAr && currentAr.length > 40 ? <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect Arweave</MenuItem> : null }
          {currentSol && currentSol.length > 40 ? <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect Solana</MenuItem> : null }
        </MenuList>
      </Menu>
    );
  };

  const renderUserNav = () => {
    if(!currentEth || currentEth.length < 42){
      return (
        <></>
      );
    }
    return (
      <Link as={ReactLink} to={RoutesData.Manage}>Manage</Link>
    );
  };

  // React.useEffect(() => {
  //   if(ViewData.eth && !cxtCeramic.selfid && connection.status === "idle"){
  //     doConnect(ViewData.eth);
  //   }
  // });

  return (
    <Box w="100%" bg="gray.50" px={4}>
      <Container as={Stack} maxW={'6xl'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8}>
            <Logo boxSize={16} title="DNA"/>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
              {/* <Link as={ReactLink} to={RoutesData.Activate} visibility={!ViewData.eth || accountActivated ? "hidden" : "visible"}>Activate</Link> */}
              {/* <Link as={ReactLink} to={RoutesData.Manage} visibility={ViewData.eth && ViewData.activated ? "visible" : "hidden"}>Manage</Link> */}
              {ViewData.loggedIn && accountActivated ? <Link as={ReactLink} to={RoutesData.Profile}>Profile</Link> : null }
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <HStack direction={'row'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {!ViewData.loggedIn || accountActivated ? null : <Link as={ReactLink} to={RoutesData.Activate}>Activate</Link>}
              {renderConnectMenu()}
              {renderUserMenus()}
              {/* <ColorModeSwitcher /> */}
            </HStack>
          </Flex>
        </Flex>
      </Container>
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
            {ViewData.loggedIn ? null : <Link as={Button} onClick={(e:any)=>{tryConnectETH();}}>Connect</Link>}
            {/* <Link as={ReactLink} to={RoutesData.Activate} visibility={ViewData.eth && accountActivated ? "hidden" : "visible"}>Activate</Link> */}
            {/* <Link as={ReactLink} to={RoutesData.Manage} visibility={ViewData.eth && ViewData.activated ? "visible" : "hidden"}>Manage</Link> */}
            {/* <Link as={ReactLink} to={RoutesData.Profile} visibility={ViewData.loggedIn && accountActivated ? "visible" : "hidden"}>Profile</Link> */}
            {ViewData.loggedIn && accountActivated ? <Link as={ReactLink} to={RoutesData.Profile}>Profile</Link> : null}
            {ViewData.loggedIn && !accountActivated ? <Link as={ReactLink} to={RoutesData.Activate}>Activate</Link> : null}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
