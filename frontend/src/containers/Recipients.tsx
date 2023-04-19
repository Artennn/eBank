import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import Card from "../componenets/Card";
import AccountCard from "../componenets/AccountCard";
import {
  ConfirmDialog,
  InputDialog,
  NewRecipientGroup,
} from "../componenets/Dialogs";
import { TextInput } from "../componenets/Inputs";
import RecipientsTable from "../componenets/RecipientsTable";
import { ActionContainer } from "./Transfers";

import { Account, emptyAccount } from "../interfaces/account";
import { Recipient, recipientGroup } from "../interfaces/recipient";

import { changePage } from "../reducers/app";
import { fetchRecipients } from "../reducers/recipients";

import { filterRecipients } from "../util/filter";
import { validateRecipient } from "../util/validator";
import { Wait } from "../util/misc";

import API from "../util/api";
import { dispatchAlert } from "../reducers/alert";

const ChangeNameDialog = ({
  group,
  onClose,
}: {
  group: recipientGroup;
  onClose: () => void;
}) => {
  const [newGroupName, setNewGroupName] = useState(group.name);

  const handleChangeName = async (): Promise<[boolean, string]> => {
    const { status, data } = await API.post("/updateRecipientGroup", {
      ...group,
      name: newGroupName,
    });
    await Wait(1000);
    if (status !== 200) {
      return [false, data?.message || ("Blad serwera" as string)];
    }
    return [true, ""];
  };

  return (
    <InputDialog
      title="Zmien Nazwe"
      buttons={["Anuluj", "Zapisz"]}
      action={handleChangeName}
      onClose={onClose}
    >
      <TextInput
        label="Nowa Nazwa"
        value={newGroupName}
        onChange={(_, value) => setNewGroupName(value)}
      />
    </InputDialog>
  );
};

const Recipients = () => {
  const dispatch = useAppDispatch();
  const { recipients, groups } = useAppSelector((state) => state.recipients);
  const [search, setSearch] = useState("");

  const [addingNewGroup, setAddingNewGroup] = useState(false);
  const [changingGroup, setChaningGroup] = useState<recipientGroup | null>(
    null
  );
  const [deletingGroup, setDeletingGroup] = useState<recipientGroup | null>(
    null
  );

  const searchedRecipients = filterRecipients(recipients, search);

  useEffect(() => {
    dispatch(fetchRecipients());
  }, []);

  const handleChangedGroup = () => {
    setChaningGroup(null);
    dispatch(fetchRecipients());
  };

  const handleDeleteGroup = async (): Promise<[boolean, string]> => {
    if (!deletingGroup) return [false, "Blad przy usuwaniu"];
    const { status, data } = await API.post("/deleteRecipientGroup", {
      _id: deletingGroup._id,
    });
    if (status !== 200) {
      console.log(`Status ${status} at delete recipient group`);
      return [false, data?.message || ("Blad serwera" as string)];
    }
    dispatch(fetchRecipients());
    dispatchAlert(dispatch, {
      type: "success",
      text: `Pomyslnie usunieto grupe kontrahentow`,
    });
    return [true, ""];
  };

  return (
    <>
      <Card title="Szukaj" expandable>
        <Box display="flex">
          <TextInput
            label="Szukaj"
            width="30%"
            value={search}
            onChange={(_, value) => setSearch(value)}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ height: "fit-content", ml: "auto" }}
            onClick={() => setAddingNewGroup(true)}
          >
            NOWA GRUPA
          </Button>
        </Box>
        <>
          {searchedRecipients.length > 0 && (
            <RecipientsTable recipients={searchedRecipients} />
          )}
        </>
      </Card>

      {groups.map((group, key) => (
        <Card title={group.name} expandable closed key={key}>
          <RecipientsTable
            variant="noGroup"
            recipients={recipients.filter(
              (recipient: Recipient) => recipient.group._id === group._id
            )}
          />
          <Box sx={{ mt: 1, textAlign: "right" }}>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: 1 }}
              onClick={() => setDeletingGroup(group)}
            >
              {" "}
              USUN{" "}
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
              onClick={() => setChaningGroup(group)}
            >
              {" "}
              ZMIEN NAZWE{" "}
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ margin: 1 }}
              onClick={() => dispatch(changePage("new-recipient"))}
            >
              {" "}
              DODAJ{" "}
            </Button>
          </Box>
        </Card>
      ))}

      {addingNewGroup && (
        <NewRecipientGroup onClose={() => setAddingNewGroup(false)} />
      )}

      {changingGroup && (
        <ChangeNameDialog group={changingGroup} onClose={handleChangedGroup} />
      )}

      {deletingGroup && (
        <ConfirmDialog
          title="Usun Grupe"
          text={`Czy napewno chcesz usunac ${deletingGroup.name}?`}
          action={handleDeleteGroup}
          onClose={() => setDeletingGroup(null)}
        />
      )}
    </>
  );
};
export default Recipients;

