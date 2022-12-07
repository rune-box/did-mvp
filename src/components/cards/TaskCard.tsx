import { RepeatIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";
import { DataRuneTask } from "../../models/DataRune";

type TaskCardProps = {
    item: DataRuneTask,
    refreshTask: (task: DataRuneTask) => any;
}
export const TaskCard = ({item, refreshTask}: TaskCardProps) => {
    return (
    <Card>
        <CardHeader>
            <Heading size='md'>{item.rune.title}</Heading>
        </CardHeader>
        <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Heading size='xs' textTransform='uppercase'>description</Heading>
                    <Text pt='2' fontSize='sm'>{item.rune.description}</Text>
                </Box>
                {item.finished ? <Box>
                    <Heading size='xs' textTransform='uppercase'>data</Heading>
                    <Text pt='2' fontSize='sm'>{typeof item.data === "boolean" ? (item.data ? "YES" : "NO") : item.data}</Text>
                </Box> : null}
            </Stack>
        </CardBody>
        <CardFooter>
            <Button isLoading={item.isLoading} isDisabled={item.finished} leftIcon={<RepeatIcon/>}
                onClick={(e) => { refreshTask(item) }}>Refresh</Button>
        </CardFooter>
    </Card>);
}