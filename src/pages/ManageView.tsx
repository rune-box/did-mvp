import { AddIcon, ArrowBackIcon, ArrowForwardIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon, DeleteIcon, LinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Alert, AlertDescription, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, AlertTitle, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Grid, GridItem, Heading, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, List, ListItem, Menu, MenuButton, MenuItem, MenuList, Select, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useDisclosure, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { Step, Steps, useSteps } from "chakra-ui-steps";
//import { githubAuthorize, githubVerify, twitterAuthorize, twitterVerify } from "@cyberlab/social-verifier";
import React, { useEffect } from "react";
//import { useViewerRecord } from "@self.id/framework";
import { useNavigate } from "react-router-dom";
import { AccountKeys } from "../client/Constants";
import { RoutesData } from "../client/RoutesData";
import { drawAccountIcon } from "../client/UIFunctions";
//import { CeramicContext } from "../client/CeramicContext";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";
import { WalletUtility } from "../client/Wallet";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SignatureForm } from "../components/SignatureForm";
import { SignersSection } from "../components/SignersSection";
import { AlgoIcon, ArIcon, AtomIcon, BtcIcon, CkbIcon, EthIcon, IdenaIcon, SolIcon, UnipassIcon } from "../icons/Icons";
import { Account2, Account4 } from "../models/Account";
import { SignActions } from "../models/Actions";
import { APIs, AuthAPIs } from "../services/APIs";
import { delay } from "../utils/threads";
import { Utility } from "../utils/Utility";