export const NewRecipient = () => {
  const dispatch = useAppDispatch();
  const currentAccount = useAppSelector((state) => state.currentAccount);
  const { groups } = useAppSelector((state) => state.recipients);
  const [readOnly, setReadOnly] = useState(false);

  const [name, setName] = useState("");
  const [account, setAccount] = useState<Account>(emptyAccount);
  const [group, setGroup] = useState<recipientGroup | null>(groups[0]);

  const handleClear = () => {
    setName("");
    setAccount(emptyAccount);
    setGroup(null);
  };

  const [showDialog, setShowDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const handleSelectGroup = (e: SelectChangeEvent) => {
    const selectedGroup = groups.find((group) => group._id === e.target.value);
    selectedGroup && setGroup(selectedGroup);
  };

  const handleOnAction = (action: string, payload?: string) => {
    if (action !== "setStage") return;
    if (payload === "create") return setReadOnly(false);
    setReadOnly(true);
  };

  const handleOnFinish = async () => {
    if (!group) return;
    const newRecipient: Recipient = {
      name,
      group,
      account,
      lastModify: currentAccount.name,
    };
    const { status } = await API.post("/createRecipient", {
      recipient: newRecipient,
    });
    if (status !== 200) return;
    dispatch(fetchRecipients());
    handleClear();
    setReadOnly(false);
  };

  const handleAddGroup = async (): Promise<[boolean, string]> => {
    const { status, data } = await API.post("/createRecipientGroup", {
      name: newGroupName,
    });
    await Wait(1000);
    if (status !== 200) {
      return [false, data.message || ("Blad serwera" as string)];
    }
    dispatch(fetchRecipients());
    dispatchAlert(dispatch, {
      type: "success",
      text: "Pomyslnie dodano nowa grupe",
    });
    return [true, ""];
  };

  useEffect(() => {
    if (newGroupName === "") return;
    const selectedGroup = groups.find((group) => group.name === newGroupName);
    if (selectedGroup) {
      setGroup(selectedGroup);
      setNewGroupName("");
    }
  }, [groups, showDialog]);

  const isValid = group !== null && validateRecipient({ name, group, account });

  return (
    <Box>
      <TextInput
        label="Nazwa"
        value={name}
        autoFocus
        readOnly={readOnly}
        onChange={(_, value) => setName(value)}
      />

      <FormControl fullWidth>
        <InputLabel id="recipient-group-select-label">Grupa</InputLabel>
        <Select
          fullWidth
          label="Grupa"
          labelId="recipient-group-select-label"
          value={group ? group._id : ""}
          readOnly={readOnly}
          onChange={handleSelectGroup}
          sx={{ mb: 2 }}
        >
          {groups.map((group, key) => (
            <MenuItem value={group._id} key={key}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box textAlign="right" marginBottom={2}>
        <Button
          variant="contained"
          disabled={readOnly}
          onClick={() => setShowDialog(true)}
        >
          NOWA GRUPA
        </Button>
      </Box>

      <AccountCard
        title="Nowy Kontrahent"
        account={account}
        readOnly={readOnly}
        onChange={(newValue) => setAccount({ ...account, ...newValue })}
      />

      <ActionContainer
        onFinish={handleOnFinish}
        onClear={handleClear}
        onAction={handleOnAction}
        isValid={isValid}
      />

      {showDialog && (
        <InputDialog
          title="Dodaj Grupe"
          action={handleAddGroup}
          onClose={() => setShowDialog(false)}
        >
          <TextInput
            label="Nazwa"
            value={newGroupName}
            onChange={(_, value) => setNewGroupName(value)}
          />
        </InputDialog>
      )}
    </Box>
  );
};
