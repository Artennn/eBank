import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Box, Button, useMediaQuery } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import TransferInfoCard from "../componenets/TransferInfoCard";
import AccountCard from "../componenets/AccountCard";
import LoadingModal from "../componenets/LoadingModal";
import { Verification } from "../componenets/FeedBack";
import { TextInput } from "../componenets/Inputs";

import { Account, emptyAccount } from "../interfaces/account";
import {
  Transfer,
  TransferInfo,
  emptyTransferInfo,
  definedTransfer,
} from "../interfaces/transfer";

import { updateInfo, updateTarget, clearTransfer } from "../reducers/transfer";
import { validateAccount, validateTransferInfo } from "../util/validator";
import { Wait } from "../util/misc";

import API from "../util/api";

const TransferContainer = ({
  sourceAccount,
  targetAccount,
  transferInfo,
  readOnly,
  onTargetChange,
  onInfoChange,
  reversed,
}: {
  sourceAccount: Account;
  targetAccount: Account;
  transferInfo: TransferInfo;
  readOnly?: boolean;
  onTargetChange?: (newValue: Partial<Account>) => void;
  onInfoChange?: (newValue: Partial<TransferInfo>) => void;
  reversed?: boolean;
}) => {
  const horizontal = useMediaQuery("(min-width: 900px)");
  const arrowRot = horizontal ? "none" : "rotate(90deg)";

  const shouldClose = useMemo(() => {
    return horizontal ? false : true;
  }, [horizontal]);

  return (
    <>
      <Box display={horizontal ? "flex" : "block"} sx={{ mt: 4, mb: 4 }}>
        {!reversed && (
          <>
            <AccountCard
              title="Rachunek Nadawcy"
              account={sourceAccount}
              readOnly
              closed={shouldClose}
            />

            <Box display="flex">
              <ArrowCircleRightIcon
                color="info"
                sx={{ fontSize: 100, margin: "auto", transform: arrowRot }}
              />
            </Box>

            <AccountCard
              title="Rachunek Odbiorcy"
              account={targetAccount}
              readOnly={readOnly}
              onChange={onTargetChange}
            />
          </>
        )}

        {reversed && (
          <>
            <AccountCard
              title="Rachunek Odbiorcy"
              account={targetAccount}
              readOnly={readOnly}
              onChange={onTargetChange}
            />

            <Box display="flex">
              <ArrowCircleRightIcon
                color="success"
                sx={{
                  fontSize: 100,
                  margin: "auto",
                  transform: "rotate(180deg)",
                }}
              />
            </Box>

            <AccountCard
              title="Rachunek Nadawcy"
              account={sourceAccount}
              readOnly
            />
          </>
        )}
      </Box>

      <TransferInfoCard
        transferInfo={transferInfo}
        readOnly={readOnly}
        onChange={onInfoChange}
      />
    </>
  );
};

export type actionStages = "create" | "checking" | "confirm" | "verify";

export const ActionContainer = ({
  isValid,
  onAction,
  onFinish,
  onClear,
}: {
  isValid: boolean;
  onAction?: (action: string, payload?: string) => void;
  onFinish: () => void;
  onClear?: () => void;
}) => {
  const [stage, setStage] = useState<actionStages>("create");

  const handleVerification = (success: boolean) => {
    handleAction("finish");
  };

  const handleAction = async (action: string, payload?: string) => {
    onAction && onAction(action, payload);
    if (action === "setStage") {
      if (payload === "confirm") {
        if (!isValid) return;
        setStage("checking");
        await Wait(2000);
        setStage("confirm");
      } else {
        setStage(payload as actionStages);
      }
    }
    if (action === "clear") onClear && onClear();
    if (action === "finish") {
      setStage("create");
      onFinish();
    }
  };

  return (
    <>
      {(stage === "create" || stage === "checking") && (
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Button
            variant="contained"
            color="info"
            sx={{ margin: 1 }}
            onClick={() => handleAction("clear")}
          >
            WYCZYSC
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ margin: 1 }}
            onClick={() => handleAction("setStage", "confirm")}
            disabled={!isValid}
          >
            DALEJ
          </Button>
        </Box>
      )}

      {stage === "checking" && <LoadingModal />}

      {(stage === "confirm" || stage === "verify") && (
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Button
            variant="contained"
            color="error"
            sx={{ margin: 1 }}
            onClick={() => handleAction("setStage", "create")}
          >
            COFNIJ
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ margin: 1 }}
            onClick={() => handleAction("setStage", "verify")}
          >
            POTWIERDZ
          </Button>
        </Box>
      )}

      {stage === "verify" && (
        <Verification onVerification={handleVerification} />
      )}
    </>
  );
};

