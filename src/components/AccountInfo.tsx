import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Avatar, Box, Center, Link, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";

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
    const arweave = `https://arweave.net/${ViewMdoelBridge.Cids.arweave}`;
    const ipfs = `https://${ViewMdoelBridge.Cids.ipfs}.ipfs.4everland.io/`;
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