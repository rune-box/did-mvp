import { TimeIcon } from "@chakra-ui/icons";
import { Box, Center, Divider, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DataCard } from "../../models/DataCard";
import { DataRune } from "../../models/DataRune";
import { getData } from "../../services/HttpWorker";
import { DataPart } from "../DataPart";

// export const CardRenderer = (data: DataCard) => {
//     return (
//         <Box w='360px' h='300px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
//             <Heading as='h3' size='lg' color='gray.500' m={2}>{data.name}</Heading>
//             <Divider />
//             <Center h='200px' fontWeight='semibold'>
//                 <Text fontSize='6xl'>{data.data}</Text>
//             </Center>
//             <Divider />
//             <Box as='h4' m={1} color='gray.500' fontSize='xs'>
//                 ⏰ {data.updated}
//             </Box>
//         </Box>
//     );
// }

type CardDataType = {
    cardType: string;
    id: string;
    name: string ;
    data: number | string | boolean;
    updated: string;
}

export const CardRenderer = ({cardType, id, name, data, updated}: CardDataType) => {
    return (
        <Box w='360px' h='300px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Heading as='h3' size='lg' color='gray.500' m={2}>{name}</Heading>
            <Divider />
            <Center h='200px' fontWeight='semibold'>
                <DataPart cardType={cardType} data={data} />
            </Center>
            <Divider />
            <Box as='h4' m={1} color='gray.500' fontSize='xs'>
                <TimeIcon mr={2} /> {updated}
            </Box>
        </Box>
    );
}

type QueryProps = {
    address: string;
    rune: DataRune;
}

export const SimpleCard = ({address, rune}: QueryProps) => {
    const [cardData, setCardData] = useState({});

    const [cardType, setCardType] = useState("");
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [data, setData] = useState(0);
    const [updated, setUpdated] = useState("");
    if(rune.isTask || rune.apis.length === 0){
        return (
            <Box></Box>
        );
    }

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        async function refreshData() {
            const tmp = await getData(address, rune.apis[0].uri, "POST", Math.random() * 365);
            //setCardData(cardData => data);
            setCardType(cardType => tmp.cardType);
            setId(id => tmp.id);
            setTitle(title => tmp.title);
            setData(data => tmp.data);
            setUpdated(updated => tmp.updated);
        };
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if(!title || title.length === 0)
            refreshData();
      }, []);
    
    return (
        <CardRenderer cardType={cardType} id={id} name={title} data={data} updated={updated}></CardRenderer>
    );
}