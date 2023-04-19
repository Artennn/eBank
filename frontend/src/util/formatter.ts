import { format } from "date-fns";

export const accountNumberFormat =  (value: string) => {
    value = value.replace(/(.{2})/i, '$1 ');
    value = value.slice(0, 3) + value.slice(3).replace(/(.{4})/g, '$1 ');
    return value.trim();
}

export const amountFormat = (pAmount: number) => {
    return pAmount.toLocaleString("en-GB").replaceAll(",", " ");
}

export const dateFormat = (pDate: Date | string, pFormat: string = 'dd-MM-yyyy') => {
    if (typeof pDate === 'string') pDate = new Date(pDate);
    return format(pDate, pFormat);
}