import { Box, Grid, Typography } from "@mui/material";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";

import Card from "../componenets/Card";

import CurrencyTable from "../componenets/CurrencyTable";
import CreditCard from "../componenets/CreditCard";
import { IncomeChart } from "../componenets/Charts";
import { HistoryTableRecent } from "../componenets/OperationTable";
import { useEffect, useState } from "react";
import { Operation } from "../interfaces/operation";
import API from "../util/api";

const baseDate = new Date("2022-01-15");
const BalanceHistory = [
  1832.25, 12321.23, 4823.23, 7400.23, 12321.23, 8723.23, 7400.23, 12321.23,
  14992.23, 7400.23, 12321.23, 4823.23, 7400.23, 5555.93,
].map((y, k) => ({
  y: y,
  x: new Date(baseDate.valueOf() + (k + 1) * 24 * 60 * 60 * 1000).getTime(),
}));

const DashBoard = () => {
  const balance = "12345678.92";
  const cardNumber = "1234 1234 1234 1234";

  const [recentOperations, setRecentOperations] = useState<Operation[]>();

  const fetchRecentOperations = async () => {
    const { status, data } = await API.post("/operations", { recent: true });
    if (status !== 200) {
      console.log("Error while fetching operations");
      return;
    }
    setRecentOperations(data as Operation[]);
  };

  useEffect(() => {
    fetchRecentOperations();
  }, []);

  return (
    <Box>
      <Grid container rowSpacing={4}>
        <Grid item xs={12} md p={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              height: "100%",
              minHeight: "10rem",
              bgcolor: "success.main",
              opacity: 0.9,
              borderRadius: 4,
              boxShadow: 5,
            }}
          >
            <Box p={2} mb="auto" color="white">
              <Typography variant="h6">Historia Salda</Typography>
            </Box>
            <IncomeChart data={BalanceHistory} />
          </Box>
        </Grid>

        <Grid item xs={12} md="auto" p={1}>
          <CreditCard cardNumber={cardNumber} balance={balance} />
        </Grid>

        <Grid item xs={12} md={7} p={1}>
          <Card
            title="Ostatnie Operacje"
            expandable
            icon={<HistoryIcon fontSize="inherit" />}
          >
            <HistoryTableRecent operations={recentOperations} />
          </Card>
        </Grid>

        <Grid item xs={12} md={5} p={1}>
          <Card
            title="Kursy Walut"
            expandable
            icon={<CurrencyExchangeIcon fontSize="inherit" />}
          >
            <CurrencyTable />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashBoard;
