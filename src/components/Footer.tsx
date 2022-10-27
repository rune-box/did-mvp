import { Box, ButtonGroup, Flex, Heading, Spacer, Image, Grid, GridItem, VStack, Link, HStack, Divider, Text } from "@chakra-ui/react";
import { AppSettings } from "../client/AppData";

export const Footer = ()=>{
    return (
        <Box w="100%" h={12} color="gray">
            <Divider mt={3} mb={3} />
            <HStack spacing={3} ml={3}>
                <Link textDecoration="none" href="https://www.runebox.xyz/">Runebox</Link>
                <Link textDecoration="none" href="https://github.com/rune-box">Github</Link>
                <Link textDecoration="none" href="https://twitter.com/_runebox_">Twitter</Link>
                <Spacer/>
                {/* <Text>Running on</Text>
                <Text color="red">testnet</Text>
                <Text>of</Text> */}
                {/* <Link textDecoration="none" href="https://ceramic.network/">Ceramic</Link>
                <Text color="red">TESTNET</Text> */}
                <Text color="red" fontWeight="bold">Stage: Chaos</Text>
                <Text> (Data maybe reset)</Text>
                <Text color='gray'>API endpoint: {AppSettings.APIPrefix}</Text>
            </HStack>
        </Box>
    );
}