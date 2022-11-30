import { Box, Heading, LinkBox, LinkOverlay, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { RoutesData } from "../client/RoutesData";
import { ViewData, ViewMdoelBridge } from "../client/ViewData";
import { SnapshotCard, SnapshotsCards } from "../components/AccountInfo";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { CIDs } from "../models/CIDs";
import { APIs } from "../services/APIs";

export const NavView = () => {
    return (
        <VStack spacing={4}>
            <NavBar />
            <Wrap spacing='30px' justify='center'>
                <WrapItem>
                    <LinkBox as="article" maxW='sm' p='5' borderWidth='1px' rounded='md' width="300px" height="200px">
                        <Box as='time'></Box>
                        <Heading size='md' my='2'>
                            <LinkOverlay as={ReactLink} to={RoutesData.Profile}>Profile</LinkOverlay>
                        </Heading>
                        <Text>View your public profile.</Text>
                    </LinkBox>
                </WrapItem>
                <WrapItem>
                    <LinkBox as="article" maxW='sm' p='5' borderWidth='1px' rounded='md' width="300px" height="200px">
                        <Box as='time'></Box>
                        <Heading size='md' my='2'>
                            <LinkOverlay as={ReactLink} to={RoutesData.Manage}>Manage</LinkOverlay>
                        </Heading>
                        <Text>Add/Remove accounts; Update multisig threshold.</Text>
                    </LinkBox>
                </WrapItem>
                <WrapItem>
                    <LinkBox as="article" maxW='sm' p='5' borderWidth='1px' rounded='md' width="300px" height="200px">
                        <Box as='time'></Box>
                        <Heading size='md' my='2'>
                            <LinkOverlay as={ReactLink} to={RoutesData.CyberMark}>Cyber Mark</LinkOverlay>
                        </Heading>
                        <Text>Create a snapshot to protect your cyber marks.</Text>
                    </LinkBox>
                </WrapItem>
            </Wrap>
            <SnapshotsCards />
            <Footer />
        </VStack>
    );
}