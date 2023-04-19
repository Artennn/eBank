import { useMemo, useState } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { styled, Paper as MuiPaper, Box, Typography, IconButton, Collapse, SxProps } from '@mui/material';

export const StyledPaper = styled(MuiPaper)({
    padding: 8,
    border: '0px solid rgba(0, 0, 0, 0.125)',
    borderRadius: '0.75rem',
    color: 'black',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem',
});

const IconContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
    top: -20,
    color: 'white',
    borderRadius: 8,
    fontSize: 35,
    padding: 8,
})

const Card = ({ 
    title,
    icon, 
    iconColor,
    expandable = false,
    closed = false,
    width,
    fullWidth = false,
    sx = {},
    children,
}: { 
    title: string,
    icon?: JSX.Element,
    iconColor?: string,
    expandable?: boolean,
    closed?: boolean,
    width?: number | string,
    fullWidth?: boolean,
    sx?: SxProps,
    children?: JSX.Element[] | JSX.Element,
}) => {
    const [open, setOpen] = useState(!closed);

    useMemo(() => {
        setOpen(!closed);
    }, [closed]);

    width = (fullWidth && '100%') || width || "auto";

    return (
        <StyledPaper sx={{ 
            bgcolor: 'background.card', 
            m: 'auto',
            mb: 2, 
            width, 
            ...sx 
        }}>
            <Box display="flex" position="relative">
                { icon && 
                    <IconContainer sx={{ bgcolor: iconColor? iconColor : 'success.main' }}>
                        { icon }
                    </IconContainer>
                }

                <Typography fontWeight="bold" sx={{ margin: 'auto 0', marginLeft: icon? 10 : 1 }}>
                    { title }
                </Typography>

                { expandable && 
                    <IconButton sx={{ ml: 'auto' }} onClick={ () => setOpen(!open) } >
                        <ExpandMore sx={{ transition: '0.1s', transform: open? 'rotate(180deg)' : 'none' }} />
                    </IconButton>
                }
            </Box>

            <Collapse in={open} timeout={750}>
                <Box sx={{ padding: 1 }}>
                    {children && children}
                </Box>
            </Collapse>
        </StyledPaper>
    )
}
export default Card;