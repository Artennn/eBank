import { useState } from "react";
import { useAppDispatch } from "../app/hooks";

import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import { PasswordInput, TextInput } from "../componenets/Inputs";
import Card from "../componenets/Card";
import LoadingModal from "../componenets/LoadingModal";

import backgroundPicture from "../i/login_background.jpg";

import { login } from "../reducers/user";
import { setCurrentAccount } from "../reducers/currentAccount";

import API from "../util/api";
import { Wait } from "../util/misc";

const background = {
  background: `
        linear-gradient(195deg, rgba(66, 66, 74, 0.6), 
        rgba(25, 25, 25, 0.6)), 
        url("${backgroundPicture}") 
        transparent
    `,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const getError = (status: number) => {
  if (status === 0 || status === 404) return "Błąd przy łączeniu z serwerem";
  if (status === 400) return "Niepoprawne dane";
  return "Wystąpił błąd";
};

const Login = () => {
  const dispatch = useAppDispatch();
  const isPhone = useMediaQuery("(max-width: 425px)");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginInfo, setLoginInfo] = useState({
    login: "react",
    password: "react",
  });

  const handleChange = (name: string, newValue: string) => {
    setLoginInfo({ ...loginInfo, [name]: newValue });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { status, data } = await API.post("/login", loginInfo);
    await Wait(1500);
    setLoading(false);
    if (status !== 200) {
      setError(getError(status));
      return;
    }
    const { account, ...user } = data;
    dispatch(login(user));
    dispatch(setCurrentAccount(account));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        ...background,
      }}
    >
      <Card
        title="Logowanie"
        sx={{ margin: "auto", mb: "auto", width: "min(25rem, 95%)" }}
      >
        <Box p={isPhone ? 0.5 : 3}>
          <TextInput
            label="Identyfikator"
            name="login"
            placeholder=""
            value={loginInfo.login}
            onChange={handleChange}
          />

          <PasswordInput
            label="Haslo"
            name="password"
            placeholder=""
            value={loginInfo.password}
            onChange={handleChange}
          />

          {error && (
            <Typography textAlign="center" color="error">
              {" "}
              {error}{" "}
            </Typography>
          )}

          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="success" onClick={handleLogin}>
              ZALOGUJ
            </Button>
          </Box>
        </Box>
      </Card>
      {loading && <LoadingModal />}
    </Box>
  );
};
export default Login;
