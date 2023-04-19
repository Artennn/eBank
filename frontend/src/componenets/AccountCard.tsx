import { useState } from 'react';

import { Box, Button } from '@mui/material';
import AccountIcon from '@mui/icons-material/AccountBalance';

import Card from './Card';
import { AccountNumberInput, TextInput } from './Inputs';
import SelectRecipient from '../containers/SelectRecipient';

import { Account } from '../interfaces/account';
import { Recipient } from '../interfaces/recipient';

import { accountValidator } from '../util/validator';

type AccountValidation = {
    [key in keyof Account]: boolean
};

const initialState: AccountValidation = {
    number: true,
    name: true,
    name2: true,
    address: true,
    postal: true, 
}

const AccountCard = ({ 
    title, 
    account, 
    readOnly = false,
    closed,
    onChange = () => {}, 
}: { 
    title: string,
    account: Account, 
    readOnly?: boolean,
    closed?: boolean,
    onChange?: (newValue: Partial<Account>) => void;
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [validation, setValidation] = useState<AccountValidation>(initialState);

    const handleSelectRecipient = (recipient: Recipient) => {
        onChange(recipient.account);
        setShowDialog(false);
    }

    const validate = (name: string, value?: string): boolean => {
        if (readOnly) return true;
        const key = name as keyof Account;
        if (key === "id") return false;
        return accountValidator[key](value? value : account[key]);
    }

    const handleChange = (name: string, value: string) => {
        if (value === "") {
            setValidation({ ...validation, [name]: true });
        } else {
            !validation[name as keyof Account] && setValidation({ ...validation, [name]: validate(name, value) });
        }
        onChange({ [name]: value });
    }

    const handleOnBlur = (name: string) => {
        setValidation({ ...validation, [name]: validate(name) });
    }

    for (const k in account) {
        const key = k as keyof Account;
        if (account[key] === "" && !validation[key]) setValidation({ ...validation, [key]: true });
    }
    
    return (
        <Card 
            title={title}
            icon={<AccountIcon fontSize="inherit" />} 
            expandable
            closed={closed}
            width='-webkit-fill-available' 
            sx={{ mb: 'auto', minWidth: '20rem' }}
        >
            <AccountNumberInput
                required={!readOnly}
                readOnly={readOnly} 
                onChange={handleChange} 
                onBlur={handleOnBlur}
                error={!validation.number? "Zly format" : false }
                label="Numer Rachunku" 
                name="number" 
                value={account.number} 
            />
            <TextInput 
                required={!readOnly}
                readOnly={readOnly} 
                onChange={handleChange}
                onBlur={handleOnBlur}
                error={!validation.name? "Minimum 3 znaki" : false }
                label="Imie / Nazwa" 
                name="name" 
                value={account.name}
            />
            <TextInput 
                readOnly={readOnly} 
                onChange={handleChange} 
                onBlur={handleOnBlur}
                error={!validation.name2? "" : false }
                label="Nazwisko / Nazwa cd." 
                name="name2" 
                value={account.name2 || ""} 
            />
            <TextInput 
                required={!readOnly}
                readOnly={readOnly} 
                onChange={handleChange} 
                onBlur={handleOnBlur}
                error={!validation.address? "Minimum 3 znaki" : false }
                label="Adres" 
                name="address" 
                value={account.address} 
            />
            <TextInput 
                required={!readOnly}
                readOnly={readOnly} 
                onChange={handleChange}
                onBlur={handleOnBlur}
                error={!validation.postal? "Format: XX-XXX Poczta" : false }
                label="Kod i Poczta" 
                name="postal" 
                value={account.postal} 
            />
            
            <Box display="flex">           
                <Button 
                    variant="contained" 
                    disabled={readOnly} 
                    sx={{ ml: 'auto '}} 
                    onClick={() => setShowDialog(true)} 
                >
                    KONTRAHENCI
                </Button>
            </Box>

            { showDialog ?
                <SelectRecipient 
                    onSelect={handleSelectRecipient}
                    onClose={() => setShowDialog(false)}
                /> : <> </>
            }
        </Card>
    )
}
export default AccountCard;