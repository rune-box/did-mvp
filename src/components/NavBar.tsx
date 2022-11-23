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
  MenuGroup,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Logo } from '../icons/Logo';
import { ethers } from 'ethers';
import { EmptyCids, EmptyDNA, ViewData, ViewMdoelBridge } from '../client/ViewData';
// import { CeramicContext } from '../client/CeramicContext';
// import { EthereumAuthProvider, useViewerConnection } from '@self.id/framework';
import { DotbitContext } from '../client/DotbitContext';
import { ENSContext } from '../client/ENSContext';
import { AccountKeys } from "../client/Constants";
import { RoutesData } from '../client/RoutesData';
import { WalletUtility } from '../client/Wallet';
import { APIs } from '../services/APIs';
import { AlgoIcon, ArIcon, AtomIcon, BtcIcon, CkbIcon, DotIcon, EthIcon, SolIcon } from '../icons/Icons';
import { SignatureForm } from './SignatureForm';

export const NavBar = () => {
  const { isOpen: isHamburgerOpen, onOpen: onHamburgerOpen, onClose: onHamburgerClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const btnRefDrawer = React.useRef(null);
  //const [connection, connect, disconnect] = useViewerConnection();
  const [currentEth, setCurrentEth] = React.useState(ViewData.eth);
  const [currentAr, setCurrentAr] = React.useState(ViewData.ar);
  const [currentAtom, setCurrentAtom] = React.useState(ViewData.atom);
  const [currentDot, setCurrentDot] = React.useState(ViewData.dot);
  const [currentSol, setCurrentSol] = React.useState(ViewData.sol);
  const [currentAlgo, setCurrentAlgo] = React.useState(ViewData.algo);
  const [verifyUri, setVerifyUri] = React.useState("");
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

      await ViewMdoelBridge.refreshViewDataByDNA();
      setDisplayName(ViewData.displayName);

      setAccountActivated(true);
      navigate(RoutesData.Nav);
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

  const tryConnectCosmos = async () => {
    await WalletUtility.connectCosmos("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_Cosmos,
      async (data: any) => {
        ViewData.atom = data.account;
        setCurrentAtom(data.account);
        toast({
          title: 'Connected!',
          description: "Your Cosmos address: " + ViewData.atom,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.Atom;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
  }

  const tryConnectPolkadot = async () => {
    await WalletUtility.connectPolkadot("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_Polkadot,
      async (data: any) => {
        ViewData.dot = data.account;
        setCurrentDot(data.account);
        toast({
          title: 'Connected!',
          description: "Your Polkadot address: " + ViewData.dot,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.Polkadot;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
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

  const tryConnectAlgo = async () => {
    await WalletUtility.connectAlgo("", WalletUtility.buildSignContent, APIs.AuthenticateWallet_Algo,
      async (data: any) => {
        ViewData.algo = data.account;
        setCurrentSol(data.account);
        toast({
          title: 'Connected!',
          description: "Your Algorand address: " + ViewData.algo,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = AccountKeys.Algorand;
        await processDNAData(data);
      },
      () => { },
      () => { },
      toast);
  }

  const tryDisConnect = async () => {
    setCurrentEth("");
    setCurrentAr("");
    setCurrentAtom("");
    setCurrentDot("");
    setCurrentSol("");

    setAccountActivated(false);
    setDisplayName("");
    
    ViewData.eth = "";
    ViewData.ar = "";
    ViewData.atom = "";
    ViewData.dot = "";
    ViewData.sol = "";

    ViewData.displayName = "";
    ViewData.did = { dotbit: "", ens: "" };
    ViewData.loggedIn = false;
    ViewData.activated = false;
    ViewData.keyOfPrimaryAccount = "";
    ViewMdoelBridge.DNA = EmptyDNA;
    ViewMdoelBridge.Cids = EmptyCids;

    navigate(RoutesData.Home);
  }

  const verifySig = async (account: string, message: string, signature: string) => {
    await WalletUtility.submitSignature(verifyUri, account, message, signature, 
      async (data: any) => {
        toast({
          title: 'Connected!',
          description: "Your address: " + data.account,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        ViewData.keyOfPrimaryAccount = APIs.getKeyFromUri(verifyUri);
        await processDNAData(data);
        setVerifyUri("");
      },
      () => {
        setVerifyUri("");
      },
      toast);
  }

  const connectBySignature = async (uri: string) => {
    if(!uri){
      toast({
        title: 'Error',
        description: "The request URI is empty.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setVerifyUri(uri);
    onDrawerOpen();
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
        <MenuButton as={Button}>Login</MenuButton>
        <MenuList>
          <MenuGroup title='Connect'>
            {currentEth && currentEth.length >= 40 ? null : <MenuItem icon={<EthIcon />} onClick={tryConnectETH} isDisabled={WalletUtility.detectEthereum() === false}>ETH | EVM</MenuItem>}
            {currentAr && currentAr.length > 40 ? null : <MenuItem icon={<ArIcon />} onClick={tryConnectArweave} isDisabled={WalletUtility.detectArweave() === false}>Arweave</MenuItem>}
            {currentAtom && currentAtom.length > 40 ? null : <MenuItem icon={<AtomIcon />} onClick={tryConnectCosmos} isDisabled={WalletUtility.detectCosmos() === false}>Cosmos</MenuItem>}
            {currentDot && currentDot.length > 40 ? null : <MenuItem icon={<DotIcon />} onClick={tryConnectPolkadot} isDisabled={WalletUtility.detectPolkadot() === false}>Polkadot</MenuItem>}
            {currentSol && currentSol.length > 40 ? null : <MenuItem icon={<SolIcon />} onClick={tryConnectSolana} isDisabled={WalletUtility.detectSolana() === false}>Solana</MenuItem>}
            {currentAlgo && currentAlgo.length > 40 ? null : <MenuItem icon={<AlgoIcon />} onClick={tryConnectAlgo}>Algorand</MenuItem>}
          </MenuGroup>
          <MenuGroup title='Sign Message'>
            <MenuItem icon={<BtcIcon/>} onClick={(e) => { connectBySignature(APIs.AuthenticateWallet_BTC); }} isDisabled={true}>Bitcoin</MenuItem>
            <MenuItem icon={<CkbIcon/>} onClick={(e) => { connectBySignature(APIs.AuthenticateWallet_CKB); }}>Nervos CKB</MenuItem>
          </MenuGroup>
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
          <MenuItem onClick={tryDisConnect}>Disconnect</MenuItem>
          {/* {currentAr && currentAr.length > 40 ? <MenuItem onClick={tryDisConnect}>Disconnect Arweave</MenuItem> : null}
          {currentAtom && currentAtom.length > 40 ? <MenuItem icon={<AtomIcon />} onClick={tryDisConnect}>Disconnect Cosmos</MenuItem> : null}
          {currentDot && currentDot.length > 40 ? <MenuItem icon={<DotIcon />} onClick={tryDisConnect}>Disconnect Polkadot</MenuItem> : null}
          {currentSol && currentSol.length > 40 ? <MenuItem onClick={() => { tryDisConnect }}>Disconnect Solana</MenuItem> : null} */}
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
    <>
    <Box w="100%" bg="gray.50" px={4}>
      <Container as={Stack} maxW={'6xl'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isHamburgerOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isHamburgerOpen ? onHamburgerClose : onHamburgerOpen}
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
              {ViewData.loggedIn ? null : <Link as={Button} onClick={tryConnectETH} isDisabled={WalletUtility.detectEthereum() === false}>Register</Link>}
              {renderConnectMenu()}
              {renderUserMenus()}
              {/* <ColorModeSwitcher /> */}
            </HStack>
          </Flex>
        </Flex>
      </Container>
      {isHamburgerOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Link as={ReactLink} to={RoutesData.Home}>Home</Link>
            {ViewData.loggedIn ? null : <Link as={Button} onClick={tryConnectETH} isDisabled={WalletUtility.detectEthereum() === false}>Register</Link>}
            {renderConnectMenu()}
            {/* <Link as={ReactLink} to={RoutesData.Activate} visibility={ViewData.eth && accountActivated ? "hidden" : "visible"}>Activate</Link> */}
            {/* <Link as={ReactLink} to={RoutesData.Manage} visibility={ViewData.eth && ViewData.activated ? "visible" : "hidden"}>Manage</Link> */}
            {/* <Link as={ReactLink} to={RoutesData.Profile} visibility={ViewData.loggedIn && accountActivated ? "visible" : "hidden"}>Profile</Link> */}
            {ViewData.loggedIn && accountActivated ? <Link as={ReactLink} to={RoutesData.Profile}>Profile</Link> : null}
            {ViewData.loggedIn && !accountActivated ? <Link as={ReactLink} to={RoutesData.Activate}>Activate</Link> : null}
          </Stack>
        </Box>
      ) : null}
    </Box>
    <Drawer size="lg"
        isOpen={isDrawerOpen}
        placement='right'
        onClose={onDrawerClose}
        finalFocusRef={btnRefDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Connect with signature</DrawerHeader>
          <DrawerBody>
            <SignatureForm defaultAddress="" defaultMessage="" buildMessage={WalletUtility.buildSignContent} onVerify={verifySig}/>
          </DrawerBody>
          <DrawerFooter>
            <IconButton icon={<CloseIcon />} aria-label={"Cancel"} m={2} isRound={true} variant='outline'
                    onClick={onDrawerClose}/>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
