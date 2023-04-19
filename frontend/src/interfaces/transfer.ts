import { Account, emptyAccount } from "./account";

export interface Transfer {
    _id?: number,
    sourceAccount: Account,
    targetAccount: Account,
    transferInfo: TransferInfo,
}

export interface TransferInfo {
    title: string,
    amount: string,
    date: Date,
    type: '0' | '1',
}

export interface definedTransfer {
    _id?: string,
    name: string,
    targetAccount: Account,
    transferInfo: TransferInfo,
}

export const emptyTransferInfo: TransferInfo = {
    title: '',
    amount: '',
    date: new Date(),
    type: '0',
}

export const emptyTransfer: Transfer = {
    sourceAccount: emptyAccount,
    targetAccount: emptyAccount,
    transferInfo: emptyTransferInfo,
};

export const emptyDefinedTransfer: definedTransfer = {
    name: "",
    targetAccount: emptyAccount,
    transferInfo: emptyTransferInfo,
}