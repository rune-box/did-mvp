import { CheckIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Divider, Flex, IconButton, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, useToast, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { githubAuthorize, githubVerify, twitterAuthorize, twitterVerify } from "@cyberlab/social-verifier";
import { useViewerRecord } from "@self.id/framework";
import { useState } from "react";
//import { CeramicContext } from "../client/CeramicContext";
import { EmptyDNA, ViewData, ViewMdoelBridge } from "../client/ViewData";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { AuthAPIs } from "../services/APIs";
import { Utility } from "../utils/Utility";

export const ManageView = () => {
    const [twitter, setTwitter] = useState(ViewMdoelBridge.DNA.genes.social.twitter);
    const [github, setGithub] = useState(ViewMdoelBridge.DNA.genes.social.github);
    const [gistContent, setGistContent] = useState("");
    const [gistId, setGistId] = useState("");
    const toast = useToast();
    const record = useViewerRecord("cryptoAccounts");
    

    const uriIdenaDesktop = AuthAPIs.getUri_Idena_Desktop(Utility.generatePlainUUID());
    const uriIdenaWeb = AuthAPIs.getUri_Idena_Web(Utility.generatePlainUUID());
    //const cxtCeramic: CeramicContext = ViewData.ceramicContext;

    const namespace = "runebox";

    const prepareTwitter = async () => {
        if(!twitter || twitter.length < 1){
            return;
        }
        const sig = await twitterAuthorize((window as any).ethereum, ViewData.eth, twitter);
        const text = `Verifying my Web3 identity on @_runebox_: %23LetsRunes %0A ${sig}`;
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    };
    const verifyTwitter = async () => {
        const r = await twitterVerify(ViewData.eth, twitter, namespace);
        console.log(r);
        if(r.result === "SUCCESS"){
            ViewMdoelBridge.DNA.genes.social.twitter = twitter;
            toast({
                title: 'Success!',
                description: "Your wallet address has been linked to the Twitter account: " + twitter,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const prepareGithub = async () => {
        if(!github || github.length < 1){
            return;
        }
        const sig = await githubAuthorize((window as any).ethereum, ViewData.eth, github);
        setGistContent(sig);
    };
    const verifyGithub = async () => {
        if(!github || github.length < 1 || !gistId){
            return;
        }
        const r = await githubVerify(ViewData.eth, gistId, namespace);
        console.log(r);
        if(r.result === "SUCCESS"){
            ViewMdoelBridge.DNA.genes.social.github = github;
            toast({
                title: 'Success!',
                description: "Your wallet address has been linked to the Github account: " + github,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const renderSections = () => {
        //!cxtCeramic.selfid
        if(!ViewData.eth){ // guest
            return (
                <Text>You should login first.</Text>
            );
        }
        return (
            <Tabs>
                <TabList>
                    <Tab>Crypto</Tab>
                    <Tab>Social</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box>
                            <ButtonGroup w="100%" variant='outline' spacing='6'>
                                <Button>Ethereum Wallet</Button>
                                <Button as="a" href={uriIdenaDesktop}>Idena: Desktop App</Button>
                                <Button as="a" href={uriIdenaWeb}>Idena: Web App</Button>
                            </ButtonGroup>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <VStack w="100%">
                            <Text w="100%">Twitter</Text>
                            <Flex w="100%">
                                <InputGroup minW={300}>
                                    {/* <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray' />} /> */}
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
                                    {/* <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray' />} /> */}
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
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        );
    };
    return (
        <VStack spacing={4}>
            <NavBar/>
            {renderSections()}
            <Footer/>
        </VStack>
    );
}