import { RepeatIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Divider, Heading, LinkBox, LinkOverlay, Stack, StackDivider, Text, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { AccountKeys } from "../client/Constants";
import { DIDKeys } from "../client/DIDBase";
import { RoutesData } from "../client/RoutesData";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";
import { WalletUtility } from "../client/Wallet";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SignersSection } from "../components/SignersSection";
import { FingerprintIcon } from "../icons/Icons";
import { Account4 } from "../models/Account";
import { DataCard } from "../models/DataCard";
import { DataRune, DataRuneTask, ImprintItem } from "../models/DataRune";
import { APIs } from "../services/APIs";
import { DataRuneUtility } from "../utils/DataRuneUtility";
import { delay } from "../utils/threads";
import { Utility } from "../utils/Utility";

export const CyberMarkView = () => {
    const [signers, setSigners] = React.useState(ViewMdoelBridge.getSigners(true));
    const [startTime, setStartTime] = React.useState(0);
    const [evmTasks, setEvmTasks] = React.useState(new Array<DataRuneTask>());
    const [evmFinishedCount, setEvmFinishedCount] = React.useState(0);
    const [idenaTasks, setIdenaTasks] = React.useState(new Array<DataRuneTask>());
    const [idenaFinishedCount, setIdenaFinishedCount] = React.useState(0);
    const [cacheHash, setCacheHash] = React.useState("");
    const [dataImprints, setDataImprints] = React.useState(new Array<ImprintItem>());
    //const [loadingRunes, setLoadingRunes] = React.useState(false);
    const [allowedTime, setAllowedTime] = React.useState(-1);
    const toast = useToast();
    const navigate = useNavigate();
    let loadingRunes = false;
    // let _evmTasks: DataRuneTask[] = [];
    // let _idenaTasks: DataRuneTask[] = [];

    const doFetchWork = async(task: DataRuneTask, address: string): Promise<DataCard[]> => {
        if(!task)
            return new Array<DataCard>();
        let api = task.rune.apis[0].uri.replace("/get?rune", "/snapshot?rune");
        api = api.replace("https://api.runebox.xyz/v0/", "https://localhost:7153/v0/"); // TEST
        const fetchURL = api + address;
        console.log(fetchURL);
        const result = await fetch(fetchURL, {method: "GET"})
            .then(data => data.json());
        const cards = result as Array<DataCard>;
        return cards;
    }
    const taskFailed = (tasks: DataRuneTask[], task:DataRuneTask) => {
        task.isLoading = false;
        task.failed = true;
        const tempTasks = tasks.filter(i => i.rune.id !== task.rune.id);
        tasks = [...tempTasks, task];
        return tasks;
    }
    
    const processTask = async (tasks: DataRuneTask[], task:DataRuneTask, address: string, count: number) => {
        try{
            const cards = await doFetchWork(task, address);
            if(cards && cards.length > 0){
                const ids = cards.map( i => i.id);
                const otherTasks = tasks.filter( i=> ids.indexOf(i.rune.id) < 0);
                const processedTasks: DataRuneTask[] = [];
                cards.forEach(card => {
                    const theTask = tasks.filter(i => i.rune.id === card.id)[0];
                    if(theTask){
                        theTask.data = card.data;
                        theTask.finished = true;
                        theTask.updatedAt = Utility.getTimestamp();
                        theTask.isLoading = false;
    
                        processedTasks.push(theTask);
                    }
                });
                tasks = otherTasks.concat(processedTasks);
                count += processedTasks.length;
            }
            else{
                tasks = taskFailed(tasks, task);
            }
        }
        catch{
            tasks = taskFailed(tasks, task);
        }
        return {tasks, count};
    }
    const refreshEvmTask = async (task: DataRuneTask) => {
        task.isLoading = true;

        let count = 0;
        let _evmTasks: DataRuneTask[] = [];
        setEvmTasks(arg => {
            const tempTasks = arg.filter(i => i.rune.id !== task.rune.id);
            _evmTasks = [task, ...tempTasks];
            return _evmTasks;
        });

        count = _evmTasks.filter(i => i.finished).length;
        const tastResult = await processTask(_evmTasks, task, ViewData.eth, count);
        setEvmTasks(arg => tastResult.tasks);
        setEvmFinishedCount(arg => tastResult.count);
    }
    const processEvmTasks = async (tasks: DataRuneTask[]) => {
        let count = 0;
        while(true){
            const todoTasks = tasks.filter(i => !i.finished && !i.failed );
            if(!todoTasks || todoTasks.length === 0)
                break;
            const task = todoTasks[0];
            const tastResult = await processTask(tasks, task, ViewData.eth, count);
            setEvmTasks(arg => tastResult.tasks);

            count = tastResult.count;
            setEvmFinishedCount(arg => count);

            await delay(500);
        }
        return tasks;
    }
    const refreshIdenaTask = async (task: DataRuneTask) => {
        task.isLoading = true;

        let count = 0;
        let _idenaTasks: DataRuneTask[] = [];
        setIdenaTasks(arg => {
            const tempTasks = arg.filter(i => i.rune.id !== task.rune.id);
            _idenaTasks = [task, ...tempTasks];
            return _idenaTasks;
        });

        count = _idenaTasks.filter(i => i.finished).length;
        const tastResult = await processTask(_idenaTasks, task, ViewData.idena, count);
        setIdenaTasks(arg => tastResult.tasks);
        setIdenaFinishedCount(arg => tastResult.count);
    }
    const processIdenaTasks = async (tasks: DataRuneTask[]) => {
        let count = 0;
        while(true){
            const todoTasks = tasks.filter(i => i.finished === false);
            if(!todoTasks || todoTasks.length === 0)
                break;
            const task = todoTasks[0];
            const tastResult = await processTask(tasks, task, ViewData.idena, count);
            setIdenaTasks(arg => tastResult.tasks);

            count = tastResult.count;
            setIdenaFinishedCount(arg => count);

            await delay(500);
        }
        return tasks;
    }

    const startTasks = async (_evmTasks: DataRuneTask[], _idenaTasks: DataRuneTask[]) => {
        let imprints: Array<ImprintItem> = [];

        _evmTasks = await processEvmTasks(_evmTasks);
        // const evmImprints = DataRuneUtility.getData0(_evmTasks);
        // if(evmImprints){
        //     // imprints.push({
        //     //     address: ViewData.eth,
        //     //     imprints: evmImprints
        //     // });
        //     imprints = imprints.concat(evmImprints);
        // }

        if(ViewData.idena && ViewData.idena.length > 10){
            _idenaTasks = await processIdenaTasks(_idenaTasks);
            // const idenaImprints = DataRuneUtility.getData0(_idenaTasks);
            // if(idenaImprints && idenaImprints.length > 0){
            //     // imprints.push({
            //     //     address: ViewData.idena,
            //     //     imprints: idenaImprints
            //     // });
            //     imprints = imprints.concat(idenaImprints);
            // }
        }

        // console.log("Imprints:");
        // console.log(imprints);
    }

    const loadRunes = async () => {
        let _evmTasks = new Array<DataRuneTask>();
        let _idenaTasks = new Array<DataRuneTask>();
        if(loadingRunes)
            return {_evmTasks, _idenaTasks};
        //setLoadingRunes(true);
        loadingRunes = true;

        let page = 1;
        while(true){
            const uri = APIs.getUri_SearchDataRunes("", page);
            const res = await axios.get(uri);
            const data = res.data;
            if (data && data.success === true) {
                const runes = data.data as Array<DataRune>;
                if(!runes || runes.length ===0) break;
                // evm
                const evmRunes = runes.filter(i => i.accountType === DIDKeys.ETH_SLIP0044);
                if(evmRunes && evmRunes.length > 0){
                    const tasks = DataRuneUtility.convertToTasks(evmRunes);
                    _evmTasks = _evmTasks.concat(tasks);
                    setEvmTasks(arg => _evmTasks);
                }
                // idena
                const idenaRunes = runes.filter(i => i.accountType === DIDKeys.Idena_SLIP0044);
                if(idenaRunes && idenaRunes.length > 0 && ViewData.idena){
                    const tasks = DataRuneUtility.convertToTasks(idenaRunes);
                    _idenaTasks = _idenaTasks.concat(tasks);
                    setIdenaTasks(arg => _idenaTasks);
                }
                // exit?
                if(runes.length < ViewData.countOfPerPage) break;
                await delay(1000);
                page++;
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
        } // while
        return {_evmTasks, _idenaTasks};
    }

    const prepare = async () => {
        const uri = APIs.getUri_GetLastSnapshotTime(ViewMdoelBridge.DNA.hash);
        const res = await axios.get(uri);
        const data = res.data;
        if(data.success){
            const lastTime = data.lastSnapshotTime as number;//Utility.getTimestamp();//
            const shouldTime = lastTime + Utility.secondsOf24Hours;
            const now = Utility.getTimestamp();
            if(shouldTime > now){
                setAllowedTime(shouldTime);
                return;
            }
            setStartTime(st => now);
            const runes = await loadRunes();
            await startTasks(runes._evmTasks, runes._idenaTasks);
        }
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
        signers[index].working = false;
        ViewMdoelBridge.LastDataSnapshot = data.snapshot;

        toast({
            title: 'Done!',
            description: "Data snapshot created successfully!",
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        navigate(RoutesData.Nav);
    }
    const sign = async (item: Account4) => {
        // TODO: check
        if (item.done || item.working) return;
        // check 1
        if (evmFinishedCount < evmTasks.length || idenaFinishedCount < idenaTasks.length) {
            toast({
                title: 'Please wait...',
                description: "There is some data not fetched.",
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // server cache is ready?
        let apiCacheReady = APIs.getUri_SnapshotDataReady(ViewMdoelBridge.DNA.hash, AccountKeys.ETH, ViewData.eth, startTime);
        const result = await fetch(apiCacheReady, {method: "GET"})
            .then(data => data.json());
        if(!result.success){
            toast({
                title: 'Unknown Error',
                description: "Maybe the server cache is not ready?",
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setCacheHash(result.hash);

        const imprints = DataRuneUtility.getData(evmTasks, idenaTasks);
        // check 2
        // const hash = DataRuneUtility.keccak256(imprints);
        // console.log("Client data hash: " + hash);
        // console.log("Server data hash: " + cacheHash);
        // if(hash !== cacheHash){
        //     toast({
        //         title: 'Not same data!',
        //         description: "The data digest between client and server cahce are different!",
        //         status: 'info',
        //         duration: 3000,
        //         isClosable: true,
        //     });
        //     return;
        // }

        //setCurrentSigner(item);
        const message = WalletUtility.buildSignContent_DataSnapshot(ViewMdoelBridge.DNA.hash, item, imprints);
        //setWorking(item, true, false);
        item.working = true;
        switch (item.key) {
            case AccountKeys.ETH:
                await WalletUtility.connectEth(message, WalletUtility.buildSignContent, APIs.getUri_Snapshot(ViewMdoelBridge.DNA.hash, AccountKeys.ETH),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        item.working = false;
                    },
                    () => {
                        item.working = false;
                    },
                    toast);
                break;
            case AccountKeys.Arweave:
                await WalletUtility.connectArweave(message, WalletUtility.buildSignContent, APIs.getUri_Snapshot(ViewMdoelBridge.DNA.hash, AccountKeys.Arweave),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        item.working = false;
                    },
                    () => {
                        item.working = false;
                    },
                    toast);
                break;
            case AccountKeys.Atom:
                await WalletUtility.connectCosmos(message, WalletUtility.buildSignContent, APIs.getUri_Snapshot(ViewMdoelBridge.DNA.hash, AccountKeys.Atom),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        item.working = false;
                    },
                    () => {
                        item.working = false;
                    },
                    toast);
                break;
            case AccountKeys.Solana:
                await WalletUtility.connectSolana(message, WalletUtility.buildSignContent, APIs.getUri_Snapshot(ViewMdoelBridge.DNA.hash, AccountKeys.Solana),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        item.working = false;
                    },
                    () => {
                        item.working = false;
                    },
                    toast);
                break;
            case AccountKeys.Algorand:
                await WalletUtility.connectAlgo(message, WalletUtility.buildSignContent, APIs.getUri_Snapshot(ViewMdoelBridge.DNA.hash, AccountKeys.Algorand),
                    async (data: any) => {
                        await processSignResult(data);
                    },
                    () => {
                        item.working = false;
                    },
                    () => {
                        item.working = false;
                    },
                    toast);
                break;
            // case AccountKeys.Idena:
            //     break;
            // case AccountKeys.Bitcoin:
            //     callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.Bitcoin), item);
            //     break;
            // case AccountKeys.NervosCKB:
            //     callMultiSigSignature(APIs.getUri_SignMutation(ViewMdoelBridge.DNA.hash, AccountKeys.NervosCKB), item);
            //     break;
        }
    }

    const renderWaitingComponent = () => {
        return (
            <VStack spacing={4}>
                <NavBar />
                <Center height="400px">
                    <VStack spacing={10}>
                        <Heading>You can create a new cyber mark after:</Heading>
                        <Heading as="h1" size='4xl' color="pink.500">
                            <Countdown date={allowedTime * 1000}/>
                        </Heading>
                        <Heading color="gray">You can snapshot ONE time every 24 hours.</Heading>
                    </VStack>
                </Center>
                <Footer />
            </VStack>
        );
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // async function loadData() {
        // };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        prepare();
    }, []);

    return ( allowedTime > 0 ? renderWaitingComponent() :
        <VStack spacing={4}>
            <NavBar />
            <Heading>EVM ({evmFinishedCount} / {evmTasks.length})</Heading>
            <Wrap spacing='30px' justify='center'>
                {evmTasks.map((item: DataRuneTask, index: number) => (
                    <WrapItem key={index}>
                        <Card>
                            <CardHeader>
                                <Heading size='md'>{item.rune.title}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>description</Heading>
                                        <Text pt='2' fontSize='sm'>{item.rune.description}</Text>
                                    </Box>
                                    <Divider m={3}/>
                                    {item.finished ? <Box>
                                        <Heading size='xs' textTransform='uppercase'>data</Heading>
                                        <Text pt='2' fontSize='sm'>{typeof item.data === "boolean" ? (item.data ? "YES" : "NO") : item.data}</Text>
                                    </Box> : null}
                                </Stack>
                            </CardBody>
                            <CardFooter>
                                <Button isLoading={item.isLoading} isDisabled={item.finished} leftIcon={<RepeatIcon/>}
                                    onClick={(e) => { refreshEvmTask(item) }}>Refresh</Button>
                            </CardFooter>
                        </Card>
                    </WrapItem>
                ))}
            </Wrap>
            {ViewData.idena ? <Heading>Idena</Heading> : null}
            {ViewData.idena ? <Wrap>
                {idenaTasks.map((item: DataRuneTask, index: number) => (
                    <WrapItem key={index}>
                        <Card>
                            <CardHeader>
                                <Heading size='md'>{item.rune.title}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    <Box>
                                        <Heading size='xs' textTransform='uppercase'>description</Heading>
                                        <Text pt='2' fontSize='sm'>{item.rune.description}</Text>
                                    </Box>
                                    <Divider m={3}/>
                                    {item.finished ? <Box>
                                        <Heading size='xs' textTransform='uppercase'>data</Heading>
                                        <Text pt='2' fontSize='sm'>{typeof item.data === "boolean" ? (item.data ? "YES" : "NO") : item.data}</Text>
                                    </Box> : null}
                                </Stack>
                            </CardBody>
                            <CardFooter>
                                <Button isLoading={item.isLoading} isDisabled={item.finished} leftIcon={<RepeatIcon/>}
                                    onClick={(e) => { refreshIdenaTask(item) }}>Refresh</Button>
                            </CardFooter>
                        </Card>
                    </WrapItem>
                ))}
            </Wrap> : null}
            <Divider m={3} />
            <Center>
                <VStack spacing={5}>
                    <Center>
                        <Heading>Create Cyber Mark (Data Snapshot)</Heading>
                    </Center>
                    {evmFinishedCount === evmTasks.length && idenaFinishedCount === idenaTasks.length ?
                        <SignersSection signers={signers} sign={sign} /> : null}
                </VStack>
            </Center>
            <Footer />
        </VStack>
    );
}