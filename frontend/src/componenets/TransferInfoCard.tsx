import { useState } from 'react';

import Card from './Card';
import { TextArea, DateInput, AmountInput } from './Inputs';

import { Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Grid } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

import { TransferInfo } from '../interfaces/transfer';
import { transferInfoValidator } from '../util/validator';

type TransferInfoValidation = {
    [key in keyof TransferInfo]: boolean
};

const initialState: TransferInfoValidation = {
    title: true,
    amount: true,
    date: true,
    type: true,
}

const TransferInfoCard = ({
    transferInfo,
    readOnly,
    onChange = () => { }
}: {
    transferInfo: TransferInfo,
    readOnly?: boolean,
    onChange?: (newValue: Partial<TransferInfo>) => void,
}) => {
    const [validation, setValidation] = useState<TransferInfoValidation>(initialState);

    const validate = (name: string, value?: string | Date): boolean => {
        if (readOnly) return true;
        const key = name as keyof TransferInfo;
        const validator = transferInfoValidator[key];
        value = value? value : transferInfo[key];
        return validator(value as string & Date);
    }

    const handleChange = (name: string, value: string | Date) => {
        if (value === "") {
            setValidation({ ...validation, [name]: true });
        } else {
            !validation[name as keyof TransferInfo] && setValidation({ ...validation, [name]: validate(name, value) });
        }
        onChange({ [name]: value });
    }

    const changeTransferType = (type: number) => {
        handleChange("type", type.toString());
    }

    const handleOnBlur = (name: string) => {
        setValidation({ ...validation, [name]: validate(name) });
    }

    for (const k in transferInfo) {
        const key = k as keyof TransferInfo;
        if (transferInfo[key] === "" && !validation[key]) setValidation({ ...validation, [key]: true });
    }

    const { title, amount, date, type } = transferInfo;

    return (
        <Card
            title="Szczegoly Operacji"
            expandable
            fullWidth
            icon={<ArticleIcon fontSize="inherit" />}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={9} md={5}>
                    <TextArea
                        label="Tytul"
                        name="title"
                        value={title}
                        readOnly={readOnly}
                        onChange={handleChange}
                        onBlur={handleOnBlur}
                        error={!validation.title? "Minimum 3 znaki" : false}
                        rows={3}
                    />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                    <Box sx={{ maxWidth: '10rem' }}>
                        <AmountInput
                            label="Kwota"
                            name="amount"
                            value={amount}
                            required={!readOnly}
                            readOnly={readOnly}
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            error={!validation.amount? "Format: XX.XX" : false}
                        />
                        <DateInput
                            label="Data Operacji"
                            name="date"
                            value={date}
                            onChange={handleChange}
                            readOnly={readOnly}
                            blockPast
                        />
                    </Box>
                </Grid>
                
                <Grid item xs={12} sm={"auto"} md={4}>
                    <FormGroup>
                        <FormLabel component="legend"> Sposob Realizacji </FormLabel>
                        <FormControlLabel
                            label="Standard (ELXIR)"
                            control={<Checkbox color="success" checked={type === '0'} disabled={readOnly} onChange={() => changeTransferType(0)} />}
                        />
                        <FormControlLabel
                            label="Ekspresowy (EXPRESS ELXIR)"
                            control={<Checkbox color="primary" checked={type === '1'} disabled={readOnly} onChange={() => changeTransferType(1)} />}
                        />
                    </FormGroup>
                </Grid>
            </Grid>
        </Card>
    )
}
export default TransferInfoCard;