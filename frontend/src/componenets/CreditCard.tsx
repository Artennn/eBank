import { useState } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import VisaLogo from '../i/visa_logo.png'
import MasterCardLogo from '../i/mastercard_logo.png';
import ChipImage from "../i/chip.png";

import { amountFormat } from "../util/formatter";

const CreditCard = ({
    cardNumber,
    balance
} : {
    cardNumber: string,
    balance: string,
}) => {
    const [showNumber, setShowNumber] = useState(false);

    const numberText = showNumber
        ? cardNumber
        : `**** **** **** ${cardNumber.substring(-1, 4)}`;

    const logo = showNumber? VisaLogo : MasterCardLogo

    return (
        <Box sx={{
            height: 1,
            width: "26rem",
            maxHeight: "15rem",
            position: 'relative',
            color: 'white',
            backgroundColor: 'rgb(45, 45, 45)',
            display: "flex",
            flexDirection: "column",
            opacity: 0.9,
            boxShadow: 6,
            borderRadius: 4,
            padding: 3,
            pb: 1,
        }}>
            <Typography variant="subtitle2">Dostepne Srodki</Typography>
            <Typography variant="h5" m="auto 0">{amountFormat(parseFloat(balance))} PLN</Typography>

            <Box ml={2} width="4rem">
                <img src={ChipImage} alt="card-chip" width="100%" />
            </Box>

            <Typography variant="subtitle2" mt={'auto'}>Numer Karty</Typography>

            <Box display="flex" mt="auto">
                <Typography variant="h5" m="auto 0">{numberText}</Typography>
                <IconButton sx={{ color: 'white' }} onClick={() => setShowNumber(!showNumber)}>
                    {showNumber? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </Box>

            <IconButton sx={{ position: 'absolute', top: 0, right: 0, p: 2, color: 'white' }}>
                    <MoreVertIcon />
            </IconButton>

            <Box position="absolute" sx={{ bottom: 0, right: 0, p: 1.5, width: "30%", maxWidth: "10rem", ml: 'auto' }}>
                <img src={logo} alt="visa_logo" width="100%" />
            </Box>
        </Box>
    )
}
export default CreditCard;