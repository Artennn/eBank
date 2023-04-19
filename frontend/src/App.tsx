import { Box } from "@mui/system";

import Login from "./containers/Login";
import NavBar from "./containers/NavBar";
import SideBar from "./containers/SideBar";
import Alerts from "./containers/Alerts";

import { NewDefinedTransfer, NewTransfer } from "./containers/Transfers";
import DashBoard from "./containers/DashBoard";
import History from "./containers/History";
import Recipients, { NewRecipient } from "./containers/Recipients";
import DefinedTransfers from "./containers/DefinedTransfers";

import { useAppSelector } from "./app/hooks";
import { selectUser } from "./reducers/user";

import { ThemeProvider } from "@mui/material";
import { baseTheme} from "./app/themes";

const pagesContainers = {
    'dashboard': <DashBoard />,
    'new-transfer': <NewTransfer />,
    'defined-transfers': <DefinedTransfers />,
    'new-defined-transfer': <NewDefinedTransfer />,
    'recipients': <Recipients />,
    'new-recipient': <NewRecipient />,
    'history': <History />,
    'blank': <Box />,
}

export type Page = keyof typeof pagesContainers;

const App = () => {
    const isLoggedIn = useAppSelector(selectUser)._id !== "";
    const { page } = useAppSelector(state => state.app);

    if (!isLoggedIn) return (
        <Login />
    )

    return (
        <ThemeProvider theme={baseTheme}>
            <Box sx={{
                display: 'flex',
                height: '100vh',
                bgcolor: 'background.default',
                maxWidth: 1440,
                margin: 'auto',
            }}>
                <SideBar />
                
                <Box sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    position: 'relative',
                    padding: 2,
                }}>
                    <NavBar />
                    
                    {pagesContainers[page]}
                </Box>
            </Box>
            
            <Alerts />
        </ThemeProvider>
    )
}
export default App;