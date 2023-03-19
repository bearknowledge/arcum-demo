import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { theme } from "../theme";
import { AuthUserProvider } from "../contexts/AuthUserContext";
import { DataProvider } from "src/contexts/DataContext";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Arcum X</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthUserProvider>
                        <DataProvider>
                            {getLayout(<Component {...pageProps} />)} 
                        </DataProvider>
                    </AuthUserProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
};

export default App;
