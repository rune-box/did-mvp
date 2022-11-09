import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { Avatar, Box, Center, Highlight, IconButton, Link, Mark, Text, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";
import { APIs } from "../services/APIs";

type QrcodeCardProps = {
    data: string;
    title: string;
}
export const QrcodeCard = ({data, title}: QrcodeCardProps) => {
    return (
        <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
            <Center>
                <Text fontWeight="bold" m={2}>{title}</Text>
            </Center>
            <Center>
                <QRCodeSVG size={160} value={data} />
            </Center>
            <Text m={2}>{data}</Text>
        </Box>
    );
}

type AvatarCardProps = {
    did: string;
    avatar: string;
}
export const AvatarCard = ({did, avatar}: AvatarCardProps) => {
    return (
        <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
            <Center mt={6}>
                <Avatar size='2xl' name={did} src={avatar} />
            </Center>
            <Center>
                <Text fontWeight="bold" m={2}>{did}</Text>
            </Center>
        </Box>
    );
}

export const SnapshotCard = () => {
    const [canRefresh, setCanRefresh] = React.useState(!ViewMdoelBridge.Cids.arweave || ViewMdoelBridge.Cids.arweave.length < 10);
    const [refreshing, setRefreshing] = React.useState(false);
    const toast = useToast();
    
    const arweave = `https://arweave.net/${ViewMdoelBridge.Cids.arweave}`;
    const ipfs = `https://${ViewMdoelBridge.Cids.ipfs}.ipfs.4everland.io/`;
    const refreshCids = async () => {
        try{
            setRefreshing(true);
            const res1 = await axios.get(APIs.RefreshCIDs + "?eth=" + ViewData.eth);
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
                ViewMdoelBridge.Cids = data1.cids;
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
            <Box w='280px' h='300px' borderWidth='1px' borderRadius='lg' shadow="lg">
                <Center>
                    <Text fontWeight="bold" m={2}>CIDs</Text>
                </Center>
                <Center mt={2}>
                    <Link target="_blank" href={arweave}>Arweave <ExternalLinkIcon mx='2px' /></Link>
                </Center>
                <Center mt={2}>
                    <Link target="_blank" href={ipfs}>IPFS <ExternalLinkIcon mx='2px' /></Link>
                </Center>
                <Center mt={2} visibility={canRefresh ? "visible" : "hidden"}>
                    <IconButton icon={<RepeatIcon />} onClick={refreshCids}
                        isLoading={refreshing} aria-label="Refreshing" />
                </Center>
                <Center visibility={canRefresh ? "visible" : "hidden"}>
                    <Text color="gray" m={2}>If you see a <Text as="mark">Refresh</Text> button, click to fetch the newest Arweave hash.</Text>
                </Center>
            </Box>
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
        <Wrap spacing="20px">
            {renderDotbit()}
            {renderENS()}
            {renderCrypto("EVM | ETH", ViewMdoelBridge.DNA.genes.crypto.eth || ViewData.eth)}
            {ViewMdoelBridge.DNA.genes.crypto.ar ? renderCrypto("Arweave", ViewMdoelBridge.DNA.genes.crypto.ar) : null}
            {ViewMdoelBridge.DNA.genes.crypto.atom ? renderCrypto("Cosmos", ViewMdoelBridge.DNA.genes.crypto.atom) : null}
            {ViewMdoelBridge.DNA.genes.crypto.dot ? renderCrypto("Cosmos", ViewMdoelBridge.DNA.genes.crypto.dot) : null}
            {ViewMdoelBridge.DNA.genes.crypto.sol ? renderCrypto("Solana", ViewMdoelBridge.DNA.genes.crypto.sol) : null}
            {ViewMdoelBridge.DNA.genes.crypto.idena ? renderCrypto("Idena", ViewMdoelBridge.DNA.genes.crypto.idena) : null}
            <SnapshotCard />
        </Wrap>
    );
}