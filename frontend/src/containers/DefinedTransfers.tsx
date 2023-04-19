import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import Card from '../componenets/Card';
import { TextInput } from '../componenets/Inputs';
import TransfersTable from '../componenets/TransfersTable';

import { changePage } from '../reducers/app';
import { fetchDefinedTransfers } from '../reducers/definedTransfers';

import { filterDefinedTransfers } from '../util/filter';

const DefinedTransfers = () => {
    const dispatch = useAppDispatch();
    const definedTransfers = useAppSelector(state => state.definedTransfers);
    const [search, setSearch] = useState("");

    const handleSearchChange = (name: string, value: string) => {
        setSearch(value);
    }

    const handleNew = () => {
        dispatch(changePage('new-defined-transfer'));
    }

    useEffect( () => {
        dispatch(fetchDefinedTransfers());
    }, [])

    const searchedTransfers = filterDefinedTransfers(definedTransfers, search);

    return (
        <>
            <Card title="Szukaj" expandable>
                <TextInput 
                    label="Szukaj" 
                    width='30%' 
                    value={search} 
                    onChange={handleSearchChange} 
                />
            </Card>

            <Card title="Wyniki" expandable>
                <TransfersTable definedTransfers={searchedTransfers} />
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        sx={{ m: 1 }} 
                        onClick={handleNew}
                    > 
                        NOWY 
                    </Button>
                </Box>
            </Card>
        </>
    );
}
export default DefinedTransfers;