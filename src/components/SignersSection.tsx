import { Button, Center, Heading, HStack, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { Account4 } from "../models/Account";
import { CheckIcon } from "@chakra-ui/icons";
import { drawAccountIcon } from "../client/UIFunctions";
import { WalletUtility } from "../client/Wallet";

type SignersSectionProps = {
    signers: Array<Account4>;
    sign: (account: Account4) => any;
}
export const SignersSection = ({signers, sign}: SignersSectionProps) => {
    return (
        <Wrap spacing={2} justify='center'>
            {signers.map((item: Account4, index: number) => (
                <WrapItem key={index}>
                    <Button leftIcon={item.done ? <CheckIcon/> : drawAccountIcon(item.key)}
                        colorScheme={item.done ? "green" : "twitter"}
                        isLoading={item.working}
                        onClick={(e) => { sign(item); }}>{WalletUtility.getTitleByAccountKey(item.key)}</Button>
                </WrapItem>
            ))}
        </Wrap>
    );
}