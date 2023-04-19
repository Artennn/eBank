import { AppBar, Badge, IconButton, Toolbar, Typography } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import UpdateIcon from '@mui/icons-material/Update';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSideBar } from '../reducers/app';
import { logout } from '../reducers/user';
import { useEffect, useState } from 'react';

import { dispatchAlert, NewAlert } from '../reducers/alert';

const formatTime = (pSeconds: number) => {
    let minutes = Math.floor(pSeconds / 60).toString();
    let seconds = (pSeconds % 60).toString();

    minutes = minutes.padStart(2, "0");
    seconds = seconds.padStart(2, "0");

    return `${minutes}:${seconds}`
}

const useCountdown = (timeout: number) => {
    const [remaining, setRemaining] = useState(timeout);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setRemaining(remaining - 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [remaining])

    const reset = () => {
        setRemaining(timeout);
    }
    
    return { remaining, reset }
}

const NavBar = () => {
    const dispatch = useAppDispatch();
    const { page } = useAppSelector(state => state.app);
    const { remaining, reset } = useCountdown(5 * 60);

    const showWarning = remaining < 60;

    useEffect(() => {
        showWarning && dispatchAlert(dispatch, { type: "warning", text: "Sesja wkrotce wygasnie"});
    }, [showWarning])

    // reset timer when page is changed
    useEffect(() => {
        reset();
    }, [page])

    // logout after countdown reaches 0
    useEffect(() => {
        if (remaining <= 0) {
            dispatch(logout());
            /* dispatchAlert(dispatch, {
                type: "error",
                text: "Sesja wygasla"
            }); */
        }
    }, [remaining])


    const createAlert = () => {
        const alerts: NewAlert[] = [
            { type: "error", text: "Otrzymales nowe powiadomienie o ..." },
            { type: "success", text: "Otrzymales nowe powiadomienie o ..." },
            { type: "warning", text: "Otrzymales nowe powiadomienie o ..." },
            { type: "info", text: "Otrzymales nowe powiadomienie o ..." },
        ]
        const alert = alerts[Math.floor(Math.random() * 5)]
        dispatchAlert(dispatch, alert);
    }

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                top: 0, 
                mb: 2, 
                borderRadius: 2, 
                boxShadow: 5 
                }}
            >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => dispatch(toggleSideBar(null))}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Menu
                </Typography>

                <IconButton color="inherit" onClick={reset}>
                    <UpdateIcon color={showWarning? "warning" : "inherit"} />

                    <Typography 
                        variant="subtitle2" 
                        component="div"
                        sx={{ 
                            position: "absolute", 
                            top: 27,
                        }}
                    >
                        { formatTime(remaining) }
                    </Typography>
                </IconButton>

                <IconButton color="inherit">
                    <Badge badgeContent={1} color="error">
                        <HelpIcon />
                    </Badge>
                </IconButton>

                <IconButton color="inherit">
                    <SettingsIcon />
                </IconButton>

                <IconButton color="inherit"  onClick={createAlert}>
                    <Badge badgeContent={4} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                
                <IconButton 
                    color="inherit" 
                    onClick={() => dispatch(logout())}
                >
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
export default NavBar;