export const Wait = (ms: number) => {
    return new Promise(r => setTimeout(r, ms));
}

