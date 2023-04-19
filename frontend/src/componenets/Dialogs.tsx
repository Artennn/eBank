import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { TextInput } from "./Inputs";
import { Saving, SavingStage } from "./FeedBack";

import { Wait } from "../util/misc";
import { useAppDispatch } from "../app/hooks";
import { dispatchAlert } from "../reducers/alert";
import API from "../util/api";
import { fetchRecipients } from "../reducers/recipients";

export const NewRecipientGroup = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState("");
  const [saving, setSaving] = useState<SavingStage>(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setSaving("saving");
    const { status, data } = await API.post("/createRecipientGroup", {
      name: groupName,
    });
    await Wait(1000);
    if (status !== 200) {
      console.log(data.message);
      setError(data.message || "Bląd serwera");
      setSaving("error");
      return;
    }
    setSaving("success");
    dispatch(fetchRecipients());
    dispatchAlert(dispatch, {
      type: "success",
      text: `Pomyslnie dodano grupe kontrahentow`,
    });
    await Wait(2500);
    setSaving(null);
    onClose();
  };

  const handleClose = () => {
    saving === "error" && setSaving(null);
    saving === null && onClose();
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      {!saving && (
        <>
          <DialogTitle>Dodaj Grupe Kontrahentow</DialogTitle>

          <DialogContent>
            <TextInput
              label="Nazwa Grupy"
              value={groupName}
              onChange={(_, value) => setGroupName(value)}
              error={
                groupName.length < 3 && groupName !== ""
                  ? "Minimum 3 znaki"
                  : false
              }
              fullWidth
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions sx={{ pt: 0, pr: 2 }}>
            <Button variant="contained" color="error" onClick={handleClose}>
              ANULUJ
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleAdd}
              disabled={!(groupName.length >= 3)}
            >
              DODAJ
            </Button>
          </DialogActions>
        </>
      )}

      {saving && (
        <DialogContent>
          <Saving stage={saving} onClose={handleClose} />
          {saving === "error" && error}
        </DialogContent>
      )}
    </Dialog>
  );
};

export const InputDialog = ({
  title,
  buttons,
  children,
  action,
  onFinish,
  onClose,
}: {
  title: string;
  buttons?: string[];
  children: JSX.Element | JSX.Element[];
  action: () => Promise<[boolean, string]>;
  onFinish?: () => void;
  onClose: () => void;
}) => {
  const [saving, setSaving] = useState<SavingStage>(null);
  const [error, setError] = useState("");

  const handleAction = async () => {
    setSaving("saving");
    const [success, message] = await action();
    await Wait(1000);
    if (!success) {
      console.log(message);
      setError(message || "Blad serwera");
      setSaving("error");
      return;
    }
    setSaving("success");
    await Wait(2500);
    setSaving(null);
    onClose();
    onFinish && onFinish();
  };

  const handleClose = () => {
    saving === "error" && setSaving(null);
    saving === null && onClose();
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      {!saving && (
        <>
          <DialogTitle>{title}</DialogTitle>

          <Box sx={{ p: 3, pt: 1 }}>{children}</Box>

          <DialogActions sx={{ pt: 0, pr: 2 }}>
            <Button variant="contained" color="error" onClick={handleClose}>
              {buttons ? buttons[0] : "Anuluj"}
            </Button>

            <Button variant="contained" color="success" onClick={handleAction}>
              {buttons ? buttons[1] : "Dodaj"}
            </Button>
          </DialogActions>
        </>
      )}

      {saving && (
        <DialogContent sx={{ textAlign: "center" }}>
          <Saving stage={saving} onClose={handleClose} />
          {saving === "error" && error}
        </DialogContent>
      )}
    </Dialog>
  );
};

export const ConfirmDialog = ({
  title,
  text,
  action,
  onClose,
}: {
  title: string;
  text: string;
  action: () => Promise<[boolean, string]>;
  onClose: () => void;
}) => {
  return (
    <InputDialog
      title={title}
      buttons={["Anuluj", "Potwierdz"]}
      action={action}
      onClose={onClose}
    >
      <Typography>{text}</Typography>
    </InputDialog>
  );
};

export const SelectDialog = ({
  search,
  data,
  selected,
  onSelect,
  onClose,
}: {
  search?: boolean;
  data: [string, string][];
  selected: string[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) => {
  return (
    <Dialog onClose={onClose} open={true}>
      <Box display="flex" p={3}>
        <Typography variant="h6" sx={{ m: "auto auto auto 0" }}>
          Wybierz Kursy...
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ overflow: "auto" }}>
        {data.map((option, key) => (
          <ListItem key={key}>
            <ListItemButton onClick={() => onSelect(option[0])}>
              <ListItemIcon>
                <Checkbox checked={selected.includes(option[0])} />
              </ListItemIcon>
              <ListItemText primary={option[1]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
