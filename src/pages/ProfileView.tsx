import * as React from "react"
import {
  VStack,
  InputGroup,
  InputLeftAddon,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider
} from "@chakra-ui/react"
import { CardsRenderer } from "../components/cards/CardsRenderer"
import { ENSContext } from "../client/ENSContext"
import { DotbitContext } from "../client/DotbitContext"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/Footer"
import { loadAppData, resetAppData } from "../client/AppData"
import { EmptyDNA, ViewData, ViewMdoelBridge } from "../client/ViewData"
import { AccountInfo, DIDAvatarsCards, SnapshotCard, SnapshotsCards } from "../components/AccountInfo"

export const ProfileView = () => {
  return (
    <VStack spacing={4}>
      <NavBar />
      <Tabs width="100%" isFitted={true}>
        <TabList>
          <Tab>Avatars</Tab>
          <Tab>Accounts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DIDAvatarsCards />
          </TabPanel>
          <TabPanel>
            <AccountInfo />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider/>
      <SnapshotsCards />
      <CardsRenderer evmAddress={ViewMdoelBridge.DNA.genes.crypto.eth} idenaAddress={ViewMdoelBridge.DNA.genes.crypto.idena} />
      <Footer />
    </VStack>
  );
}