export const ManageView = () => {
    // current genes
    const [eth, setEth] = React.useState(ViewData.eth);
    const [ar, setAr] = React.useState(ViewData.ar);
    const [atom, setAtom] = React.useState(ViewData.atom);
    const [sol, setSol] = React.useState(ViewData.sol);
    const [algo, setAlgo] = React.useState(ViewData.algo);
    const [idena, setIdena] = React.useState(ViewData.idena);
    const [btc, setBtc] = React.useState(ViewData.btc);
    const [ckb, setCkb] = React.useState(ViewData.ckb);
    const [unipassid, setUnipassid] = React.useState(ViewData.unipassid);
    const [editingBtc, setEditingBtc] = React.useState("");
    const [deletingKey, setDeletingKey] = React.useState("");
    // new genes
    const [checkingIdena, setCheckingIdena] = React.useState(false);
    //const [twitter, setTwitter] = useState("");
    const [github, setGithub] = React.useState("");
    const [gistContent, setGistContent] = React.useState("");
    const [gistId, setGistId] = React.useState("");

    const [addedAccounts, setAddedAccounts] = React.useState(new Array<Account2>());
    const [deletedAccounts, setDeletedAccounts] = React.useState(new Array<Account2>());
    const [signers, setSigners] = React.useState(ViewMdoelBridge.getSigners());
    const [currentSigner, setCurrentSigner] = React.useState(new Account4());
    const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
    const cancelAlertDialogRef = React.useRef(null);

    const [currentMutisigThreshold, setCurrentMutisigThreshold] = React.useState(-1);
    const [newMutisigThreshold, setNewMutisigThreshold] = React.useState(-1);
    const [signedCount, setSignedCount] = React.useState(0);
    const [mutationMsg, setMutationMsg] = React.useState("");
    const [signAction, setSignAction] = React.useState("");
    const [sigKey, setSigKey] = React.useState("");
    const [verifyUri, setVerifyUri] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [message, setMessage] = React.useState("");
    const { isOpen: isLinkDrawerOpen, onOpen: onLinkDrawerOpen, onClose: onLinkDrawerClose } = useDisclosure();
    const btnRefLinkDrawer = React.useRef(undefined as any);
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

    const processCache = async (data: any) => {
        if (data && data.success === true) {
            if(data.existsUnfinished === true){
                toast({
                    title: 'There is a unfinished mutation!',
                    description: "Trying to reload...",
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
                if(data.tasks && data.tasks.length > 0){
                    setSigners(old => data.tasks);
                    setAddedAccounts(old => data.addedAccounts);
                    setDeletedAccounts(old => data.removedAccounts);
                    setNewMutisigThreshold(old => data.recombinationThreshold);
                }
                // else{
                //     toast({
                //         title: 'Error!',
                //         description: "Failed to reload the unfinished mutation...",
                //         status: 'error',
                //         duration: 5000,
                //         isClosable: true,
                //     });
                // }
            }
        }
        else {
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setNextStepDisabled(false);
        }
    }
    // const tryLoadCache = async () => {
    //     const message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, item.key, item.account, addedAccounts, deletedAccounts, signers, newMutisigThreshold);
    //     switch (item.key) {
    //         case AccountKeys.ETH:
    //             await WalletUtility.connectEth(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.ETH),
    //                 async (data: any) => {
    //                     await processSignResult(data);
    //                 },
    //                 () => {
    //                 },
    //                 () => {
    //                 },
    //                 toast);
    //             break;
    //         case AccountKeys.Arweave:
    //             await WalletUtility.connectArweave(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Arweave),
    //                 async (data: any) => {
    //                     await processSignResult(data);
    //                 },
    //                 () => {
    //                 },
    //                 () => {
    //                 },
    //                 toast);
    //             break;
    //         case AccountKeys.Atom:
    //             await WalletUtility.connectCosmos(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Atom),
    //                 async (data: any) => {
    //                     await processSignResult(data);
    //                 },
    //                 () => {
    //                 },
    //                 () => {
    //                 },
    //                 toast);
    //             break;
    //         case AccountKeys.Solana:
    //             await WalletUtility.connectSolana(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Solana),
    //                 async (data: any) => {
    //                     await processSignResult(data);
    //                 },
    //                 () => {
    //                 },
    //                 () => {
    //                 },
    //                 toast);
    //             break;
    //         case AccountKeys.Algorand:
    //             await WalletUtility.connectAlgo(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Algorand),
    //                 async (data: any) => {
    //                     await processSignResult(data);
    //                 },
    //                 () => {
    //                 },
    //                 () => {
    //                 },
    //                 toast);
    //             break;
    //         // case AccountKeys.Idena:
    //         //     break;
    //         // case AccountKeys.Bitcoin:
    //         //     callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Bitcoin), item);
    //         //     break;
    //         // case AccountKeys.NervosCKB:
    //         //     callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.NervosCKB), item);
    //         //     break;
    //     }
    // }
    const checkCache = async () => {
        const uri = APIs.getUri_CheckBeforeMutation(AccountKeys.ETH, ViewData.eth);
        const res = await axios.get(uri);
        const data = res.data;
        if (data && data.success === true) {
            // if(data.existsUnfinished === true){
            //     toast({
            //         title: 'There is a unfinished mutation!',
            //         description: "Trying to reload...",
            //         status: 'info',
            //         duration: 3000,
            //         isClosable: true,
            //     });
            //     if(data.tasks && data.tasks.length > 0){
            //         setSigners(old => data.tasks);
            //         setAddedAccounts(old => data.addedAccounts);
            //         setDeletedAccounts(old => data.removedAccounts);
            //         setNewMutisigThreshold(old => data.recombinationThreshold);
            //     }
            // }
            // if(data.passed === true && activeStep === 0){
            //     nextStep();
            // }
        }
        else {
            // 1. need refresh CIDs
            if(data.needRefreshCids === true){
                toast({
                    title: 'Attention!',
                    description: data.error,
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                });
                await delay(2000);
                navigate(RoutesData.Nav);
                return;
            }
            // 2. unknown error
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            //setNextStepDisabled(true);
        }
    }
    const getMultisigThreshold = async () => {
        if(currentMutisigThreshold > 0)
            return;
        const uri = APIs.getUri_GetRecombinationThreshold(ViewMdoelBridge.DNA.hash);
        const res = await axios.get(uri);
        const data = res.data;
        if (data && data.success === true) {
            setCurrentMutisigThreshold(data.recombinationThreshold);
            setNewMutisigThreshold(data.recombinationThreshold);
        }
        else {
            toast({
                title: 'Error!',
                description: data.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const checkTheAdded = (key: string, account: string) => {
        let exists = addedAccounts.filter(i => i.account === account && i.key === key);
        if (exists.length > 0) {
            return true;
        }
        exists = deletedAccounts.filter(i => i.account === account && i.key === key);
        if (exists.length > 0) {
            return true;
        }
        return ViewMdoelBridge.isInDNA(key, account);
    }
    const addAccount = (key: string, account: string) => {
        const exists = checkTheAdded(key, account);
        if (exists) {
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
    const linkArweave = async () => {
        await WalletUtility.connectArweave("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.Arweave),
            async (data: any) => {
                addAccount(AccountKeys.Arweave, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkCosmos = async () => {
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
    const linkAlgorand = async () => {
        await WalletUtility.connectAlgo("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.Algorand),
            async (data: any) => {
                addAccount(AccountKeys.Algorand, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkUnipassID = async () => {
        await WalletUtility.connectUnipassId("", WalletUtility.buildSignContent, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.UniPassID),
            async (data: any) => {
                addAccount(AccountKeys.UniPassID, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkNervosByUnipassID = async () => {
        await WalletUtility.connectNervosUsingUnipassId("", WalletUtility.buildSignContent2, APIs.getUri_LinkByUnipassId(ViewMdoelBridge.DNA.hash, ViewData.unipassid),
            async (data: any) => {
                addAccount(AccountKeys.NervosCKB, data.account);
            },
            () => { },
            () => { },
            toast);
    }
    const linkBySignature = async (key: string, uri: string) => {
        if (!uri) {
            toast({
                title: 'Error',
                description: "The request URI is empty.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setSignAction(SignActions.Link);
        setVerifyUri(uri);
        setSigKey(key);
        onLinkDrawerOpen();
    }

    const checkIdena = async () => {
        setCheckingIdena(true);
        try {
            const res = await axios.get(APIs.CheckLinkIdena + "?dna=" + ViewMdoelBridge.DNA.hash);
            const data = res.data;
            if (data && data.success === true) {
                addAccount(AccountKeys.Idena, data.account);
            }
            else {
                toast({
                    title: 'Idena Auth',
                    description: "Failed!",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        finally {
            setCheckingIdena(false);
        }
    }
    const tryAddAccount = async (key: string, account: string) => {
        const uri = APIs.getUri_AddLink(ViewMdoelBridge.DNA.hash, key);
        WalletUtility.checkAccount(uri, { address: account },
            async (data: any) => {
                addAccount(data.key, data.account);
                switch (data.key) {
                    case AccountKeys.Bitcoin:
                        setBtc(data.key);
                        setEditingBtc("");
                        break;
                }
            },
            () => { },
            toast);
    }

    const tryDeleteAccount = () => {
        if (!deletingKey || deletingKey === ViewData.keyOfPrimaryAccount)
            return;
        const item = new Account2();
        item.key = deletingKey;
        switch (deletingKey) {
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
            case AccountKeys.Algorand:
                item.account = algo;
                setAlgo("");
                break;
            case AccountKeys.Idena:
                item.account = idena;
                setIdena("");
                break;
            case AccountKeys.Bitcoin:
                item.account = btc;
                setBtc("");
                break;
            case AccountKeys.NervosCKB:
                item.account = ckb;
                setCkb("");
                break;
            case AccountKeys.UniPassID:
                item.account = unipassid;
                setUnipassid("");
                break;
        }
        setDeletedAccounts([...deletedAccounts, item]);
        setSigners(signers.filter(i => i.key !== item.key || i.account !== item.account));
        onDeleteAlertClose();
    }
    const restoreAccount = (item: Account2) => {
        if (!item) return;
        switch (item.key) {
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
            case AccountKeys.Algorand:
                setAlgo(item.account);
                break;
            case AccountKeys.Idena:
                setIdena(item.account);
                break;
            case AccountKeys.Bitcoin:
                setBtc(item.account);
                break;
            case AccountKeys.NervosCKB:
                setCkb(item.account);
                break;
            case AccountKeys.UniPassID:
                setUnipassid(item.account);
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

    const processSignResult = async (data: any) => {
        const index = signers.findIndex(i => i.account === data.account && i.key === data.key);
        if (index < 0) {
            toast({
                title: 'Error!',
                description: "Unknown error: Success on server, but no data on client...",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        setWorking(signers[index], false, true);
        setSignedCount(arg => arg +1);

        if (data.needMoreSignature === false) { // finished
            console.log("Multi-sig finished");
            console.log(data);
            ViewMdoelBridge.DNA = data.dna;
            ViewMdoelBridge.Cids = data.cids;
            await ViewMdoelBridge.refreshViewDataByDNA();
            toast({
                title: 'Done!',
                description: "Let's have a look at you new DNA O(∩_∩)O",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            await delay(2000);
            // TODO: should navigate to Setting page: update Muti-Sig threshold
            navigate(RoutesData.Profile);
        }
    }
    const setWorking = (currentSigner: Account4, working: boolean, status: boolean) => {
        if (!currentSigner) return;
        const tempSigners = signers.filter(i => i.key !== currentSigner.key || i.account !== currentSigner.account);
        setSigners(tempSigners);
        currentSigner.working = working;
        currentSigner.done = status;
        if (working)
            setSigners([currentSigner, ...tempSigners]);
        else
            setSigners([...tempSigners, currentSigner]);
    }

    const sign = async (item: Account4) => {
        // TODO: check
        if (item.done || item.working) return;
        if (deletedAccounts.length === 0 && addedAccounts.length === 0 && 
            currentMutisigThreshold === newMutisigThreshold) {
            toast({
                title: 'No changes',
                description: "No need to commit.",
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setCurrentSigner(item);
        // let message = mutationMsg;
        // if(message.length === 0){
        //     message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, item.key, item.account, addedAccounts, deletedAccounts, signers, newMutisigThreshold);
        //     setMutationMsg(message);
        // }
        const message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, item.key, item.account, addedAccounts, deletedAccounts, signers, newMutisigThreshold);
        setWorking(item, true, false);
        switch (item.key) {
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
            case AccountKeys.Algorand:
                await WalletUtility.connectAlgo(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Algorand),
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
            case AccountKeys.Bitcoin:
                callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Bitcoin), item);
                break;
            case AccountKeys.NervosCKB:
                callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.NervosCKB), item);
                break;
            case AccountKeys.UniPassID:
                await WalletUtility.connectUnipassId(message, WalletUtility.buildSignContent, APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.UniPassID),
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
        }
    }

    const verifySig = async (account: string, message: string, signature: string) => {
        if(signAction === SignActions.Link){
            await WalletUtility.submitSignature(verifyUri, account, message, signature,
                async (data: any) => {
                    addAccount(sigKey, account);
                    onLinkDrawerClose();
                },
                () => { },
                toast);
        } // link
        else if(signAction === SignActions.MutiSig){
            const signer = signers.find(i => i.key === sigKey && i.account === account);
            if (!signer) return;

            setWorking(signer, true, false);
            await WalletUtility.submitSignature(verifyUri, account, message, signature,
                async (data: any) => {
                    await processSignResult(data);
                },
                () => {
                    setWorking(signer, false, false);
                },
                toast);
        } // multi sig
    }

    const callMultiSigSignature = async (uri: string, signer: Account4) => {
        if (!uri) {
            toast({
                title: 'Error',
                description: "The request URI is empty.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setSignAction(SignActions.MutiSig);

        // let message = mutationMsg;
        // if(message.length === 0){
        //     message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, signer.key, signer.account, addedAccounts, deletedAccounts, signers, newMutisigThreshold);
        //     setMutationMsg(message);
        // }
        const message = WalletUtility.buildSignContent_MutateDNA(ViewMdoelBridge.DNA.hash, signer.key, signer.account, addedAccounts, deletedAccounts, signers, newMutisigThreshold);
        setMessage(message);
        setAddress(signer.account);
        setSigKey(signer.key);
        setVerifyUri(uri);
        onLinkDrawerOpen();
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

    const renderDeleteWrapItem = (key: string, account: string) => {
        const title = WalletUtility.getTitleByAccountKey(key);
        return (
            <WrapItem padding="10px" key={key}>
                <Card width="230px">
                    <CardHeader fontWeight="bold">{title}</CardHeader>
                    <CardBody>
                        <Text>{account}</Text>
                    </CardBody>
                    <CardFooter>
                        <IconButton size='sm' icon={<DeleteIcon />} colorScheme='red' isRound={true}
                            isDisabled={ViewData.keyOfPrimaryAccount === key || deletedAccounts.length > 0}
                            onClick={(e) => {
                                setDeletingKey(key);
                                onDeleteAlertOpen();
                            }} aria-label={"Delete"}></IconButton>
                    </CardFooter>
                </Card>
            </WrapItem>
        );
    }

    const renderCurrentGenesSection = () => {
        return (
            <Wrap spacing="20px">
                {eth ? renderDeleteWrapItem(AccountKeys.ETH, eth) : null}
                {ar ? renderDeleteWrapItem(AccountKeys.Arweave, ar) : null}
                {atom ? renderDeleteWrapItem(AccountKeys.Atom, atom) : null}
                {sol ? renderDeleteWrapItem(AccountKeys.Solana, sol) : null}
                {algo ? renderDeleteWrapItem(AccountKeys.Algorand, algo) : null}
                {btc ? renderDeleteWrapItem(AccountKeys.Bitcoin, btc) : null}
                {ckb ? renderDeleteWrapItem(AccountKeys.NervosCKB, ckb) : null}
                {idena ? renderDeleteWrapItem(AccountKeys.Idena, idena) : null}
                {unipassid ? renderDeleteWrapItem(AccountKeys.UniPassID, unipassid) : null}
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
                        <VStack>
                            <HStack>
                                {eth ? null : <Button leftIcon={<EthIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.ETH)}
                                    onClick={linkEth}>ETH | EVM</Button>}
                                {ar ? null :<Button leftIcon={<ArIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Arweave)}
                                    onClick={linkArweave}>Arweave</Button>}
                                {/* {atom ? null :<Button leftIcon={<AtomIcon/>} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Atom)}
                                    onClick={linkCosmos}>Cosmos</Button>} */}
                                {sol ? null : <Button leftIcon={<SolIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Solana)}
                                    onClick={linkSolana}>Solana</Button>}
                                {algo ? null : <Button leftIcon={<AlgoIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Algorand)}
                                    onClick={linkAlgorand}>Algorand</Button>}
                                {/* {ckb ? null : <Button leftIcon={<CkbIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.NervosCKB)}
                                    onClick={(e) => { linkBySignature(AccountKeys.NervosCKB, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.NervosCKB)); }}>Nervos</Button>} */}
                                {ckb ? null : <Menu>
                                        <MenuButton as={Button} size='md' aria-label="Nervos" title="Nervos" variant="outline" icon={<LinkIcon />}
                                             isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.NervosCKB)}>Nervos</MenuButton>
                                        <MenuList>
                                            <MenuItem icon={<UnipassIcon />} as="button" isDisabled={unipassid === null || unipassid.length === 0}
                                                onClick={linkNervosByUnipassID}>UniPassID</MenuItem>
                                            <MenuItem icon={<LinkIcon />} as="button"
                                                onClick={(e) => { linkBySignature(AccountKeys.NervosCKB, APIs.getUri_Link(ViewMdoelBridge.DNA.hash, AccountKeys.NervosCKB)); }}>Sign Message</MenuItem>
                                        </MenuList>
                                    </Menu>}
                                {unipassid ? null : <Button leftIcon={<UnipassIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.UniPassID)}
                                    onClick={linkUnipassID}>UnipassID</Button>}
                            </HStack>
                            {idena ? null : <Box height="40px" bgColor="gray.50">
                                <HStack marginLeft={1} marginRight={1} verticalAlign="middle">
                                    <Text fontWeight="bold">Idena: </Text>
                                    <Menu>
                                        <MenuButton as={Button} size='md' aria-label="Connect" title="Connect" variant="outline"
                                            disabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Idena)} icon={<LinkIcon />}>1. Link</MenuButton>
                                        <MenuList>
                                            <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaDesktop} target="_blank">Desktop App</MenuItem>
                                            <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaWeb} target="_blank">Web App</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <Button size='md' leftIcon={<RepeatIcon />} isDisabled={ViewMdoelBridge.isInChangedItems(addedAccounts, deletedAccounts, AccountKeys.Idena)}
                                        isLoading={checkingIdena} onClick={checkIdena}>2. Check</Button>
                                </HStack>
                            </Box>}
                            {/* {btc ? null : <InputGroup m={2}>
                                <InputLeftAddon children='Bitcoin' />
                                <Input pr='4.5rem' type="text" placeholder="address" value={editingBtc}
                                    onChange={(e) => { setEditingBtc(e.target.value); }}
                                    onKeyUp={(e) => {
                                        if(e.key === "Enter") { tryAddAccount(AccountKeys.Bitcoin, editingBtc); }
                                    }}/>
                                <InputRightElement width='4.5rem'>
                                    <Button size='sm' onClick={(e) => { tryAddAccount(AccountKeys.Bitcoin, editingBtc); }}>Add</Button>
                                </InputRightElement>
                            </InputGroup> } */}
                        </VStack>
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
            <Center m={5} width="600px" height="300px" boxShadow='xl' p='6' rounded='md'>
                <VStack>
                    <Center m={5}>
                        <Heading>
                            <HStack>
                            <Text color="green">{signedCount}</Text><Text> / {currentMutisigThreshold}</Text>
                            </HStack>
                        </Heading>
                    </Center>
                    <SignersSection signers={signers} sign={sign} />
                </VStack>
            </Center>
        );
    }
    const renderMutisigThreshold = () => {
        const newCount = signers.length + addedAccounts.length - deletedAccounts.length;
        var items = [...Array(newCount)].map((item, index) => index + 1);
        return (
            <VStack width="100%" height="500px" justify="center">
                <Heading as='h4' size='md' m={2}>MultiSig Threshold</Heading>
                <HStack>
                    <Select w={24} variant='flushed' placeholder='&nbsp; NotSet' value={newMutisigThreshold}
                        onChange={(e) => {
                            const threshold = parseInt(e.target.value);
                            setNewMutisigThreshold(threshold);
                        }}>
                        {items.map((item, index) => <option value={item}>{item}</option> )}
                    </Select>
                    <Text>out of {newCount} account(s)</Text>
                </HStack>
                <Text m={2}>Current policy is {currentMutisigThreshold} out of {signers.length}</Text>
            </VStack>
        );
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        checkCache();
        getMultisigThreshold();
    }, []);

    return (
        <VStack spacing={4}>
            <NavBar />
            <Flex flexDir="column" width="100%">
                <Steps activeStep={activeStep}>
                    <Step label="Check Unfinished Records">
                        //TODO
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
                                                {deletedAccounts.map((item: any, index: number) => (
                                                    <ListItem key={index}>
                                                        <HStack width="100%">
                                                            {drawAccountIcon(item.key)}
                                                            <Text textOverflow="ellipsis" maxWidth="400px">{item.account}</Text>
                                                            <IconButton ml={4} size="sm" aria-label={"Restore"} icon={<RepeatIcon />} colorScheme="cyan" isRound={true}
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
                        </Alert> : null}
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
                                                {addedAccounts.map((item: any, index: number) => (
                                                    <ListItem key={index}>
                                                        <HStack>
                                                            {drawAccountIcon(item.key)}
                                                            <Text textOverflow="ellipsis" maxWidth="400px">{item.account}</Text>
                                                            <IconButton ml={4} size="sm" aria-label={"Remove"} icon={<DeleteIcon />} colorScheme="red" isRound={true}
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

                    <Step label="Recombination">
                        {renderMutisigThreshold()}
                    </Step>
                    <Step label="Sign to Commit">
                        <VStack width="100%" height="500px" justify="center">
                            {/* <Box width="100%" padding={5} bgColor="green.300">
                                <Text as="h4" color="white" textAlign="center">⬇⬇⬇ Are you ready? Let's sign one-by-one! ⬇⬇⬇</Text>
                            </Box> */}
                            <Alert status='info'>
                                <AlertIcon />
                                ⬇⬇⬇ Are you ready? Let's sign one-by-one! ⬇⬇⬇
                            </Alert>
                            {renderSignersSection()}
                        </VStack>
                    </Step>
                </Steps>
            </Flex>
            <Flex justify="space-between">
                <IconButton icon={<ArrowBackIcon />} aria-label={"Previous"} m={2} isRound={true} variant='outline'
                    isDisabled={activeStep === 0} onClick={prevStep} />
                <Spacer />
                <IconButton icon={<ArrowForwardIcon />} aria-label={"Next"} m={2} isRound={true} variant='outline'
                    isDisabled={activeStep === 4} onClick={nextStep} />
            </Flex>
            <Footer />

            <AlertDialog isCentered
                isOpen={isDeleteAlertOpen} onClose={onDeleteAlertClose}
                leastDestructiveRef={cancelAlertDialogRef}>
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
                            <Button ref={cancelAlertDialogRef} onClick={onDeleteAlertClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={tryDeleteAccount} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Drawer size="lg"
                isOpen={isLinkDrawerOpen}
                placement='right'
                onClose={onLinkDrawerClose}
                finalFocusRef={btnRefLinkDrawer}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Link with signature</DrawerHeader>
                    <DrawerBody>
                        <SignatureForm defaultAddress={address} defaultMessage={message} buildMessage={WalletUtility.buildSignContent} onVerify={verifySig} />
                    </DrawerBody>
                    <DrawerFooter>
                        <IconButton icon={<CloseIcon />} aria-label={"Cancel"} m={2} isRound={true} variant='outline'
                            onClick={onLinkDrawerClose} />
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}