import { Recipient } from "../interfaces/recipient";
import { definedTransfer } from "../interfaces/transfer";

const includes = (source: string, target: string) => {
    return source.toLowerCase().includes(target)
}

export const filterRecipients = (recipients: Recipient[], search: string): Recipient[] => {
    if (search === "") return [];

    recipients = recipients.filter(recipient => {
        const text = search.toLowerCase();
        if (recipient.name.toLowerCase().includes(text)) return true;
        if (recipient.group.name.toLowerCase().includes(text)) return true;
    
        const { name, name2, number, address, postal  } = recipient.account;
        if (number.includes(text)) return true;
    
        const recipientText = `${name} ${name2} ${address} ${postal}`;
        if (recipientText.toLowerCase().includes(text)) return true;

        return false;
    });

    return recipients;
}

export const filterDefinedTransfers = (transfers: definedTransfer[], search: string): definedTransfer[] => {
    if (search === "") return transfers;

    transfers = transfers.filter(defTransfer => {
        const text = search.toLowerCase();
        if (includes(defTransfer.name, text)) return true;

        const { targetAccount, transferInfo } = defTransfer;

        if (includes(targetAccount.name, text)) return true;
        if (includes(transferInfo.title, text)) return true;

        return false;
    });

    return transfers;
}