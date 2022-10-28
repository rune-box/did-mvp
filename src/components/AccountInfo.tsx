import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { Avatar, Box, Center, IconButton, Link, Text, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
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
                <Text fontWeight="bold" m={5}>{title}</Text>
            </Center>
            <Center>
                <QRCodeSVG size={160} value={data} />
            </Center>
            <Text m={5}>{data}</Text>
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
            <Center mt={5}>
                <Avatar size='2xl' name={did} src={avatar} />
            </Center>
            <Center>
                <Text fontWeight="bold" m={5}>{did}</Text>
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
                    <Text fontWeight="bold" m={5}>CIDs</Text>
                </Center>
                <Center mt={5}>
                    <Link target="_blank" href={arweave}>Arweave <ExternalLinkIcon mx='2px' /></Link>
                </Center>
                <Center mt={5}>
                    <Link target="_blank" href={ipfs}>IPFS <ExternalLinkIcon mx='2px' /></Link>
                </Center>
                <Center mt={5} visibility={canRefresh ? "visible" : "hidden"}>
                    <IconButton icon={<RepeatIcon />} onClick={refreshCids}
                        isLoading={refreshing} aria-label="Refreshing" />
                </Center>
                <Center visibility={canRefresh ? "visible" : "hidden"}>
                    <Text color="gray" m={5}>If you see a REFRESH button, click to fetch the newest Arweave hash.</Text>
                </Center>
            </Box>
        </WrapItem>
    );
}

export const AccountInfo = () => {
    const renderETH = () => {
        const eth = ViewMdoelBridge.DNA.genes.crypto.eth || ViewData.eth;
        return (
            <WrapItem padding="10px">
                <QrcodeCard data={eth} title="EVM | ETH" />
            </WrapItem>
        );
    };
    const renderDotbit = () => {
        const did = ViewMdoelBridge.DNA.genes.dotbit;
        if(did && did.length > 4){
            const img = ViewMdoelBridge.DotbitContext.avatar;
            return (
                <WrapItem padding="10px">
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
                <WrapItem padding="10px">
                    <AvatarCard did={did} avatar={img} />
                </WrapItem>
            );
        }
    }
    const renderIdena = () => {
        const idena = ViewMdoelBridge.DNA.genes.crypto.idena;
        if(idena && idena.length > 10)
        return (
            <WrapItem padding="10px">
                <QrcodeCard data={idena} title="Idena" />
            </WrapItem>
        );
    }

    return (
        <Wrap spacing="20px">
            {renderDotbit()}
            {renderENS()}
            {renderETH()}
            {renderIdena()}
            <SnapshotCard />
        </Wrap>
    );
}