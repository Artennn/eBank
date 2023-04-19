import { Alert, Slide } from "@mui/material";
import { Box } from "@mui/system";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteAlert } from "../reducers/alert";

const Alerts = () => {
    const dispatch = useAppDispatch();
    const alerts = useAppSelector(state => state.alert);

    const handleDeleteAlert = (alertID: number) => {
        dispatch(deleteAlert(alertID));
    }

    return (
        <Box 
            position="absolute" 
            sx={{
                maxHeight: '100%',
                p: 2,
                top: 0, 
                right: 0, 
                zIndex: 2500, 
                display: 'flex', 
                flexDirection: 'column-reverse' 
            }}
        >
            {alerts.map((alert, key) => (
                <Slide direction="down" in={true} key={key}>
                    <Alert 
                        variant="filled" 
                        severity={alert.type} 
                        sx={{ m: 1 }} 
                        onClick={() => handleDeleteAlert(alert.id)}
                    >
                        {alert.text}
                    </Alert>
                </Slide>
            ))}
        </Box>
    )
}
export default Alerts;