import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Avatar, Box, ButtonBase, Collapse, IconButton, List, ListItem, Typography, useMediaQuery } from '@mui/material';
import MuiDivider from '@mui/material/Divider';

import { ExpandMore } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CallMadeIcon from '@mui/icons-material/CallMade';
import SaveIcon from '@mui/icons-material/Save';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Logo from '../i/bank_logo.png';
import Logo2 from '../i/bank_logo2.png';

import { selectUser} from "../reducers/user";
import { changePage, toggleSideBar, toggleSideBarChildren } from '../reducers/app';
import { Page } from '../App';

const Divider = () => {
    return <MuiDivider variant="fullWidth" sx={{ 
        height: 3,
        border: 'none',
        opacity: 0.5,
        marginTop: 1,
        marginBottom: 1,
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0)) !important',
    }} />
}

const Button = ({ 
    title,
    page, 
    icon, 
    open,
    onClick 
}: { 
    title: string,
    page?: Page, 
    icon: JSX.Element | null, 
    open?: boolean, 
    onClick?: () => void
}) => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector(state => state.app.page);
    const { sidebarChildrenExpanded: expanded } = useAppSelector(state => state.app);

    const selected = currentPage === page;
    const isNested = open !== undefined;

    const handleClick = () => {
        if (page === "blank") return;
        page && dispatch(changePage(page));
        onClick && onClick();
    }

    return (
        <ButtonBase focusRipple onClick={handleClick} disableRipple sx={{ 
            width: '-webkit-fill-available', 
            borderRadius: 2, 
            padding: 1, 
            marginBottom: 1,
            bgcolor: selected? 'primary.main': 'none',
            '&:hover': { 
                backgroundColor: selected? 'primary.main' : 'grey.700' 
            } 
        }}>
            {icon}

            { expanded && 
                <>
                    <Typography component="span" sx={{ marginLeft: 2, marginRight: 'auto' }}>
                        {title}
                    </Typography>

                    { isNested && <ExpandMore sx={{ transition: '0.25s', transform: open? 'rotate(180deg)' : 'none' }} /> }
                </>
            }
        </ButtonBase>
    )
}

const NestedButton = ({ 
    title, 
    icon,
    children 
}: { 
    title: string, 
    icon: JSX.Element, 
    children?: JSX.Element | JSX.Element[] 
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ width: '100%', padding: 0 }}>
            <Button 
                title={title}
                icon={icon}
                open={open}
                onClick={() => setOpen(!open)} 
            />

            <Collapse in={open}>
                {children}
            </Collapse>

            <Divider />
        </Box>
    )
}

const SideBar = () => {
    const dispatch = useAppDispatch();
    const { sidebarExpanded, sidebarChildrenExpanded } = useAppSelector(state => state.app);
    const [hovering, setHovering] = useState(false);

    const currentUser = useAppSelector(selectUser);

    const isWide = useMediaQuery('(min-width:1100px)');
    const isMobile = useMediaQuery('(max-width:750px)');

    const handleTransition = (enter: boolean) => {
        dispatch(toggleSideBarChildren(enter));
    }

    useEffect(() => {
        dispatch(toggleSideBar(isWide));
    }, [isWide]);

    useEffect(() => {
        if (isWide) dispatch(toggleSideBar(isWide));
    }, [])

    const mobileSX = isMobile? {
        position: 'absolute',
        left: sidebarExpanded? 16 : -250,
        transition: '500ms',
        mt: 2,
        mb: 2,
        zIndex: 2000,
    } : {};

    return ( 
        <Box sx={{ 
            height: '-webkit-fill-available',
            margin: isMobile? 0 : 2, 
            mr: 0,
            ...mobileSX
        }}>
            <Collapse
                orientation="horizontal" 
                in={sidebarExpanded || hovering } 
                collapsedSize={75}
                onEnter={() => handleTransition(true)} 
                onExited={() => handleTransition(false)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                sx={{ 
                    height: '100%',
                    overflowY: !sidebarChildrenExpanded? "hidden" : "auto",
                    background: theme => theme.palette.background.dark,
                    borderRadius: 2,
                    color: 'white',
                    boxShadow: 5,
                }}
            >
                <Box sx={{ width: sidebarChildrenExpanded? 250 : 75 }}>
                    <List>
                        { isMobile &&
                            <Box display="flex" sx={{ pt: 1, pr: 1 }}>      
                                <IconButton sx={{ ml: 'auto', color: 'white' }} onClick={() => dispatch(toggleSideBar(null))}>
                                    <ArrowBackIosIcon />
                                </IconButton>
                            </Box>
                        }

                        <Box sx={{ height: 100, padding: sidebarChildrenExpanded? 0 : 2 }}>
                                <img alt="expanded" src={Logo} width='100%' style={{ display: sidebarChildrenExpanded? "block" : 'none', margin: 'auto' }}/>
                                <img alt="expanded" src={Logo2} width={44} height={44} style={{ display: !sidebarChildrenExpanded? "block" : 'none', margin: 'auto' }}/>
                        </Box>
                        <Divider/>

                        <ListItem>
                            <NestedButton title="Konto" icon={ <Avatar alt="avatar" src={currentUser?.image} sx={{ width: 32, height: 32 }}/> } >
                                <Button page="blank" title="Profil" icon={<AccountCircleIcon />} /> 
                                <Button page="blank" title="Ustawienia" icon={<SettingsIcon />} />
                            </NestedButton>
                        </ListItem>

                        <ListItem>
                            <Button page="dashboard" title="Przeglad" icon={<DashboardIcon />} />
                        </ListItem>

                        <ListItem>
                            <NestedButton title="Przelewy" icon={<CompareArrowsIcon />}>
                                <NestedButton title="Jednorazowe" icon={<CallMadeIcon />}>
                                    <Button page="new-transfer" title="Dowolny" icon={<AccountBalanceIcon />} />
                                </NestedButton>

                                <NestedButton title="Zdefiniowane" icon={<SaveIcon />}>
                                    <Button page="defined-transfers" title="Lista" icon={<FormatListBulletedIcon />} />
                                    <Button page="new-defined-transfer" title="Nowy" icon={<AddBoxIcon />} />
                                </NestedButton>

                                <Button page="blank" title="Oczekujace" icon={<PendingActionsIcon />} />
                            </NestedButton>
                        </ListItem>

                        <ListItem>
                            <NestedButton title="Historia" icon={<HistoryIcon />}>
                                <Button page="history" title="Operacje" icon={<TimelineIcon />} />
                            </NestedButton>
                        </ListItem>

                        <ListItem>
                            <NestedButton title="Kontrahenci" icon={<PeopleAltIcon />}>
                                <Button page="recipients" title="Zapisani" icon={<AssignmentIndIcon />} />
                                <Button page="new-recipient" title="Dodaj" icon={<AddBoxIcon />} />
                            </NestedButton>
                        </ListItem>
                    </List>
                </Box>
            </Collapse>
        </Box>
    )
}
export default SideBar;