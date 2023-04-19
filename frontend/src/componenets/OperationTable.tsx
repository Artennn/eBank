import { useState } from 'react';

import { Checkbox, styled } from '@mui/material';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';

import { Currency } from './Misc';

import { Operation } from '../interfaces/operation';
import { dateFormat } from '../util/formatter';

const StyledTableCell = styled(TableCell)({
    root: {
        color: 'white',
    },
    head: {
        backgroundColor: 'black',
        color: 'white',
    },
    body: {
        fontSize: 14,
    },
    '&.MuiTableCell-root': {
        color: 'white',
    }
});

const StyledTableRow = styled(TableRow)({
    '&.MuiTableCell-root td': {
        borderBottom: 'none',
    }
});

const HistoryTable = ({ 
    data,
    selected,
    onSelect,
    onSelectAll,
}: {
    data: Operation[],
    selected: string[],
    onSelect: (_id: string) => void,
    onSelectAll: (checked: boolean) => void,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const displayStart = page * rowsPerPage;
    const displayEnd = page * rowsPerPage + rowsPerPage;
    const emptyRows = displayEnd - data.length;

    // after changing the range we may end up on a page that doesnt exist
    if (displayStart >= data.length && page > 0) {
        setPage(page - 1); 
    }

    const displayData = data.slice(displayStart, displayEnd);

    return (
        <>
            <TableContainer sx={{ borderRadius: 2 }}>
                <Table aria-label="customized table">
                    <TableHead sx={{ color: 'white' }}>
                        <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
                            <StyledTableCell padding="checkbox">
                                <Checkbox color="default" onChange={(e) => onSelectAll(e.target.checked)} />
                            </StyledTableCell>
                            <StyledTableCell>Kontrahent</StyledTableCell>
                            <StyledTableCell>Tytul</StyledTableCell>
                            <StyledTableCell align="center">Kwota</StyledTableCell>
                            <StyledTableCell align="center">Saldo</StyledTableCell>
                            <StyledTableCell align="center">Data</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {displayData.map((operation, key) => (
                            <StyledTableRow 
                                key={key} 
                                hover 
                                selected={selected.includes(operation._id)}
                                sx={{ bgcolor: 'background.tableCell' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selected.includes(operation._id)} onChange={() => onSelect(operation._id)} />
                                </TableCell>
                                <TableCell> {operation.recipient} </TableCell>
                                <TableCell> {operation.title} </TableCell>
                                <TableCell align="center"> <Currency value={operation.amount} outgoing={operation.outgoing} /> </TableCell>
                                <TableCell align="center"> <Currency value={operation.balanceAfter} /> </TableCell>
                                <TableCell align="center"> {dateFormat(operation.date)} </TableCell>
                            </StyledTableRow>
                        ))}

                        {emptyRows > 0 && page !== 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                sx={{ minHeight: 50 }}
                rowsPerPageOptions={ [5, 10, 25, 50, 100, { label: 'Wszystkie', value: -1 }] }
                labelRowsPerPage="Wiersze na strone:"
                labelDisplayedRows={({ from, to, count, page }) => `<${from},${to}> z ${count}`}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}
export default HistoryTable;

export const HistoryTableRecent = ({
    operations,
} : {
    operations?: Operation[],
}) => {
    return (
        <TableContainer sx={{ borderRadius: 2 }}>
            <Table aria-label="customized table">
                <TableHead sx={{ color: 'white' }}>
                    <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <StyledTableCell>Kontrahent</StyledTableCell>
                        <StyledTableCell align="center">Kwota</StyledTableCell>
                        <StyledTableCell align="center">Data</StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {operations?.map((operation, key) => (
                        <StyledTableRow 
                            key={key} 
                            hover
                            sx={{ bgcolor: 'background.tableCell' }}
                        >
                            <TableCell> {operation.recipient} </TableCell>
                            <TableCell align="center"> <Currency value={operation.amount} outgoing={operation.outgoing} /> </TableCell>
                            <TableCell align="center"> {dateFormat(operation.date)} </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}