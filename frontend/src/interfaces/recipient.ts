import { Account } from "./account";

export interface recipientGroup {
    _id?: string,
    name: string,
}

export interface Recipient {
    _id?: string,
    name: string,
    account: Account,
    group: recipientGroup,
    lastModify?: string,
    updatedAt?: Date;
    trusted?: boolean,
    whitelist?: boolean,
}