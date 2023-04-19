import { useAppDispatch } from "../app/hooks";

import { Button, styled, Typography } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { definedTransfer } from "../interfaces/transfer";
import { changePage } from "../reducers/app";
import { setDefined } from "../reducers/transfer";
import { fetchDefinedTransfers } from "../reducers/definedTransfers";

import { accountNumberFormat } from "../util/formatter";

import API from "../util/api";
import { InputDialog } from "./Dialogs";
import { useState } from "react";

const StyledTableCell = styled(TableCell)({
  root: {
    color: "white",
  },
  head: {
    backgroundColor: "black",
    color: "white",
  },
  body: {
    fontSize: 14,
  },
  "&.MuiTableCell-root": {
    color: "white",
  },
});

const StyledTableRow = styled(TableRow)({
  "&.MuiTableCell-root td": {
    borderBottom: "none",
  },
});

const TransferCard = ({
  definedTransfer,
}: {
  definedTransfer: definedTransfer;
}) => {
  const dispatch = useAppDispatch();
  const { name, targetAccount } = definedTransfer;
  const [isDeleting, setIsDeleting] = useState(false);

  const recipientName = `${targetAccount.name} ${targetAccount.name2}`;

  const handleNewTransfer = () => {
    dispatch(setDefined(definedTransfer));
    dispatch(changePage("new-transfer"));
  };

  const handleDelete = async (): Promise<[boolean, string]> => {
    const { status } = await API.post("deleteDefinedTransfer", {
      _id: definedTransfer._id,
    });
    if (status !== 200) {
      console.log(`Status ${status} at delete defined transfer`);
      return [false, "Blad przy usuwaniu"];
    }
    return [true, ""];
  };

  return (
    <StyledTableRow hover sx={{ bgcolor: "background.tableCell" }}>
      <TableCell align="center">{name}</TableCell>
      <TableCell align="center">{recipientName}</TableCell>
      <TableCell align="center">
        {accountNumberFormat(targetAccount.number)}
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          color="success"
          sx={{ mr: 1, mb: 1 }}
          onClick={handleNewTransfer}
        >
          {" "}
          WYKONAJ{" "}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          sx={{ mr: 1, mb: 1 }}
        >
          {" "}
          MODYFIKUJ{" "}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          sx={{ mr: 1, mb: 1 }}
          onClick={() => setIsDeleting(true)}
        >
          {" "}
          USUN{" "}
        </Button>
      </TableCell>

      {isDeleting && (
        <InputDialog
          title="Usun Zdefiniowany Przelew"
          buttons={["Anuluj", "Potwierdz"]}
          action={handleDelete}
          onFinish={() => dispatch(fetchDefinedTransfers())}
          onClose={() => setIsDeleting(false)}
        >
          <Typography>
            Czy napewno chcesz usunac {definedTransfer.name}?
          </Typography>
        </InputDialog>
      )}
    </StyledTableRow>
  );
};

const TransfersTable = ({
  definedTransfers,
}: {
  definedTransfers: definedTransfer[];
}) => {
  return (
    <TableContainer sx={{ borderRadius: 2 }}>
      <Table aria-label="customized table">
        <TableHead sx={{ color: "white" }}>
          <TableRow sx={{ backgroundColor: "primary.main", color: "white" }}>
            <StyledTableCell align="center">Nazwa</StyledTableCell>
            <StyledTableCell align="center">Odbiorca</StyledTableCell>
            <StyledTableCell align="center">Rachunek</StyledTableCell>
            <StyledTableCell align="center">Akcje</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {definedTransfers.map((transfer, key) => (
            <TransferCard definedTransfer={transfer} key={key} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TransfersTable;
