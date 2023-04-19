import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import API from "../util/api";
import { definedTransfer } from "../interfaces/transfer";

const initialState: definedTransfer[] = [];

export const fetchDefinedTransfers = createAsyncThunk(
  "definedTransfers/fetch",
  async () => {
    const { status, data } = await API.post("/definedTransfers");
    if (status !== 200) {
      console.log(`Status ${status} at get defined transfers`);
      return false;
    }
    return data as definedTransfer[];
  }
);

export const definedTransfersSlice = createSlice({
  name: "definedTransfers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchDefinedTransfers.fulfilled,
      (state: definedTransfer[], action) => {
        if (action.payload) {
          return action.payload;
        }
      }
    );
  },
});

export const definedTransfers = (state: RootState) => state.definedTransfers;

export default definedTransfersSlice.reducer;
