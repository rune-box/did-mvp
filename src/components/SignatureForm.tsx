import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Input, InputGroup, InputLeftAddon, Spacer, Text, Textarea, VStack } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import React from "react";

type SignatureFormType = {
    defaultAddress: string;
    defaultMessage: string;
    buildMessage: (account: string) => any;
    //api: string;
    onVerify: (account: string, message: string, signature: string) => any;
}
export const SignatureForm = ({defaultAddress, defaultMessage, buildMessage, onVerify}: SignatureFormType) => {
    const [address, setAddress] = React.useState(defaultAddress);
    const [addressLocked, setAddressLocked] = React.useState(defaultAddress !== null && defaultAddress.length > 5);
    const [message, setMessage] = React.useState(defaultMessage);
    const [signature, setSignature] = React.useState("");
    const [isVerifying, setIsVerifying] = React.useState(false);
    const { nextStep, prevStep, reset, activeStep } = useSteps({
        initialStep: 0,
      });

    const updateAccount = (account: string) => {
        setAddress(account);
        const msg = buildMessage(account);
        setMessage(msg);
    }
    const verify = async ()=>{
        setIsVerifying(true);
        try {
            await onVerify(address, message, signature);
        }
        finally {
            setIsVerifying(false);
        }
    }
    
    return (
        <VStack>
            <Steps orientation="vertical" activeStep={activeStep}>
                <Step width="100%" label="Input wallet address">
                    <VStack>
                        <InputGroup>
                            <InputLeftAddon children='Address' />
                            <Input type='text' placeholder='Wallet address' value={address} isReadOnly={addressLocked}
                                onChange={(e) => {updateAccount(e.target.value);}} />
                        </InputGroup>
                    </VStack>
                </Step>
                <Step width="100%" label="Copy Message">
                    <VStack>
                        <Text>Message</Text>
                        <Textarea value={message} isReadOnly={true} height="200px"></Textarea>
                    </VStack>
                </Step>
                <Step width="100%" label="Paste Signature">
                    <VStack>
                        <Text>Signature</Text>
                        <Textarea value={signature} height="200px"
                            onChange={(e) => {setSignature(e.target.value);}}></Textarea>
                    </VStack>
                </Step>
                <Step width="100%" label="Verify">
                    <Box>
                    <IconButton icon={<CheckIcon />} aria-label={"OK"} m={2} isRound={true} variant='outline'
                        isLoading={isVerifying}
                        isDisabled={!signature} onClick={verify}/>
                    </Box>
                </Step>
            </Steps>
            <Flex width="100%" justify="space-between">
                <IconButton icon={<ArrowBackIcon />} aria-label={"Previous"} m={2} isRound={true} variant='outline'
                    isDisabled={activeStep === 0} onClick={prevStep}/>
                <Spacer/>
                <IconButton icon={<ArrowForwardIcon />} aria-label={"Next"} m={2} isRound={true} variant='outline'
                    onClick={nextStep}/>
            </Flex>
        </VStack>
    );
}