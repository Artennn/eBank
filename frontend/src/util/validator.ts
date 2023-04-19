import { Account } from "../interfaces/account";

import { startOfDay } from 'date-fns'
import { TransferInfo } from "../interfaces/transfer";
import { Recipient, recipientGroup } from "../interfaces/recipient";

type AccountValidation = {
    [key in keyof Account]: (x: string) => boolean
};

export const accountValidator: AccountValidation = {
    number: (number: string): boolean => {
        return /^\d{26,26}$/.test(number);
    },
    name: (name: string): boolean => {
        return name.length >= 3;
    },
    name2: (): boolean => {
        return true;
    },
    address: (address: string): boolean => {
        return address.length >= 3;
    },
    postal: (postal: string): boolean => {
        return /^\d\d-\d\d\d /.test(postal);
    },
}

export const validateAccount = (account: Account) => {
    for (const key in accountValidator) {
        const value = account[key as keyof Account] || "";
        const validator = accountValidator[key as keyof Account];
        if (validator && !validator(value)) return false;
    }
    return true;
}

type TransferInfoValidation = {
    title: (x: string) => boolean,
    amount: (x: string) => boolean,
    date: (x: Date) => boolean,
    type: (x: string) => boolean,
};

export const transferInfoValidator: TransferInfoValidation = {
    title: (title): boolean => {
        return title.length >= 3;
    },
    amount: (amount): boolean => {
        return /^\d{1,7}.\d{2,2}$/.test(amount);
    },
    date: (date): boolean => {
        return date >= startOfDay(new Date());
    },
    type: (type) => {
        return true;
    }
}

export const validateTransferInfo = (transferInfo: TransferInfo) => {
    const { title, amount, date, type } = transferInfoValidator;
    if (!title(transferInfo.title)) return false;
    if (!amount(transferInfo.amount)) return false;
    if (!date(transferInfo.date)) return false;
    if (!type(transferInfo.type)) return false;
    return true;
}

export const recipientValidator = {
    name: (name: string) => {
        return name.length >= 3;
    },
    group: (group: recipientGroup | null) => {
        return group !== null;
    },
    account: (account: Account) => {
        return validateAccount(account);
    }
}

export const validateRecipient = (recipient: Recipient) => {
    const { name, group, account } = recipientValidator;
    if (!name(recipient.name)) return false;
    if (!group(recipient.group)) return false;
    if (!account(recipient.account)) return false;
    return true;
}

