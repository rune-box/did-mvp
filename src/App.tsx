import {
  ChakraProvider,
  Box,
  extendTheme,
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ProfileView } from "./pages/ProfileView"
import { HomeView } from "./pages/HomeView"
import { ManageView } from "./pages/ManageView"
//import { Provider } from "@self.id/framework"
import { RoutesData } from "./client/RoutesData"
import { ActivateView } from "./pages/ActivateView"
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { NavView } from "./pages/NavView"
import { CyberMarkView } from "./pages/CyberMarkView"

const theme = extendTheme({
  components: {
    Steps,
  },
});

export const App = () => {
  return (
    // <Provider client={{ceramic: "testnet-clay"}}>
    //   <ChakraProvider theme={theme}>
    //     <Box padding={2} maxW="1280px" mx="auto">
    //       <BrowserRouter>
    //           <Routes>
    //             <Route path={RoutesData.Activate} element={<ActivateView />} />
    //             <Route path={RoutesData.Profile} element={<ProfileView />} />
    //             <Route path={RoutesData.Manage} element={<ManageView />} />
    //             <Route path="*" element={<HomeView />} />
    //           </Routes>
    //       </BrowserRouter>
    //     </Box>
    //   </ChakraProvider>
    // </Provider>
    <ChakraProvider theme={theme}>
      <Box padding={2} maxW="1280px" mx="auto">
        <BrowserRouter>
            <Routes>
              <Route path={RoutesData.Activate} element={<ActivateView />} />
              <Route path={RoutesData.Nav} element={<NavView />} />
              <Route path={RoutesData.Profile} element={<ProfileView />} />
              <Route path={RoutesData.Manage} element={<ManageView />} />
              <Route path={RoutesData.CyberMark} element={<CyberMarkView />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}