export const NewTransfer = () => {
  const dispatch = useAppDispatch();
  const transfer = useAppSelector((state) => state.transfer);
  const currentAccount = useAppSelector((state) => state.currentAccount);

  const sourceAccount =
    currentAccount.id !== "" ? currentAccount : transfer.sourceAccount;
  const { targetAccount, transferInfo } = transfer;

  const [readOnly, setReadOnly] = useState(false);

  const changeTargetAccount = (newValue: Partial<Account>) => {
    dispatch(updateTarget(newValue));
  };

  const changeTransferInfo = (newValue: Partial<TransferInfo>) => {
    dispatch(updateInfo(newValue));
  };

  const handleAction = (action: string, payload?: string) => {
    if (action !== "setStage") return;
    if (payload === "create") return setReadOnly(false);
    setReadOnly(true);
  };

  const handleOnFinish = async () => {
    const newTransfer: Transfer = {
      sourceAccount,
      targetAccount,
      transferInfo,
    };
    const { status } = await API.post("/createOperation", newTransfer);
    if (status !== 200) return;
    dispatch(clearTransfer());
    setReadOnly(false);
  };

  const isValid =
    validateAccount(targetAccount) && validateTransferInfo(transferInfo);

  return (
    <>
      <TransferContainer
        sourceAccount={sourceAccount}
        targetAccount={targetAccount}
        transferInfo={transferInfo}
        readOnly={readOnly}
        onTargetChange={changeTargetAccount}
        onInfoChange={changeTransferInfo}
      />
      <ActionContainer
        isValid={isValid}
        onAction={handleAction}
        onFinish={handleOnFinish}
        onClear={() => dispatch(clearTransfer())}
      />
    </>
  );
};

export const NewDefinedTransfer = () => {
  const sourceAccount = useAppSelector((state) => state.currentAccount);
  const [transferName, setTransferName] = useState("");
  const [targetAccount, setTargetAccount] = useState(emptyAccount);
  const [transferInfo, setTransferInfo] = useState(emptyTransferInfo);

  const [stage, setStage] = useState<actionStages>("create");

  const clearTransfer = () => {
    setTransferName("");
    setTargetAccount(emptyAccount);
    setTransferInfo(emptyTransferInfo);
  };

  const changeTargetAccount = (newValue: Partial<Account>) => {
    setTargetAccount({ ...targetAccount, ...newValue });
  };

  const changeTransferInfo = (newValue: Partial<TransferInfo>) => {
    setTransferInfo({ ...transferInfo, ...newValue });
  };

  const handleOnFinish = async () => {
    const definedTransfer: definedTransfer = {
      name: transferName,
      targetAccount,
      transferInfo,
    };
    const { status } = await API.post("/createDefinedTransfer", {
      definedTransfer,
    });
    if (status !== 200) return;
    setStage("create");
    clearTransfer();
  };

  const isValid =
    transferName.length >= 3 &&
    validateAccount(targetAccount) &&
    validateTransferInfo(transferInfo);

  return (
    <>
      <TextInput
        label="Nazwa Przelewu"
        required
        value={transferName}
        readOnly={stage !== "create"}
        onChange={(_, value) => setTransferName(value)}
      />
      <TransferContainer
        sourceAccount={sourceAccount}
        targetAccount={targetAccount}
        transferInfo={transferInfo}
        readOnly={stage !== "create"}
        onTargetChange={changeTargetAccount}
        onInfoChange={changeTransferInfo}
      />
      <ActionContainer
        isValid={isValid}
        onFinish={handleOnFinish}
        onClear={clearTransfer}
      />
    </>
  );
};
