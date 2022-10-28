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
import { buildSignContent } from '../client/Wallet';
import axios from 'axios';
import { APIs } from '../services/APIs';
import { AppSettings } from '../client/AppData';

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [connection, connect, disconnect] = useViewerConnection();
  const [currentAccount, setCurrentAccount] = React.useState(ViewData.eth);
  const [accountActivated, setAccountActivated]= React.useState(ViewData.activated);
  const [displayName, setDisplayName] = React.useState(ViewData.displayName);
  const toast = useToast();
  const navigate = useNavigate();
  //const cxtCeramic: CeramicContext = ViewData.ceramicContext;

  const getDIDs = async () => {
    const cxtDotbit = new DotbitContext();
    await cxtDotbit.useAddress(ViewData.eth);
    ViewData.did.dotbit = cxtDotbit.did;
    ViewMdoelBridge.DotbitContext = cxtDotbit;
    
    const cxtEns = new ENSContext();
    await cxtEns.useAddress(ViewData.eth);
    ViewData.did.ens = cxtEns.did;
    ViewMdoelBridge.ENSContext = cxtEns;

    ViewData.displayName = cxtEns.did || cxtDotbit.did || "";
    setDisplayName(ViewData.displayName);
    
    console.log("DIDs:" + ViewData.displayName);
    console.log(ViewData.did);
  };

  // const doConnect = async (account: string) => {
  //   console.log("Connections status: " + connection.status);
  //   const ethereum = (window as any).ethereum;
  //   cxtCeramic.selfid = await connect(new EthereumAuthProvider(ethereum, account));
  //   console.log("Connections status: " + connection.status);
  //   //const core = cxtCeramic.selfid?.client.ceramic;

  //   if(ViewData.eth !== account){
  //     ViewData.eth = account;
  //     setCurrentAccount(ViewData.eth);
  //   }
  //   toast({
  //     title: 'Connected!',
  //     description: "Your wallet address: " + ViewData.eth,
  //     status: 'success',
  //     duration: 3000,
  //     isClosable: true,
  //   });
  //   await getDIDs();
  // };
  // const tryConnect = async () => {
  //   const ethereum = (window as any).ethereum;
  //   if(!ethereum){
  //     toast({
  //       title: 'No wallet detected!',
  //       description: "Please install a wallet extension first.",
  //       status: 'error',
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     return;
  //   }
  //   const accounts = await ethereum.request({method: "eth_requestAccounts"});
  //   doConnect(accounts[0]);
  // };

  const tryConnect = async () => {
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
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];
    const msgContent = buildSignContent(account);

    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner(account);

    const signature = await signer.signMessage(msgContent);
    if(!signature)
      return;
    //console.log("signature: " + signature);
    const res = await axios.post(APIs.Account_Authenticate, {
      message: msgContent,
      signature: signature
    });
    const data = res.data;
    if(data && data.success === true){
      ViewData.signer = signer;
      ViewData.eth = account;
      setCurrentAccount(ViewData.eth);
      
      console.log("Connected to: " + data.account);
      await getDIDs();
      ViewData.loggedIn = true;
      toast({
        title: 'Connected!',
        description: "Your wallet address: " + ViewData.eth,
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

  const tryDisConnect = async () => {
    //disconnect();
    ViewData.eth = "";
    ViewData.displayName = "";
    ViewData.did = {dotbit: "", ens: ""};
    ViewData.loggedIn = false;
    ViewData.activated = false;
    setCurrentAccount("");
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

  const afterActivated = () => {
    setAccountActivated(ViewData.activated);
  }
  ViewData.afterActivated = afterActivated;
  // <Button isDisabled={connection.status === 'connecting'}
  const renderUserMenus = () => {
    if(!currentAccount || currentAccount.length < 42){
      return (
        <Button onClick={(e:any)=>{tryConnect();}}>Connect</Button>
      );
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
          <MenuItem onClick={() => { tryDisConnect(); }}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  const renderUserNav = () => {
    if(!currentAccount || currentAccount.length < 42){
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
              <Link as={ReactLink} to={RoutesData.Profile} visibility={ViewData.loggedIn && accountActivated ? "visible" : "hidden"}>Profile</Link>
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <HStack direction={'row'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={ReactLink} to={RoutesData.Activate} visibility={!ViewData.loggedIn || accountActivated ? "hidden" : "visible"}>Activate</Link>
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
            {ViewData.loggedIn ? null : <Link as={Button} onClick={(e:any)=>{tryConnect();}}>Connect</Link>}
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
