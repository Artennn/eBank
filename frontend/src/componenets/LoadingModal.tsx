import { Backdrop, Box, CircularProgress } from "@mui/material";


const LoadingModal = ({
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
export default LoadingModal;