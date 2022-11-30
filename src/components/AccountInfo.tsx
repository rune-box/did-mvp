import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Card, CardBody, CardFooter, CardHeader, Center, Heading, Highlight, IconButton, Link, Mark, Stack, StackDivider, Text, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { EmptyCids, ViewData, ViewMdoelBridge } from "../client/ViewData";
import { CIDs } from "../models/CIDs";
import { APIs } from "../services/APIs";

type QrcodeCardProps = {
    data: string;
    title: string;
}
export const QrcodeCard = ({data, title}: QrcodeCardProps) => {
    return (
        <Card width="260px" height="444px">
            <CardHeader>
                <Heading size='md'>{title}</Heading>
            </CardHeader>
            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                        <Heading size='xs'>QRCode</Heading>
                        <Center pt='2'>
                            <QRCodeSVG size={160} value={data} />
                        </Center>
                    </Box>
                    <Box>
                        <Heading size='xs'>Account</Heading>
                        <Text pt='2' fontSize='sm'>{data}</Text>
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    );
}

type AvatarCardProps = {
    did: string;
    avatar: string;
}
export const AvatarCard = ({did, avatar}: AvatarCardProps) => {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{did}</Heading>
            </CardHeader>
            <CardBody>
                <Center>
                    <Avatar size='2xl' name={did} src={avatar} />
                </Center>
            </CardBody>
        </Card>
    );
}

