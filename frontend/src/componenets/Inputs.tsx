import { FocusEvent, ChangeEvent, useState } from 'react';

import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { useMediaQuery } from '@mui/material';
import { TextFieldProps } from '@mui/material';
import { AccountFormat, AmountFormat } from './NumberFormat';

import { getBankName } from '../util/getInfo';

type Modify<T, R> = Omit<T, keyof R> & R;

// extend and override TextFieldProps
interface TextInputProps extends Modify<TextFieldProps, {
    label: string,
    width?: number | string,
    readOnly?: boolean,
    error?: string | boolean,
    maxLength?: number,
    onChange?: (name: string, value: string) => void,
    onBlur?: (name: string) => void
}> {}

export const TextInput = ({
    label,
    name = "",
    value,
    placeholder,
    width = "auto",
    readOnly = false,
    error,
    helperText,
    maxLength,
    required,
    onChange = () => {},
    onBlur,
    ...others
}: TextInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(name);
    }

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            placeholder={placeholder}
            error={error? true : false}
            helperText={error !== undefined? error || " " : helperText}
            disabled={readOnly}
            required={required}
            onChange={handleChange}
            onBlur={handleOnBlur}
            sx={{
                width,
                display: 'flex',
                marginBottom: helperText? 1 : 2,
                '& .MuiInputBase-input': {
                    padding: 1.5
                }
            }}
            inputProps={{
                maxLength: maxLength? maxLength : 32,
            }}
            {...others}
        />
    )
}

interface TextAreaProps extends Modify<TextFieldProps, {
    label: string,
    error?: string | boolean,
    readOnly?: boolean,
    maxLength?: number,
    onChange?: (name: string, value: string) => void,
    onBlur?: (name: string) => void
}> {}

export const TextArea = ({
    label,
    name = "",
    value,
    error,
    helperText,
    rows = 3,
    maxLength = 128,
    readOnly = false,
    onChange = () => {},
    onBlur,
}: TextAreaProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length > maxLength) return;
        if (newValue.split('\n').length > rows) return;
        onChange(name, newValue);
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(name);
    }

    return (
        <TextField
            variant="outlined"
            multiline
            rows={rows}
            label={label}
            name={name}
            value={value}
            error={error? true : false}
            helperText={error !== undefined? error || " " : helperText}
            disabled={readOnly}
            onChange={handleChange}
            onBlur={handleOnBlur}
            fullWidth
            inputProps={{
                cols: 20,
                rows: 3,
                wrap: "hard",
                maxLength: maxLength,
            }}
        />
    )
}

export const DateInput = ({
    label,
    name,
    value,
    blockPast,
    readOnly,
    onChange,
} : {
    label: string,
    name: string,
    value: Date,
    blockPast?: boolean,
    readOnly?: boolean,
    onChange: (name: string, newValue: Date) => void,
}) => {
    const isMobile = useMediaQuery('(max-width: 700px)');

    const handleChange = (newValue: Date | null) => {
        newValue && onChange(name, newValue);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={plLocale}>
            { !isMobile? 
                <DesktopDatePicker
                    label={label}
                    inputFormat="dd/MM/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} disabled={readOnly} />}
                    minDate={blockPast? new Date() : undefined}
                    views={["day"]}
                    readOnly={readOnly}
                />
            :
                <MobileDatePicker
                    label={label}
                    inputFormat="dd/MM/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} disabled={readOnly} />}
                    minDate={blockPast? new Date() : undefined}
                    views={["day"]}
                    readOnly={readOnly}
                />
            }
        </LocalizationProvider>
    );
}

interface AccountNumberInputProps extends Modify<TextFieldProps, {
    label: string,
    width?: number | string,
    readOnly?: boolean,
    value: string,
    error?: string | boolean,
    onChange?: (name: string, value: string) => void,
    onBlur?: (name: string) => void,
}> {}

export const AccountNumberInput = ({
    label,
    name = "",
    value,
    placeholder,
    width = "auto",
    readOnly = false,
    required,
    error,
    onChange = () => {},
    onBlur
}: AccountNumberInputProps) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(name);
    }

    const bankName = getBankName(value);
    let helperText;

    if (!error) {
        if (value.length > 5) {
            helperText = bankName? bankName : "Nie znaleziono Banku"
        } else {
            helperText = " "
        }
    } else {
        helperText = error;
    }

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            placeholder={placeholder}
            error={error? true : false}
            helperText={helperText}
            disabled={readOnly}
            required={required}
            onChange={handleChange}
            onBlur={handleOnBlur}
            sx={{
                width,
                display: 'flex',
                marginBottom: 1,
                '& .MuiInputBase-input': {
                    padding: 1.5
                }
            }}
            InputProps = {{
                inputComponent: AccountFormat as any,
            }}
        />
    )
}

interface AmountInputProps extends Modify<TextFieldProps, {
    label: string,
    value: string,
    readOnly?: boolean,
    width?: number | string,
    error?: string | boolean,
    maxLength?: number,
    onChange?: (name: string, value: string) => void,
    onBlur?: (name: string) => void,
}> {}

export const AmountInput = ({
    label,
    name = "",
    value,
    placeholder,
    width = "auto",
    readOnly = false,
    error,
    helperText,
    required,
    onChange = () => {},
    onBlur,
}: AmountInputProps) => {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(name);
    }

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            placeholder={placeholder}
            error={error? true : false}
            helperText={error !== undefined? error || "" : helperText}
            disabled={readOnly}
            required={required}
            onChange={handleChange}
            onBlur={handleOnBlur}
            sx={{
                width,
                display: 'flex',
                marginBottom: 2,
                '& .MuiInputBase-input': {
                    padding: 1.5
                }
            }}
            InputProps = {{
                inputComponent: AmountFormat as any,
            }}
        />
    )
}

export const PasswordInput = ({
    label,
    name,
    value,
    placeholder,
    onChange
} : {
    label: string,
    name: string,
    value: string,
    placeholder?: string,
    onChange: (name: string, newValue: string) => void,
}) => {
    const [show, setShow] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    }

    return (
        <FormControl sx={{ width: '100%', mb: 2 }} variant="outlined">
            <InputLabel>{label}</InputLabel>

            <OutlinedInput
                label={label}
                name={name}
                type={show ? 'text' : 'password'}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShow(!show)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                        >
                            {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}