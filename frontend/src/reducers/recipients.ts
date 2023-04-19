import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../util/api";
import { RootState } from "../app/store";

import { Recipient, recipientGroup } from "../interfaces/recipient";

interface RecipientsState {
  recipients: Recipient[];
  groups: recipientGroup[];
}

const initialState: RecipientsState = {
  recipients: [],
  groups: [],
};

export const fetchRecipients = createAsyncThunk(
  "recipients/fetch",
  async () => {
    let { status: groupsStatus, data: groups } = await API.post(
      "/recipientGroups"
    );
    if (groupsStatus !== 200) {
      console.log(`Status ${groupsStatus} at get recipient groups`);
      return false;
    }

    let { status: recipientsTatus, data: recipients } = await API.post(
      "/recipients"
    );
    if (recipientsTatus !== 200) {
      console.log(`Status ${recipientsTatus} at get recipients`);
      return false;
    }

    recipients = recipients.map((recipient: any) => ({
      ...recipient,
      group: groups.find((group: any) => group._id === recipient.group),
    }));

    return { recipients, groups };
  }
);

export const recipientsSlice = createSlice({
  name: "recipients",
  initialState,
  reducers: {
    clearRecipientsState: () => {
      return initialState;
    },
    setRecipients: (
      state: RecipientsState,
      action: PayloadAction<Recipient[]>
    ) => {
      state.recipients = action.payload;
    },
    setGroups: (
      state: RecipientsState,
      action: PayloadAction<recipientGroup[]>
    ) => {
      state.groups = action.payload.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchRecipients.fulfilled,
      (state: RecipientsState, action) => {
        if (action.payload) {
          return action.payload;
        }
      }
    );
  },
});

export const { clearRecipientsState, setRecipients, setGroups } =
  recipientsSlice.actions;

export const currentAccount = (state: RootState) => state.recipients;

export default recipientsSlice.reducer;
