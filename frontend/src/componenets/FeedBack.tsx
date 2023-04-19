import { Backdrop, Box, CircularProgress, Fab, Typography } from "@mui/material";
import { StyledPaper } from "./Card";

import { green } from '@mui/material/colors';

import CheckIcon from '@mui/icons-material/Check';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { useState, useEffect } from "react";

export const Verification = ({
    onVerification,
} : {
    onVerification: (success: boolean) => void,
}) => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    const size = 100;

    const buttonSx = {
        height: size,
        width: size,
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const iconSx = {
        width: '75%',
        height: '75%',
    }

    useEffect(() => {
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                onVerification(true);
            }, 2500)
        }, 5000);
    }, [])

    return (
        <Backdrop open={true} sx={{ zIndex: 1500 }}>
            <StyledPaper sx={{ textAlign: 'center', width: '40rem', padding: 2 }}>
                <Typography variant="h5">
                    {success? "Operacja Zaakceptowana" : "Zaakceptuj Operacje w Aplikacji Mobilnej"}
                </Typography>

                <Box display="flex">
                    <Box sx={{ m: 'auto', mt: 4, mb: 4, position: 'relative' }}>
                        <Fab
                            aria-label="save"
                            color="primary"
                            sx={buttonSx}
                        >
                            {success ? <CheckIcon sx={iconSx} /> : <SmartphoneIcon sx={iconSx} />}
                        </Fab>

                        {loading && (
                            <CircularProgress
                                size={size + 20 * size / 100}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: -(size / 10),
                                    left: -(size / 10),
                                    zIndex: 2000,
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </StyledPaper>
        </Backdrop>
    )
}


export type SavingStage = null | "saving" | "success" | "error";

export const Saving = ({ 
    stage,
    onClose,
} : { 
    stage: SavingStage,
    onClose?: () => void,
}) => {

    const buttonSx = {
        ...(stage === "success" && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
        m: 'auto',
    };

    const handleClose = () => {
        stage === "error" && onClose && onClose();
    }

    return (
        <Box display="flex" sx={{ minWidth: 200, minHeight: 100 }}>
            <Box sx={{ position: 'relative', m: 'auto' }}>
                <Fab
                    aria-label="save"
                    color={stage === "error"? "error" : "primary"}
                    sx={buttonSx}
                    disableRipple
                    onClick={handleClose}
                    
                >
                    {stage === "saving" && <SaveIcon />}
                    {stage === "success" && <CheckIcon />}
                    {stage === "error" && <CancelIcon />}
                </Fab>
                
                {stage === "saving" && (
                    <CircularProgress
                        size={68}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            zIndex: 2000,
                        }}
                    />
                )}
            </Box>
        </Box>
    )
}