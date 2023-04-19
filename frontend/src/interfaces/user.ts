export interface User {
    _id: string,
    login: string,
    email: string,
    image?: string,
}

export const emptyUser: User = {
    _id: "",
    login: "",
    email: "",
}