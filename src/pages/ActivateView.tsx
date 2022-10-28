import { CheckCircleIcon, CheckIcon, DownloadIcon, LinkIcon, LockIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, Button, CircularProgress, Code, Divider, Heading, HStack, IconButton, List, ListIcon, ListItem, Menu, MenuButton, MenuItem, MenuList, Text, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ActivationsRules_DAOSquare, ActivationsRules_Debank, ActivationsRules_Goodghosting } from "../client/ActivationsRules";
import { DIDUtility } from "../client/DIDBase";
import { RoutesData } from "../client/RoutesData";
import { RunesData } from "../client/RunesData";
import { EmptyDNA, ViewData, ViewMdoelBridge } from "../client/ViewData";
import { buildCheckIdenaContent } from "../client/Wallet";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { APIs, AuthAPIs } from "../services/APIs";
import { ComputeScoreDirectly } from "../utils/ScoreUtility";
import { delay } from "../utils/threads";
import { Utility } from "../utils/Utility";

export const ActivateView = () => {
    const [isChecking, setIsChecking] = React.useState(false);
    const [isEligible, setIsEligible] = React.useState(false);
    const [isActivating, setIsActivating] = React.useState(false);

    const [holdDotbit, setHoldDotbit] = React.useState(ViewData.did.dotbit.length > 4);
    const [holdENS, setHoldENS] = React.useState(ViewData.did.ens.length > 4);
    const [holdDid, setHoldDid] = React.useState(holdDotbit || holdENS);
    const [holdDids, setHoldDids] = React.useState(holdDotbit && holdENS);
    const [holdSameDids, setHoldSameDids] = React.useState( DIDUtility.isSame(ViewData.did.dotbit, ViewData.did.ens) );
    const [holdBAB, setHoldBAB] = React.useState(false);
    const [checkingDAOSquare, setCheckingDAOSquare] = React.useState(false);
    const [daoSquareIsOK, setDaoSquareIsOK] = React.useState(false);
    const [checkingDebank, setCheckingDebank] = React.useState(false);
    const [debankIsOK, setDebankIsOK] = React.useState(false);
    const [checkingGoodghosting, setCheckingGoodghosting] = React.useState(false);
    const [goodghostingIsOK, setGoodghostingIsOK] = React.useState(false);
    const [checkingIdena, setCheckingIdena] = React.useState(false);
    const [idenaIsHuman, setIdenaIsHuman] = React.useState(false);
    const [assets1000, setAssets1000] = React.useState(false);
    const [assets10000, setAssets10000] = React.useState(false);

    const uriIdenaDesktop = AuthAPIs.getUri_Idena_Desktop(Utility.generatePlainUUID(), ViewData.eth);
    const uriIdenaWeb = AuthAPIs.getUri_Idena_Web(Utility.generatePlainUUID(), ViewData.eth);
    const toast = useToast();
    const navigate = useNavigate();

    const renderCheckIcon = (v: boolean = false) => {
        if(v) return (
            <ListIcon as={CheckCircleIcon} color='green' />
        );
        return (
            <ListIcon as={LockIcon} color='gray' />
        );
    };
    const checkDAOSquare = async () => {
        try{
            setCheckingDAOSquare(true);
            const result = await ComputeScoreDirectly(ActivationsRules_DAOSquare.rules, ViewData.eth);
            const ok = (result.score > 0);
            setDaoSquareIsOK(ok);
            //if(ok && holdDid) setIsEligible(true);
            return ok;
        }
        finally{
            setCheckingDAOSquare(false);
        }
    };
    const checkDebank = async () => {
        try{
            setCheckingDebank(true);
            const result = await ComputeScoreDirectly(ActivationsRules_Debank.rules, ViewData.eth);
            const ok = (result.score >=1);
            setDebankIsOK(ok);
            // const bab = result.data.get(RunesData.ID_HoldBAB) as boolean;
            // setHoldBAB(bab);
            // if(ok && bab && holdDid) setIsEligible(true);
            return ok;
        }
        finally{
            setCheckingDebank(false);
        }
    };
    const checkGoodghosting = async () => {
        try{
            setCheckingGoodghosting(true);
            const result = await ComputeScoreDirectly(ActivationsRules_Goodghosting.rules, ViewData.eth);
            const ok = (result.score >=2);
            setGoodghostingIsOK(ok);
            // const bab = result.data.get(RunesData.ID_HoldBAB) as boolean;
            // setHoldBAB(bab);
            // if(ok && bab && holdDid) setIsEligible(true);
            return ok;
        }
        finally{
            setCheckingGoodghosting(false);
        }
    };
    
    const checkIdena = async () => {
        if(!holdDid) {
            toast({
                title: 'NO DID!',
                description: "You should register a DID (.bit/.eth) first...",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setCheckingIdena(true);

        const message = buildCheckIdenaContent();
        const ethereum = (window as any).ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(ViewData.eth);
        const signature = await signer.signMessage(message);
        try{
            const res1 = await axios.post(APIs.CheckIdena, {
                message: message,
                signature: signature
            });
            const data1 = res1.data;
            //console.log(data1);
            if(data1 && data1.success === true){
                toast({
                    title: 'Idena Auth',
                    description: "Authenticated!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                ViewMdoelBridge.DNA.genes.crypto.idena = data1.account;
                console.log("Idena account: " + ViewMdoelBridge.DNA.genes.crypto.idena);
                setIdenaIsHuman(data1.human);
                if(holdDid && data1.human) setIsEligible(true);
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
    };
    const activate = async () => {
        if(!isEligible){
            toast({
                title: 'Error',
                description: "You are not eligible!",
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            return;
        }
        setIsActivating(true);

        ViewMdoelBridge.DNA.genes.dotbit = ViewData.did.dotbit;
        ViewMdoelBridge.DNA.genes.ens = ViewData.did.ens;
        ViewMdoelBridge.DNA.genes.crypto.eth = ViewData.eth;
        const message = JSON.stringify(ViewMdoelBridge.DNA);

        const ethereum = (window as any).ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(ViewData.eth);
        const signature = await signer.signMessage(message);
        try{
            // step 1
            const res1 = await axios.post(APIs.ActivateEvm, {
                message: message,
                signature: signature
            });
            const data1 = res1.data;
            //console.log(data1);
            if(data1 && data1.success === true){
                toast({
                    title: 'Activation - Step 1',
                    description: "Done!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                await delay(1234);
                toast({
                    title: 'Preparing for Step 2',
                    description: "❤ Be patient! ❤",
                    status: 'info',
                    duration: 2000,
                    isClosable: true,
                });
                await delay(2048);
                toast({
                    title: 'Still Preparing for Step 2',
                    description: "❤ Be patient! ❤",
                    status: 'info',
                    duration: 2000,
                    isClosable: true,
                });
                await delay(2048);
                // step 2
                const res2 = await axios.get(APIs.Save + "?account=" + ViewData.eth);
                let data2 = res2.data;
                console.log(data2);
                if(data2 && data2.success === true){
                    toast({
                        title: 'Activation - Step 2',
                        description: "Done!",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    ViewMdoelBridge.DNA = data2.dna;
                    ViewMdoelBridge.Cids= data2.cids;
                    console.log(ViewMdoelBridge.DNA);
                    ViewData.activated = true;
                    ViewData.afterActivated();
                    navigate(RoutesData.Profile);
                }
                else{
                    toast({
                        title: 'Error!',
                        description: data2.error,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
            else{
                toast({
                    title: 'Error!',
                    description: data1.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        catch{
        }
        finally{
            setIsActivating(false);
        }
    }

    const checkEligibility = async () => {
        if(!holdDid) {
            toast({
                title: 'NO DID!',
                description: "You should register a DID (.bit/.eth) first...",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        if(holdSameDids && holdBAB){
            setIsEligible(true);
            return;
        }

        await checkDAOSquare();
        if(daoSquareIsOK){
            setIsEligible(true);
            return;
        }

        // need bab
        if(!holdBAB) {
            toast({
                title: 'NO BAB!',
                description: "You should register a BAB first...",
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        await checkDebank();
        if(debankIsOK) {
            setIsEligible(true);
            return;
        }
        
        await checkGoodghosting();
        if(goodghostingIsOK) {
            setIsEligible(true);
            return;
        }
    }
    
    // useEffect(() => {
    //     // React advises to declare the async function directly inside useEffect
    //     // async function loadMyRunesData() {
    //     //     //const tmp = await getData(address, api, "POST", Math.random() * 999);
    //     //     const mcr = TestingData_CustomRules; // test
    //     //     setMyCustomRules(mcr);
    //     // };
    //     // You need to restrict it at some point
    //     // This is just dummy code and should be replaced by actual
    //     if(ViewData.eth && ViewData.eth.length > 0){
    //         if(!holdDAOSquareRole) checkDAOSquare();
    //     }
    //   }, []);

    return (
        <VStack spacing={4}>
            <NavBar/>
            <Heading size="lg" color="gray">Try to meet any one of the following requirements.</Heading>
            <Wrap spacing="30px">
                <WrapItem padding="30px">
                    <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + Idena</Heading>
                        <Divider />
                        <List padding={3} h='200px'>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(idenaIsHuman)}
                                Hold a Idena account: <Code>Human</Code>
                            </ListItem>
                        </List>
                        <Divider />
                        <HStack as='h4' m={1} spacing={3}>
                            <Menu>
                                <MenuButton as={IconButton} size='xs' aria-label="Connect" title="Connect" variant="outline" icon={<LinkIcon/>} />
                                <MenuList>
                                    <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaDesktop} target="_blank">Desktop App</MenuItem>
                                    <MenuItem icon={<LinkIcon />} as="a" href={uriIdenaWeb} target="_blank">Web App</MenuItem>
                                </MenuList>
                            </Menu>
                            <Button size='xs' leftIcon={<RepeatIcon/>} onClick={checkIdena}
                                isLoading={checkingIdena}>Check Result</Button>
                        </HStack>
                    </Box>
                </WrapItem>
                <WrapItem padding="30px">
                    <Box w='300px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + DAOSquare</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(daoSquareIsOK)}
                                Hold a DAO Role: <Code>Passport</Code>/<Code>Cafeteria</Code>/<Code>Matrix</Code>
                            </ListItem>
                        </List>
                        <CircularProgress isIndeterminate visibility={checkingDAOSquare ? "visible" : "hidden"} />
                    </Box>
                </WrapItem>
                <WrapItem padding="30px">
                    <Box w='300px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>Same DIDs + BAB</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold DIDs (.eth AND .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(holdSameDids)}
                                .eth == .bit
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(holdBAB)}
                                Hold a BAB token
                            </ListItem>
                        </List>
                        <CircularProgress isIndeterminate visibility={checkingDebank ? "visible" : "hidden"} />
                    </Box>
                </WrapItem>
                <WrapItem padding="30px">
                    <Box w='300px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + BAB + Debank</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(holdBAB)}
                                Hold a BAB token
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(debankIsOK)}
                                Debank score is greater than <Code>4.2</Code>
                            </ListItem>
                        </List>
                        <CircularProgress isIndeterminate visibility={checkingDebank ? "visible" : "hidden"} />
                    </Box>
                </WrapItem>
                <WrapItem padding="30px">
                    <Box w='300px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + BAB + Goodghosting</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(holdBAB)}
                                Hold a BAB token
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(goodghostingIsOK)}
                                Goodghosting score is greater than <Code>15000</Code>
                            </ListItem>
                        </List>
                        <CircularProgress isIndeterminate visibility={checkingGoodghosting ? "visible" : "hidden"} />
                    </Box>
                </WrapItem>
                {/* <WrapItem padding="30px">
                    <Box w='300px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + BAB + $1000</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(holdBAB)}
                                Hold a BAB token
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(assets1000)}
                                Multi-chain assets: 1000+ USD
                            </ListItem>
                        </List>
                    </Box>
                </WrapItem> */}
                {/* <WrapItem padding="30px">
                    <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DID + $10000</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDid)}
                                Hold a DID (.eth or .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(assets10000)}
                                Multi-chain assets: 10000+ USD
                            </ListItem>
                        </List>
                    </Box>
                </WrapItem>
                <WrapItem padding="30px">
                    <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                        <Heading as='h3' size='lg' color='gray.500' m={2}>DIDs + $1000</Heading>
                        <Divider />
                        <List padding={3}>
                            <ListItem>
                                {renderCheckIcon(holdDids)}
                                Hold DIDs (.eth AND .bit)
                            </ListItem>
                            <ListItem>
                                {renderCheckIcon(assets1000)}
                                Multi-chain assets: 1000+ USD
                            </ListItem>
                        </List>
                    </Box>
                </WrapItem> */}
            </Wrap>
            <Text></Text>
            <HStack>
                <Button leftIcon={<RepeatIcon/>} 
                    isLoading={isChecking} isDisabled={!ViewData.eth}
                    onClick={checkEligibility}>Check Eligibility</Button>
                <Button leftIcon={<CheckIcon/>}
                    isLoading={isActivating} isDisabled={!isEligible}
                    onClick={activate}>Activate</Button>
            </HStack>
            <Footer/>
        </VStack>
    );
}