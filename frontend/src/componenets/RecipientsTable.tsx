import { useAppDispatch } from "../app/hooks";

import {
  Button,
  IconButton as MuiIconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Recipient } from "../interfaces/recipient";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import { setRecipient } from "../reducers/transfer";
import { changePage } from "../reducers/app";
import { fetchRecipients } from "../reducers/recipients";

import { accountNumberFormat } from "../util/formatter";

import API from "../util/api";
import { InputDialog } from "./Dialogs";
import { useState } from "react";

type tableVariant = "detailed" | "noGroup" | "select";

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

const IconButton = ({
  icon,
  tooltip,
  tooltipPos = "top",
}: {
  icon: JSX.Element;
  tooltip: string;
  tooltipPos?: "top" | "right" | "bottom" | "left";
}) => {
  return (
    <Tooltip title={tooltip} placement={tooltipPos} arrow>
      <MuiIconButton>{icon}</MuiIconButton>
    </Tooltip>
  );
};

const RecipientCard = ({
  recipient,
  variant,
  onSelect = () => {},
}: {
  recipient: Recipient;
  variant?: tableVariant;
  onSelect?: (recipient: Recipient) => void;
}) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const { account, group } = recipient;
  const accountName = `${account.name} ${account.name2 || ""} ${
    account.address || ""
  } ${account.postal || ""}`;

  const handleTransfer = () => {
    dispatch(setRecipient(recipient));
    dispatch(changePage("new-transfer"));
  };

  const handleDelete = async (): Promise<[boolean, string]> => {
    const { status } = await API.post("/deleteRecipient", {
      _id: recipient._id,
    });
    if (status !== 200) {
      console.log(`Status ${status} at delete recipient`);
      return [false, "Blad przy usuwaniu"];
    }
    return [true, ""];
  };

  return (
    <StyledTableRow hover sx={{ bgcolor: "background.tableCell" }}>
      {(variant === "detailed" || variant === "noGroup") && (
        <>
          <TableCell sx={{ pb: 1 }}>
            <Typography component="div" variant="subtitle2">
              {recipient.name}
            </Typography>
            <Typography component="div" variant="caption" noWrap>
              {account.number}
            </Typography>
            <Typography component="div" variant="caption">
              {accountName}
            </Typography>

            <Button
              variant="contained"
              size="small"
              color="success"
              sx={{ mr: 1, mb: 1 }}
              onClick={handleTransfer}
            >
              PRZELEW
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{ mr: 1, mb: 1 }}
            >
              MODYFIKUJ
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => setIsDeleting(true)}
            >
              USUN
            </Button>
          </TableCell>

          {variant !== "noGroup" && (
            <TableCell align="center">{group.name}</TableCell>
          )}

          <TableCell align="center">{`${recipient.lastModify} ${
            recipient.updatedAt
              ? new Date(recipient.updatedAt).toLocaleDateString()
              : ""
          }`}</TableCell>
          <TableCell align="center">
            {recipient.trusted ? <CheckIcon /> : <CloseIcon />}
          </TableCell>

          <TableCell align="center">
            <IconButton tooltip="Sprawdz" icon={<QuestionMarkIcon />} />
          </TableCell>
        </>
      )}

      {variant === "select" && (
        <>
          <TableCell sx={{ pb: 1 }}>
            <Typography component="div" variant="subtitle2">
              {recipient.name}
            </Typography>
            <Typography component="div" variant="caption">
              {accountName}
            </Typography>
          </TableCell>

          <TableCell align="center">
            {accountNumberFormat(account.number)}
          </TableCell>

          <TableCell align="center">
            <Button
              variant="contained"
              color="success"
              onClick={() => onSelect(recipient)}
            >
              WYBIERZ
            </Button>
          </TableCell>
        </>
      )}

      {isDeleting && (
        <InputDialog
          title="Usun Kontrahenta"
          buttons={["Anuluj", "Potwierdz"]}
          action={handleDelete}
          onFinish={() => dispatch(fetchRecipients())}
          onClose={() => setIsDeleting(false)}
        >
          <Typography>Czy napewno chcesz usunac {recipient.name}?</Typography>
        </InputDialog>
      )}
    </StyledTableRow>
  );
};

const RecipientsTable = ({
  recipients,
  variant = "detailed",
  onSelect,
}: {
  recipients: Recipient[];
  variant?: tableVariant;
  onSelect?: (recipient: Recipient) => void;
}) => {
  return (
    <TableContainer sx={{ borderRadius: 2 }}>
      <Table aria-label="customized table">
        <TableHead sx={{ color: "white" }}>
          <TableRow sx={{ backgroundColor: "primary.main", color: "white" }}>
            <StyledTableCell>Nazwa Kontrahenta</StyledTableCell>

            {(variant === "detailed" || variant === "noGroup") && (
              <>
                {variant !== "noGroup" && (
                  <StyledTableCell align="center">Grupa</StyledTableCell>
                )}
                <StyledTableCell align="center">
                  Ostatnia Modyfikacja
                </StyledTableCell>
                <StyledTableCell align="center">Zaufany</StyledTableCell>
                <StyledTableCell align="center">
                  Biala Lista VAT
                </StyledTableCell>
              </>
            )}

            {variant === "select" && (
              <>
                <StyledTableCell align="center">Numer Rachunku</StyledTableCell>
                <StyledTableCell align="center">Akcje</StyledTableCell>
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {recipients.map((recipient, key) => (
            <RecipientCard
              key={key}
              variant={variant}
              recipient={recipient}
              onSelect={onSelect}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default RecipientsTable;
