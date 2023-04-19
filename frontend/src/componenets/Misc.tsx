import { Box } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";

import { amountFormat } from "../util/formatter";

export const Currency = ({
    value,
    color = "success",
    outgoing,
}: {
    value: number | string,
    color?: string,
    outgoing?: boolean,
}) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (outgoing) color = "primary";

    return (
        <Box sx={{ 
            bgcolor: `${color}.main`, 
            p: 0.5, 
            pl: 1, 
            pr: 1, 
            ml: 'auto', 
            borderRadius: 2, 
            color: 'white' 
        }}>
            {(outgoing !== undefined) && (outgoing? "-" : "+")} {amountFormat(value)} PLN
        </Box>
    )
}

export const LoadingModal = ({
    containerCenter = false,
}: {
    containerCenter?: boolean,
}) => {

    if (containerCenter) return (
        <>
            <Backdrop open={true} sx={{ zIndex: 1500 }} />
            <Box sx={{ zIndex: 2000, position: 'absolute', top: '33%', width: '100%', textAlign: 'center', pr: 2 }}>
                <CircularProgress size={100} />
            </Box>
        </>
    )

    return (
        <Backdrop open={true} sx={{ zIndex: 2000 }}>
            <CircularProgress size={100} />
        </Backdrop>
    )
}