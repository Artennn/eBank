const bankNames = [
    { prefix: '1010', name:	'Narodowy Bank Polski' },
    { prefix: '1020', name:	'PKO BP' },
    { prefix: '1030', name:	'Bank Handlowy (Citi Handlowy)' },
    { prefix: '1050', name:	'ING Bank Śląski' },
    { prefix: '1090', name:	'Santander Bank Polska' },
    { prefix: '1130', name:	'BGK' },
    { prefix: '1140', name:	'mBank' },
    { prefix: '1160', name:	'Bank Millennium' },
    { prefix: '1240', name:	'Pekao SA' },
    { prefix: '1320', name:	'Bank Pocztowy' },
    { prefix: '1540', name:	'BOŚ Bank' },
    { prefix: '1580', name:	'Mercedes-Benz Bank Polska' },
    { prefix: '1610', name:	'SGB - Bank' },
    { prefix: '1670', name:	'RBS Bank (Polska)' },
    { prefix: '1680', name:	'Plus Bank' },
    { prefix: '1840', name:	'Societe Generale' },
    { prefix: '1870', name:	'Nest Bank' },
    { prefix: '1930', name:	'Bank Polskiej Spółdzielczości' },
    { prefix: '1940', name:	'Credit Agricole Bank Polska' },
    { prefix: '2030', name:	'BNP Paribas' },
    { prefix: '2120', name:	'Santander Consumer Bank' },
    { prefix: '2160', name:	'Toyota Bank' },
    { prefix: '2190', name:	'DNB Bank Polska' },
    { prefix: '2480', name:	'Getin Noble Bank' },
    { prefix: '2490', name:	'Alior Bank' },
    { prefix: '2710', name:	'FCE Bank Polska' },
    { prefix: '2720', name:	'Inbank' },
    { prefix: '2770', name:	'Volkswagen Bank' },
    { prefix: '2800', name:	'HSBC' },
    { prefix: '2910', name:	'Aion Bank' },
];


export const getBankName = (bankNumber: string): string | undefined => {
    if (bankNumber.length < 6) return;
    return bankNames.find(bank => bank.prefix === bankNumber.slice(2, 6))?.name;
}