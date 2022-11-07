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
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from '../icons/Logo';
import { ethers } from 'ethers';
import { EmptyCids, EmptyDNA, ViewData, ViewMdoelBridge } from '../client/ViewData';
// import { CeramicContext } from '../client/CeramicContext';
// import { EthereumAuthProvider, useViewerConnection } from '@self.id/framework';
import { DotbitContext } from '../client/DotbitContext';
import { ENSContext } from '../client/ENSContext';
import { RoutesData } from '../client/RoutesData';
import { AccountKeys, WalletUtility } from '../client/Wallet';
import { APIs } from '../services/APIs';
import { ArweaveIcon, ETHIcon, SolanaIcon } from '../icons/Icons';

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [connection, connect, disconnect] = useViewerConnection();
  const [currentEth, setCurrentEth] = React.useState(ViewData.eth);
  const [currentAr, setCurrentAr] = React.useState(ViewData.ar);
  const [currentSol, setCurrentSol] = React.useState(ViewData.sol);
  const [accountActivated, setAccountActivated] = React.useState(ViewData.activated);
  const [displayName, setDisplayName] = React.useState(ViewData.displayName);
  const toast = useToast();
  const navigate = useNavigate();
  //const cxtCeramic: CeramicContext = ViewData.ceramicContext;

  const getDIDs = async (provider: ethers.providers.Web3Provider) => {
    const cxtDotbit = new DotbitContext();
    try {
      await cxtDotbit.useAddress(ViewData.eth);
      ViewData.did.dotbit = cxtDotbit.did;
      ViewMdoelBridge.DotbitContext = cxtDotbit;
    }
    finally { }

    const cxtEns = new ENSContext(provider);
    try {
      await cxtEns.useAddress(ViewData.eth);
      ViewData.did.ens = cxtEns.did;
      ViewMdoelBridge.ENSContext = cxtEns;
    }
    finally { }

    ViewData.displayName = cxtDotbit.did || cxtEns.did || "";
    setDisplayName(ViewData.displayName);

    //console.log("DIDs:" + ViewData.displayName);
    console.log(ViewData.did);
  };

  const processDNAData = async (data: any) => {
    ViewData.loggedIn = true;
    ViewData.afterLoggedIn();
    if (data.dna && data.dna.id.length > 1) { // activated
      ViewData.activated = true;

      ViewMdoelBridge.DNA = data.dna;
      ViewMdoelBridge.Cids = data.cids;
      ViewMdoelBridge.DotbitContext = new DotbitContext();

      ViewData.eth = ViewMdoelBridge.DNA.genes.crypto.eth;
      ViewData.ar = ViewMdoelBridge.DNA.genes.crypto.ar;
      ViewData.sol = ViewMdoelBridge.DNA.genes.crypto.sol;
      ViewData.idena = ViewMdoelBridge.DNA.genes.crypto.idena;

      await ViewMdoelBridge.DotbitContext.useAddress(ViewData.eth);
      ViewData.did = {
        dotbit: ViewMdoelBridge.DNA.genes.dotbit,
        ens: ViewMdoelBridge.DNA.genes.ens
      };
      ViewData.displayName = ViewMdoelBridge.DNA.genes.dotbit || ViewMdoelBridge.DNA.genes.ens || "";
      setDisplayName(ViewData.displayName);

      setAccountActivated(true);
      //navigate(RoutesData.Profile);
      navigate(RoutesData.Manage);
    }
    else {
      if(ViewData.eth){
          await getDIDs(data.provider);
      }
      navigate(RoutesData.Activate);
    }
  };

  const tryConnectETH = async () => {
    await WalletUtility.connectEth("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_ETH,
      async (data: any) => {
        ViewData.ethSigner = data.signer;
        ViewData.eth = data.account;
        setCurrentEth(ViewData.eth);
        toast({
          title: 'Connected!',
          description: "Your ETH address: " + ViewData.eth,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.ETH;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
  };

  const tryDisConnectETH = async () => {
    //disconnect();
    ViewData.eth = "";
    ViewData.displayName = "";
    ViewData.did = { dotbit: "", ens: "" };
    ViewData.loggedIn = false;
    ViewData.activated = false;
    ViewData.keyOfPrimaryAccount = "";
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
    await WalletUtility.connectArweave("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_Arweave,
      async (data: any) => {
        ViewData.ar = data.account;
        setCurrentAr(data.account);
        toast({
          title: 'Connected!',
          description: "Your Arweave address: " + ViewData.ar,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.Arweave;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
  }
  const tryDisconnectArweave = async () => {
    //const ar = ViewData.arweave as Arweave;
    ViewData.ar = "";
    setCurrentAr("");
    ViewData.arweave = null;
    ViewData.displayName = "";
    ViewData.did = { dotbit: "", ens: "" };
    ViewData.loggedIn = false;
    ViewData.activated = false;
    ViewData.keyOfPrimaryAccount = "";
  }

  const tryConnectSolana = async () => {
    await WalletUtility.connectSolana("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_SOL,
      async (data: any) => {
        ViewData.sol = data.account;
        setCurrentSol(data.account);
        toast({
          title: 'Connected!',
          description: "Your Solana address: " + ViewData.sol,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.Solana;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
  }
  const tryDisconnectSolana = async () => {
    const solProvider = (window as any).solana;
    if (solProvider) {
      solProvider.disconnect();
    }
    setCurrentSol("");
    ViewData.sol = "";
    ViewData.displayName = "";
    ViewData.did = { dotbit: "", ens: "" };
    ViewData.loggedIn = false;
    ViewData.activated = false;
    ViewData.keyOfPrimaryAccount = "";
  }

  const afterActivated = () => {
    setAccountActivated(ViewData.activated);
  }
  ViewData.afterActivated = afterActivated;
  // <Button isDisabled={connection.status === 'connecting'}
  const renderConnectMenu = () => {
    if (ViewData.loggedIn) return null;
    return (
      <Menu>
        <MenuButton as={Button}>Connect</MenuButton>
        <MenuList>
          {currentEth && currentEth.length >= 40 ? null : <MenuItem icon={<ETHIcon />} onClick={tryConnectETH}>ETH | EVM</MenuItem>}
          {currentAr && currentAr.length > 40 ? null : <MenuItem icon={<ArweaveIcon />} onClick={tryConnectArweave}>Arweave</MenuItem>}
          {currentSol && currentSol.length > 40 ? null : <MenuItem icon={<SolanaIcon />} onClick={tryConnectSolana}>Solana</MenuItem>}
        </MenuList>
      </Menu>
    );
  };
  const renderUserMenus = () => {
    if (!currentEth || currentEth.length < 42) {
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
            <Avatar size={'sm'} />
            <Text ml={1} verticalAlign="middle">{displayName}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          {/* <MenuItem as={ReactLink} to={RoutesData.Activate} visibility={accountActivated ? "hidden" : "visible"}>Activate</MenuItem> */}
          <MenuItem as={ReactLink} to={RoutesData.Manage}>Manage</MenuItem>
          <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect ETH</MenuItem>
          {currentAr && currentAr.length > 40 ? <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect Arweave</MenuItem> : null}
          {currentSol && currentSol.length > 40 ? <MenuItem onClick={() => { tryDisConnectETH(); }}>Disconnect Solana</MenuItem> : null}
        </MenuList>
      </Menu>
    );
  };

  const renderUserNav = () => {
    if (!currentEth || currentEth.length < 42) {
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
            <Logo boxSize={16} title="DNA" />
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
              {/* <Link as={ReactLink} to={RoutesData.Activate} visibility={!ViewData.eth || accountActivated ? "hidden" : "visible"}>Activate</Link> */}
              {/* <Link as={ReactLink} to={RoutesData.Manage} visibility={ViewData.eth && ViewData.activated ? "visible" : "hidden"}>Manage</Link> */}
              {ViewData.loggedIn && accountActivated ? <Link as={ReactLink} to={RoutesData.Profile}>Profile</Link> : null}
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
            {ViewData.loggedIn ? null : <Link as={Button} onClick={(e: any) => { tryConnectETH(); }}>Connect</Link>}
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