type SnapshotCardProps = {
    title: string;
    cids: CIDs;
    shouldRefresh: () => boolean;
    getRefreshURI: () => string;
    updateCids: (data: CIDs) => any;
}
export const SnapshotCard = ({title, cids, shouldRefresh, getRefreshURI, updateCids}: SnapshotCardProps) => {
    const [canRefresh, setCanRefresh] = React.useState(shouldRefresh());
    const [refreshing, setRefreshing] = React.useState(false);
    const [arweave, setArweave] = React.useState(`https://arweave.net/${cids.arweave}`);
    const [ipfs, setIpfs] = React.useState(`https://${cids.ipfs}.ipfs.4everland.io/`);
    const toast = useToast();

    const refreshCids = async () => {
        try{
            setRefreshing(true);
            const uri = getRefreshURI();
            const res1 = await axios.get(uri);
            const data1 = res1.data;
            //console.log(data1);
            if(data1 && data1.success === true){
                toast({
                    title: 'Refresh CIDs...',
                    description: "Success!",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                updateCids(data1.cids);
                setArweave(old => `https://arweave.net/${data1.cids.arweave}`);
                setCanRefresh(false);
            }
            else{
                toast({
                    title: 'Refresh CIDs...',
                    description: "Failed!",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        finally{
            setRefreshing(false);
        }
    };
    return (
        <WrapItem padding="10px">
            <Card width="310px" height="300px">
                <CardHeader>
                    <Heading size='md'>{title}</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {canRefresh ? null : <Box>
                            <Heading size='xs'>Arweave</Heading>
                            <Link pt='2' fontSize='sm' target="_blank" href={arweave}>Link <ExternalLinkIcon mx='2px' /></Link>
                        </Box>}
                        {canRefresh ? null : <Box>
                            <Heading size='xs'>IPFS</Heading>
                            <Link pt='2' fontSize='sm' target="_blank" href={ipfs}>IPFS <ExternalLinkIcon mx='2px' /></Link>
                        </Box>}
                        {canRefresh ? <Box>
                            <Heading size='xs'>⚠ Action Needed! ⚠</Heading>
                            <Text pt='2' fontSize='sm'>If you see a <Text as="mark">Refresh</Text> button, click to fetch the newest Arweave hash.</Text>
                        </Box> : null}
                    </Stack>
                </CardBody>
                {canRefresh ? <CardFooter>
                    <IconButton icon={<RepeatIcon />} onClick={refreshCids}
                        isLoading={refreshing} aria-label="Refreshing" />
                </CardFooter> : null}
            </Card>
        </WrapItem>
    );
}

export const AccountInfo = () => {
    const renderCrypto = (title: string, account: string) => {
        return (
            <WrapItem padding="5px">
                <QrcodeCard data={account} title={title} />
            </WrapItem>
        );
    };
    
    return (
        <Wrap p={10} spacing="20px">
            {renderCrypto("EVM | ETH", ViewMdoelBridge.DNA.genes.crypto.eth || ViewData.eth)}
            {ViewMdoelBridge.DNA.genes.crypto.ar ? renderCrypto("Arweave", ViewMdoelBridge.DNA.genes.crypto.ar) : null}
            {ViewMdoelBridge.DNA.genes.crypto.atom ? renderCrypto("Cosmos", ViewMdoelBridge.DNA.genes.crypto.atom) : null}
            {ViewMdoelBridge.DNA.genes.crypto.dot ? renderCrypto("Cosmos", ViewMdoelBridge.DNA.genes.crypto.dot) : null}
            {ViewMdoelBridge.DNA.genes.crypto.sol ? renderCrypto("Solana", ViewMdoelBridge.DNA.genes.crypto.sol) : null}
            {ViewMdoelBridge.DNA.genes.crypto.algo ? renderCrypto("Algorand", ViewMdoelBridge.DNA.genes.crypto.algo) : null}
            {ViewMdoelBridge.DNA.genes.crypto.idena ? renderCrypto("Idena", ViewMdoelBridge.DNA.genes.crypto.idena) : null}
            {ViewMdoelBridge.DNA.genes.crypto.btc ? renderCrypto("Bitcoin", ViewMdoelBridge.DNA.genes.crypto.btc) : null}
            {ViewMdoelBridge.DNA.genes.crypto.ckb ? renderCrypto("Nervos", ViewMdoelBridge.DNA.genes.crypto.ckb) : null}
        </Wrap>
    );
}
export const DIDAvatarsCards = () => {
    const renderDotbit = () => {
        const did = ViewMdoelBridge.DNA.genes.dotbit;
        if(did && did.length > 4){
            const img = ViewMdoelBridge.DotbitContext.avatar;
            return (
                <WrapItem padding="5px">
                    <AvatarCard did={did} avatar={img} />
                </WrapItem>
            );
        }
    }
    const renderENS = () => {
        const did = ViewMdoelBridge.DNA.genes.ens;
        if(did && did.length > 4){
            const img = `https://robohash.org/${did}.png?set=set1`;
            return (
                <WrapItem padding="5px">
                    <AvatarCard did={did} avatar={img} />
                </WrapItem>
            );
        }
    }

    return (
        <Wrap p={10} spacing="20px">
            {renderDotbit()}
            {renderENS()}
        </Wrap>
    );
}

export const SnapshotsCards = () => {
    // return (
    //     <Accordion>
    //         <AccordionItem>
    //             <h2>
    //                 <AccordionButton>
    //                     <Box flex='1' textAlign='left'>Snapshots</Box>
    //                     <AccordionIcon />
    //                 </AccordionButton>
    //             </h2>
    //             <AccordionPanel>
    //                 <Wrap p={2} spacing="20px">
    //                     <SnapshotCard title="DNA" cids={ViewMdoelBridge.Cids}
    //                         shouldRefresh={() => !ViewMdoelBridge.Cids.arweave || ViewMdoelBridge.Cids.arweave.length < 10 }
    //                         getRefreshURI={() => APIs.RefreshCIDsOfDNA + "?eth=" + ViewData.eth}
    //                         updateCids={(newCids: CIDs) => { ViewMdoelBridge.Cids = newCids; }}/>
    //                     {ViewMdoelBridge.LastDataSnapshot.createdAt > 999 ? <SnapshotCard title="Cyber Mark (Data)"
    //                         cids={ViewMdoelBridge.LastDataSnapshot.cids}
    //                         shouldRefresh={() => !ViewMdoelBridge.LastDataSnapshot.cids.arweave || ViewMdoelBridge.LastDataSnapshot.cids.arweave.length < 10 }
    //                         getRefreshURI={() => APIs.RefreshCIDsOfCyberMark + "?dna=" + ViewMdoelBridge.DNA.hash}
    //                         updateCids={(newCids: CIDs) => { ViewMdoelBridge.LastDataSnapshot.cids = newCids; }}/> : null}
    //                     {/* <WrapItem padding="10px">
    //                         <Card width="200px" height="300px">
    //                             <CardHeader>
    //                                 <Heading size='md'>Epoch</Heading>
    //                             </CardHeader>
    //                             <CardBody>
    //                                 <Heading size="4xl">Apps</Heading>
    //                             </CardBody>
    //                         </Card>
    //                     </WrapItem> */}
    //                 </Wrap>
    //             </AccordionPanel>
    //         </AccordionItem>
    //     </Accordion>
    // );
    return (
        <Wrap p={2} spacing="20px">
            <SnapshotCard title="DNA" cids={ViewMdoelBridge.Cids}
                shouldRefresh={() => !ViewMdoelBridge.Cids.arweave || ViewMdoelBridge.Cids.arweave.length < 10 }
                getRefreshURI={() => APIs.RefreshCIDsOfDNA + "?eth=" + ViewData.eth}
                updateCids={(newCids: CIDs) => { ViewMdoelBridge.Cids = newCids; }}/>
            {ViewMdoelBridge.LastDataSnapshot.createdAt > 999 ? <SnapshotCard title="Cyber Mark (Data)"
                cids={ViewMdoelBridge.LastDataSnapshot.cids}
                shouldRefresh={() => !ViewMdoelBridge.LastDataSnapshot.cids.arweave || ViewMdoelBridge.LastDataSnapshot.cids.arweave.length < 10 }
                getRefreshURI={() => APIs.RefreshCIDsOfCyberMark + "?dna=" + ViewMdoelBridge.DNA.hash}
                updateCids={(newCids: CIDs) => { ViewMdoelBridge.LastDataSnapshot.cids = newCids; }}/> : null}
        </Wrap>
    );
}