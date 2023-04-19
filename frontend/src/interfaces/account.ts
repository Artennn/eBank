export interface Account {
    id?: string;
    number: string;
    name: string;
    name2: string;
    address: string;
    postal: string;
}

export const emptyAccount: Account = {
    number: '',
    name: '',
    name2: '',
    address: '',
    postal: '',
};