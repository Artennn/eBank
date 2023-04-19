export interface Operation {
    _id: string,
    recipient: string,
    title: string,
    amount: string,
    date: Date,
    outgoing: boolean,
    balanceAfter: string,
}