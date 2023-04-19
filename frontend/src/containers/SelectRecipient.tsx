import { useEffect, useState } from "react";

import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

import Card from "../componenets/Card";
import { TextInput } from "../componenets/Inputs";
import RecipientsTable from "../componenets/RecipientsTable";

import { Recipient } from "../interfaces/recipient";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecipients } from "../reducers/recipients";
import { filterRecipients } from "../util/filter";


const SelectRecipient = ({
    onSelect,
    onClose,
} : {
    onSelect: (recipient: Recipient) => void,
    onClose: () => void,
}) => {
    const dispatch = useAppDispatch();
    const { recipients, groups } = useAppSelector(state => state.recipients);
    const [search, setSearch] = useState("");

    const handleSearchChange = (name: string, value: string) => {
        setSearch(value);
    }

    const searchedRecipients = filterRecipients(recipients, search);

    useEffect(() => {
        dispatch(fetchRecipients());
    }, []);

    return (
        <Dialog open={true} fullWidth maxWidth="lg" onClose={onClose}>
            <DialogTitle sx={{ display: 'flex' }}>
                <Typography component="div" variant="h6" sx={{ margin: 'auto auto auto 0' }}>Wybierz Kontrahenta</Typography>

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Card title="Szukaj" expandable>
                    <Box display="flex">
                        <TextInput label="Szukaj" width='30%' autoFocus value={search} onChange={handleSearchChange} />
                    </Box>

                    <> { searchedRecipients.length > 0 && 
                        <RecipientsTable 
                            variant="select"
                            onSelect={onSelect} 
                            recipients={searchedRecipients} 
                        />
                    } </> 
                </Card>

                {groups.map((group, key) => (
                    <Card title={group.name} expandable closed key={key}>
                        <RecipientsTable 
                            variant='select'
                            onSelect={onSelect}
                            recipients={recipients.filter(recipient => recipient.group._id === group._id)} 
                        />
                    </Card>
                ))}
            </DialogContent>
        </Dialog>
    )
}
export default SelectRecipient;