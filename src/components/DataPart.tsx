import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Divider, Heading, Text } from "@chakra-ui/react";

type DataProps = {
    cardType: string;
    data: string | number | boolean;
}
export const DataPart = ({cardType, data}: DataProps) => {
    if(typeof data === "boolean"){
        if(data === true)
            return (
                <CheckIcon color="green" boxSize={16} />
            );
        return (
            <CloseIcon color="red" boxSize={16} />
        );
    }
    return (
        <Text fontSize='6xl'>{data}</Text>
    );
}