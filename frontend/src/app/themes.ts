//@ts-nocheck
import { createTheme } from '@mui/material/styles';

declare module "@mui/material/styles" {
    interface TypeBackground {
        card: string;
        tableCell: string;
        dark: string;
    }
}

export const baseTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: 'rgb(240, 242, 245)',
            paper: 'rgb(240, 242, 245)',
            card: 'rgb(255, 255, 255)',
            tableCell: '#e5ebeb4f',
            dark: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))',
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    "&.Mui-disabled": {
                        WebkitTextFillColor: 'black',
                    }
                }
            }
        }
    }
});