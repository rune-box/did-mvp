import { ArrowBackIcon, ArrowForwardIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, AlertTitle, Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, Heading, HStack, IconButton, Input, InputGroup, InputLeftElement, List, ListItem, Menu, MenuButton, MenuItem, MenuList, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useDisclosure, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { Step, Steps, useSteps } from "chakra-ui-steps";
//import { githubAuthorize, githubVerify, twitterAuthorize, twitterVerify } from "@cyberlab/social-verifier";
import React, { useEffect } from "react";
//import { useViewerRecord } from "@self.id/framework";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../client/RoutesData";
//import { CeramicContext } from "../client/CeramicContext";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";
import { AccountKeys, WalletUtility } from "../client/Wallet";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { ArweaveIcon, AtomIcon, ETHIcon, IdenaIcon, SolanaIcon } from "../icons/Icons";
import { Account2, Account4 } from "../models/Account";
import { APIs, AuthAPIs } from "../services/APIs";
import { delay } from "../utils/threads";
import { Utility } from "../utils/Utility";

export const ManageView = () => {
    // current genes
    const [eth, setEth] = useState(ViewData.eth);
    const [ar, setAr] = useState(ViewData.ar);
    const [atom, setAtom] = useState(ViewData.atom);
    const [sol, setSol] = useState(ViewData.sol);
    const [idena, setIdena] = useState(ViewData.idena);
    const [deletingKey, setDeletingKey] = useState("");
    // new genes
    const [checkingIdena, setCheckingIdena] = React.useState(false);
    //const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const [gistContent, setGistContent] = useState("");
    const [gistId, setGistId] = useState("");
    
    const [addedAccounts, setAddedAccounts] = useState(new Array<Account2>());
    const [deletedAccounts, setDeletedAccounts] = useState(new Array<Account2>());
    const [signers, setSigners] = useState(ViewMdoelBridge.getSigners());
    const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
    const cancelRef = React.useRef(null);
    const { nextStep, prevStep, reset, activeStep } = useSteps({
        initialStep: 0,
    });
    const [nextStepDisabled, setNextStepDisabled] = React.useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    //const record = useViewerRecord("cryptoAccounts");
    
    const uriIdenaDesktop = AuthAPIs.getLinkUri_Idena_Desktop(Utility.generatePlainUUID(), ViewMdoelBridge.DNA.hash);
    const uriIdenaWeb = AuthAPIs.getLinkUri_Idena_Web(Utility.generatePlainUUID(), ViewMdoelBridge.DNA.hash);
    //const cxtCeramic: CeramicContext = ViewData.ceramicContext;

    const namespace = "runebox";
    const checkCache = async () => {
        //test
        console.log("Signers:");
        console.log(signers);

        setNextStepDisabled(false);
    }

    const checkTheAdded = (key: string, account: string) => {
        let exists = addedAccounts.filter(i => i.account === account && i.key === key);
        if(exists.length > 0){
            return true;
        }
        exists = deletedAccounts.filter(i => i.account === account && i.key === key);
        if(exists.length > 0){
            return true;
        }
        // DNA
        switch(key){
            case AccountKeys.ETH:
                return ViewMdoelBridge.DNA.genes.crypto.eth === account.toLocaleLowerCase();
            case AccountKeys.Arweave:
                return ViewMdoelBridge.DNA.genes.crypto.ar === account;
            case AccountKeys.Atom:
                    return ViewMdoelBridge.DNA.genes.crypto.atom === account;
            case AccountKeys.Solana:
                return ViewMdoelBridge.DNA.genes.crypto.sol === account;
            case AccountKeys.Idena:
                return ViewMdoelBridge.DNA.genes.crypto.idena === account.toLocaleLowerCase();
        }
        return false;
    }
    const addAccount = (key: string, account: string) => {
        const exists = checkTheAdded(key, account);
        if(exists){
            toast({
                title: 'Exists!',
                description: "The same document already exists in DNA or the added/removed ones...",
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const item: Account2 = {
            key: key,
            account: account
        };
        setAddedAccounts([...addedAccounts, item]);
    }
    const linkEth = async () => {
        await WalletUtility.connectEth("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.ETH),
            async (data: any) => {
              addAccount(AccountKeys.ETH, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkArweave =async () => {
        await WalletUtility.connectArweave("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.Arweave),
            async (data: any) => {
                addAccount(AccountKeys.Arweave, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkCosmos =async () => {
        await WalletUtility.connectCosmos("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.Atom),
            async (data: any) => {
                addAccount(AccountKeys.Atom, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkSolana = async () => {
        await WalletUtility.connectSolana("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.Solana),
            async (data: any) => {
                addAccount(AccountKeys.Solana, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const checkIdena = async () => {
        setCheckingIdena(true);
        try{
            const res = await axios.get(APIs.CheckLinkIdena + "?dna=" + ViewMdoelBridge.DNA.hash);
            const data = res.data;
            if(data && data.success === true){
                addAccount(AccountKeys.Idena, data.account);
            }
            else{
                toast({
                    title: 'Idena Auth',
                    description: "Failed!",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        finally{
            setCheckingIdena(false);
        }
    }

    const tryDeleteAccount = () => {
        if(!deletingKey || deletingKey === ViewData.keyOfPrimaryAccount)
            return;
        const item = new Account2();
        item.key = deletingKey;
        switch(deletingKey){
            case AccountKeys.ETH:
                item.account = eth;
                setEth("");
                break;
            case AccountKeys.Arweave:
                item.account = ar;
                setAr("");
                break;
            case AccountKeys.Atom:
                    item.account = atom;
                    setAtom("");
                    break;
            case AccountKeys.Solana:
                item.account = sol;
                setSol("");
                break;
            case AccountKeys.Idena:
                item.account = idena;
                setIdena("");
                break;
        }
        setDeletedAccounts([...deletedAccounts, item]);
        setSigners(signers.filter(i => i.key !== item.key || i.account !== item.account));
        onDeleteAlertClose();
    }
    const restoreAccount = (item: Account2) => {
        if(!item) return;
        switch(item.key){
            case AccountKeys.ETH:
                setEth(item.account);
                break;
            case AccountKeys.Arweave:
                setAr(item.account);
                break;
            case AccountKeys.Atom:
                setAtom(item.account);
                break;
            case AccountKeys.Solana:
                setSol(item.account);
                break;
            case AccountKeys.Idena:
                setIdena(item.account);
                break;
        }
        setDeletedAccounts(deletedAccounts.filter(i => i.key !== item.key || i.account !== item.account));

        const signerItem = {
            key: item.key,
            account: item.account,
            done: false,
            working: false
        };
        setSigners([...signers, signerItem]);
    }
    const deleteFromAdded = (item: Account2) => {
        setAddedAccounts(addedAccounts.filter(i => i.key !== item.key || i.account !== item.account));
    }

    const drawAccountIcon = (key: string) => {
        if(!key) return;
        switch(key){
            case AccountKeys.ETH:
                return (<ETHIcon m={2}/>);
            case AccountKeys.Arweave:
                return (<ArweaveIcon m={2}/>);
            case AccountKeys.Atom:
                    return (<AtomIcon m={2}/>);
            case AccountKeys.Solana:
                return (<SolanaIcon m={2}/>);
            case AccountKeys.Idena:
                return (<IdenaIcon m={2}/>);
        }
    }

    const processSignResult = async (data: any) => {
        const index = signers.findIndex(i => i.account === data.account && i.key === data.key);
        if(index < 0){
            toast({
                title: 'Error!',
                description: "Unknown error: Success on server, but no data on client...",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        setWorking(signers[index], false, true);

        if(data.needMoreSignature === false){ // finished
            ViewMdoelBridge.DNA = data.dna;
            ViewMdoelBridge.Cids = data.cids;
            toast({
                title: 'Done!',
                description: "Let's have a look at you new DNA O(∩_∩)O",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            await delay(2000);
            navigate(RoutesData.Profile);
        }
    }
    const setWorking = (currentSigner: Account4, working: boolean, status: boolean) => {
        if(!currentSigner) return;
        const tempSigners = signers.filter(i => i.key !== currentSigner.key || i.account !== currentSigner.account);
        setSigners(tempSigners);
        currentSigner.working = working;
        currentSigner.done = status;
        if(working)
            setSigners([currentSigner, ...tempSigners]);
        else
            setSigners([...tempSigners, currentSigner]);
    }
    // const setTaskStatus = (currentSigner: Account4, status: boolean) => {
    //     if(!currentSigner) return;
    //     setSigners(signers.filter(i => i.key !== currentSigner.key || i.account !== currentSigner.account));
    //     currentSigner.done = status;
    //     if(status)
    //         setSigners([currentSigner, ...signers]);
    //     else
    //         setSigners([...signers, currentSigner]);
    // }

    const sign = async (item: Account4) => {
        // TODO: check
        if(item.done || item.working) return;
        if(deletedAccounts.length === 0 && addedAccounts.length ===0){
            toast({
                title: 'No changes',
                description: "No need to commit.",
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, item.key, item.account, addedAccounts, deletedAccounts, signers);
        setWorking(item, true, false);
        switch(item.key){
            case AccountKeys.ETH:
                await WalletUtility.connectEth(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.ETH),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    toast);
                break;
            case AccountKeys.Arweave:
                await WalletUtility.connectArweave(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Arweave),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    toast);
                break;
                case AccountKeys.Atom:
                    await WalletUtility.connectCosmos(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Atom),
                        async (data: any) => {
                            await processSignResult(data);
                        },
                        () => {
                            setWorking(item, false, false);
                        },
                        () => {
                            setWorking(item, false, false);
                        },
                        toast);
                break;
            case AccountKeys.Solana:
                await WalletUtility.connectSolana(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Solana),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    () => {
                        setWorking(item, false, false);
                    },
                    toast);
                break;
            case AccountKeys.Idena:
                break;
        }
    }

    // const prepareTwitter = async () => {
    //     if(!twitter || twitter.length < 1){
    //         return;
    //     }
    //     const sig = await twitterAuthorize((window as any).ethereum, ViewData.eth, twitter);
    //     const text = `Verifying my Web3 identity on @_runebox_: %23LetsRunes %0A ${sig}`;
    //     window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    // };
    // const verifyTwitter = async () => {
    //     const r = await twitterVerify(ViewData.eth, twitter, namespace);
    //     console.log(r);
    //     if(r.result === "SUCCESS"){
    //         ViewMdoelBridge.DNA.genes.social.twitter = twitter;
    //         toast({
    //             title: 'Success!',
    //             description: "Your wallet address has been linked to the Twitter account: " + twitter,
    //             status: 'success',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     }
    // };

    // const prepareGithub = async () => {
    //     if(!github || github.length < 1){
    //         return;
    //     }
    //     const sig = await githubAuthorize((window as any).ethereum, ViewData.eth, github);
    //     setGistContent(sig);
    // };
    // const verifyGithub = async () => {
    //     if(!github || github.length < 1 || !gistId){
    //         return;
    //     }
    //     const r = await githubVerify(ViewData.eth, gistId, namespace);
    //     console.log(r);
    //     if(r.result === "SUCCESS"){
    //         ViewMdoelBridge.DNA.genes.social.github = github;
    //         toast({
    //             title: 'Success!',
    //             description: "Your wallet address has been linked to the Github account: " + github,
    //             status: 'success',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     }
    // };

    const renderCurrentGenesSection = () => {
        return (
            <Wrap spacing="20px">
                {eth ? <WrapItem padding="10px">
                    <Box w='200px' h='200px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>ETH | EVM</Heading>
                        <Divider />
                        <Text height="50px" m={5}>{eth}</Text>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <IconButton size='sm' icon={<DeleteIcon/>} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === AccountKeys.ETH || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(AccountKeys.ETH);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                        </HStack>
                    </Box>
                </WrapItem> : null}
                {ar ? <WrapItem padding="10px">
                    <Box w='200px' h='200px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>Arweave</Heading>
                        <Divider />
                        <Text height="50px" m={5}>{ar}</Text>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <IconButton size='sm' icon={<DeleteIcon/>} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === AccountKeys.Arweave || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(AccountKeys.Arweave);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                        </HStack>
                    </Box>
                </WrapItem> : null}
                {atom ? <WrapItem padding="10px">
                    <Box w='200px' h='200px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>Cosmos</Heading>
                        <Divider />
                        <Text height="50px" m={5}>{atom}</Text>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <IconButton size='sm' icon={<DeleteIcon/>} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === AccountKeys.Atom || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(AccountKeys.Atom);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                        </HStack>
                    </Box>
                </WrapItem> : null}
                {sol ? <WrapItem padding="10px">
                    <Box w='200px' h='200px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>Solana</Heading>
                        <Divider />
                        <Text height="50px" m={5}>{sol}</Text>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <IconButton size='sm' icon={<DeleteIcon/>} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === AccountKeys.Solana || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(AccountKeys.Solana);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                        </HStack>
                    </Box>
                </WrapItem> : null}
                {idena ? <WrapItem padding="10px">
                    <Box w='200px' h='200px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>Idena</Heading>
                        <Divider />
                        <Text height="50px" m={5}>{idena}</Text>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <IconButton size='sm' icon={<DeleteIcon />} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === AccountKeys.Idena || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(AccountKeys.Idena);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                        </HStack>
                    </Box>
                </WrapItem> : null}
            </Wrap>
        );
    }
    const renderNewGenesSection = () => {
        return (
            <Accordion allowMultiple={true} defaultIndex={0}>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                        <Box flex='1' textAlign='left'>Crypto</Box>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <HStack>
                            {eth ? null : <Button leftIcon={<ETHIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.ETH)}
                                onClick={linkEth}>ETH | EVM</Button>}
                            {ar ? null :<Button leftIcon={<ArweaveIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Arweave)}
                                onClick={linkArweave}>Arweave</Button>}
                            {atom ? null :<Button leftIcon={<AtomIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Atom)}
                                onClick={linkArweave}>Arweave</Button>}
                            {sol ? null :<Button leftIcon={<SolanaIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Solana)}
                                onClick={linkSolana}>Solana</Button>}
                            {idena ? null :<Box height="40px" bgColor="gray.50" padding={1}>
                                <HStack marginLeft={1} marginRight={1} verticalAlign="middle">
                                    <Text fontWeight="bold">Idena: </Text>
                                    <Menu>
                                        <MenuButton as={Button} size='sm' aria-label="Connect" title="Connect" variant="outline"
                                             disabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Idena)} icon={<LinkIcon/>}>1. Link</MenuButton>
                                        <MenuList>
                                            <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaDesktop} target="_blank">Desktop App</MenuItem>
                                            <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaWeb} target="_blank">Web App</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <Button size='sm' leftIcon={<RepeatIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Idena)}
                                        isLoading={checkingIdena} onClick={checkIdena}>2. Check</Button>
                                </HStack>
                            </Box>}
                        </HStack>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                        <Box flex='1' textAlign='left'>Social</Box>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        // TODO
                        {/* <VStack w="100%">
                            <Text w="100%">Twitter</Text>
                            <Flex w="100%">
                                <InputGroup minW={300}>
                                    <Input pr='4.5rem' type='text' placeholder='@' minLength={1}
                                        value={twitter}
                                        onChange={(e) => {
                                            setTwitter(e.target.value);
                                        }} />
                                </InputGroup>
                                <Button leftIcon={<LinkIcon />} ml={3} onClick={prepareTwitter} >Prepare</Button>
                                <Button leftIcon={<CheckIcon />} ml={3} onClick={verifyTwitter} >Verify</Button>
                            </Flex>
                            <Divider mt={3} mb={3}/>
                            <Text w="100%">Github</Text>
                            <Flex w="100%">
                                <InputGroup minW={300}>
                                    <Input pr='4.5rem' type='text' placeholder='@' minLength={1}
                                        value={github} 
                                        onChange={(e) => {
                                            setGithub(e.target.value);
                                        }} />
                                </InputGroup>
                                <Button leftIcon={<LinkIcon />} ml={3} onClick={prepareGithub} >Prepare</Button>
                            </Flex>
                            <Text w="100%">The gist content:</Text>
                            <Textarea isReadOnly={true} value={gistContent} />
                            <Text w="100%">Gist URI:</Text>
                            <Flex w="100%">
                                <Input pr='4.5rem' type='url' placeholder='https://...' minLength={1}
                                        value={gistId} 
                                        onChange={(e) => {
                                            setGistId(e.target.value);
                                        }} />
                                <Button leftIcon={<CheckIcon />} ml={3} onClick={verifyGithub} >Verify</Button>
                            </Flex>
                        </VStack> */}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        );
    }

    const renderSignersSection = () => {
        return (
            // <Accordion defaultIndex={0} m={5} minWidth="600px" minHeight="200px">
            //     <AccordionItem>
            //         <h2>
            //             <AccordionButton>
            //             <Box flex='1' textAlign='left'>Multi-Sign to Mutate (Save)</Box>
            //             </AccordionButton>
            //         </h2>
            //         <AccordionPanel>
            //             <Wrap spacing={2} justify='center'>
            //                 {signers.map((item: Account4, index: number) =>(
            //                     <WrapItem key={index}>
            //                         <Button leftIcon={drawAccountIcon(item.key)}
            //                             colorScheme={item.done ? "green" : "cyan"}
            //                             isDisabled={item.done}
            //                             isLoading={item.working}
            //                             onClick={(e) => {sign(item);}}>{WalletUtility.getTitleByAccountKey(item.key)}</Button>
            //                     </WrapItem>
            //                 ))}
            //             </Wrap>
            //         </AccordionPanel>
            //     </AccordionItem>
            // </Accordion>
            <Box m={5} width="600px" height="300px" borderWidth={1} borderColor="green">
                <Wrap spacing={2} justify='center'>
                    {signers.map((item: Account4, index: number) =>(
                        <WrapItem key={index}>
                            <Button leftIcon={drawAccountIcon(item.key)}
                                colorScheme={item.done ? "green" : "cyan"}
                                isDisabled={item.done}
                                isLoading={item.working}
                                onClick={(e) => {sign(item);}}>{WalletUtility.getTitleByAccountKey(item.key)}</Button>
                        </WrapItem>
                    ))}
                </Wrap>
            </Box>
        );
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        checkCache();
      }, []);

    return (
        <VStack spacing={4}>
            <NavBar/>
            <Flex flexDir="column" width="100%">
                <Steps activeStep={activeStep}>
                    <Step label="Check Unfinished Records">
                        //Check
                    </Step>

                    <Step label="Remove">
                        <Grid w="100%" minHeight="500px" templateColumns="repeat(2, 1fr)" gap={1}>
                            <GridItem w="100%">
                                <Tabs>
                                    <TabList>
                                        <Tab>Action: Remove</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>{renderCurrentGenesSection()}</TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </GridItem>
                            <GridItem w="100%">
                                <Tabs>
                                    <TabList>
                                        <Tab color="red">Removed Items</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                        <List spacing={2}>
                                            {deletedAccounts.map((item: any, index: number) =>(
                                                <ListItem key={index}>
                                                    <HStack>
                                                        {drawAccountIcon(item.key)}
                                                        <Text>{item.account}</Text>
                                                        <IconButton ml={4} size="sm" aria-label={"Restore"} icon={<RepeatIcon/>} colorScheme="cyan" isRound={true}
                                                            onClick={() => { restoreAccount(item); }} />
                                                    </HStack>
                                                </ListItem>
                                            ))}
                                        </List>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </GridItem>
                        </Grid>
                        {true || deletedAccounts && deletedAccounts.length > 0 ? <Alert status='error'>
                        <AlertIcon />
                            <Box>
                                <AlertTitle>Attention!</AlertTitle>
                                <AlertDescription>
                                The deleted account will be in CoolDown state (365 days), it CANNOT be used to activate or link a account in these days.
                                </AlertDescription>
                            </Box>
                        </Alert> : null }
                    </Step>

                    <Step label="Add">
                        <Grid w="100%" minHeight="500px" templateColumns="repeat(2, 1fr)" gap={1}>
                            <GridItem w="100%">
                                <Tabs>
                                    <TabList>
                                        <Tab>Action: Add</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>{renderNewGenesSection()}</TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </GridItem>
                            <GridItem w="100%">
                                <Tabs>
                                    <TabList>
                                        <Tab color="blue.200">Added Items</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel>
                                        <List spacing={2}>
                                            {addedAccounts.map((item: any, index: number) =>(
                                                <ListItem key={index}>
                                                    <HStack>
                                                        {drawAccountIcon(item.key)}
                                                        <Text>{item.account}</Text>
                                                        <IconButton ml={4} size="sm" aria-label={"Remove"} icon={<DeleteIcon/>} colorScheme="red" isRound={true}
                                                            onClick={() => { deleteFromAdded(item); }} />
                                                    </HStack>
                                                </ListItem>
                                            ))}
                                        </List>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </GridItem>
                        </Grid>
                    </Step>

                    <Step label="Sign to Commit">
                        <VStack width="100%" height="500px" justify="center">
                            <Box width="100%" padding={5} bgColor="green.300">
                                <Text as="h4" color="white" textAlign="center">⬇⬇⬇ Are you ready? Let's sign one-by-one! ⬇⬇⬇</Text>
                            </Box>
                            {renderSignersSection()}
                        </VStack>
                    </Step>
                </Steps>
            </Flex>
            <Flex justify="space-between">
                <IconButton icon={<ArrowBackIcon />} aria-label={"Previous"} m={2} isRound={true} variant='outline'
                    isDisabled={activeStep === 0} onClick={prevStep}/>
                <Spacer/>
                <IconButton icon={<ArrowForwardIcon />} aria-label={"Next"} m={2} isRound={true} variant='outline'
                    isDisabled={nextStepDisabled} onClick={nextStep}/>
            </Flex>
            <Footer/>

            <AlertDialog isCentered
                isOpen={isDeleteAlertOpen} onClose={onDeleteAlertClose}
                leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Account
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure?
                    The deleted account will be in CoolDown state (365 days), it CANNOT be used to activate or link a account in these days.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={tryDeleteAccount} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
}