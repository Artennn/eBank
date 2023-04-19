import { Fragment, useEffect, useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";

import { Currency } from "./Misc";
import { SelectDialog } from "./Dialogs";

import { dateFormat } from "../util/formatter";
import API from "../util/api";

type currencyRate = {
  currency: string;
  code: string;
  mid: number;
};

interface CurrencyExchange {
  effectiveDate: string;
  rates: currencyRate[];
}

const intialCurrencyExchange: CurrencyExchange = {
  effectiveDate: "",
  rates: [],
};

const getCurrencyName = (rate: currencyRate) =>
  `${rate.code} (${rate.currency})`;

const LOCAL_STORAGE_KEY = "selectedCurrencies";

let initialSelected = ["USD", "EUR", "GBP", "CHF", "CAD", "JPY"];

const getSelectedCurrencies = () => {
  const localSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
  return localSelected ? JSON.parse(localSelected) : initialSelected;
};

const CurrencyTable = () => {
  const [currencyExchange, setCurrencyExchange] = useState<CurrencyExchange>(
    intialCurrencyExchange
  );
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    getSelectedCurrencies()
  );
  const [isSelecting, setIsSelecting] = useState(false);

  const fetchExchangeRates = async () => {
    const { status, data } = await API.get(
      "http://api.nbp.pl/api/exchangerates/tables/A/",
      { withCredentials: false }
    );
    if (status !== 200) {
      console.log("Error while fetching currency exchange");
      return;
    }
    //console.log("Fetched Currency Exchange", data[0]);
    const apiResponse = data[0] as CurrencyExchange;
    const effectiveDate = apiResponse.effectiveDate;
    const rates = apiResponse.rates;
    setCurrencyExchange({ effectiveDate, rates });
  };

  const handleSelectCurrency = (currencyCode: string) => {
    const newSelected = selectedCurrencies.includes(currencyCode)
      ? selectedCurrencies.filter((code) => code !== currencyCode)
      : [...selectedCurrencies, currencyCode];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSelected));
    setSelectedCurrencies(newSelected);
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const { effectiveDate, rates } = currencyExchange;
  const displayCurrencies = rates.filter((rate) =>
    selectedCurrencies.includes(rate.code)
  );
  const selectData: [string, string][] = rates.map((rate) => [
    rate.code,
    getCurrencyName(rate),
  ]);

  return (
    <Box sx={{ height: "100%" }}>
      {displayCurrencies.map((rate, key) => (
        <Fragment key={key}>
          <Box display="flex" m={1}>
            <Typography sx={{ m: "auto 0" }}>
              {getCurrencyName(rate)}
            </Typography>
            <Currency value={rate.mid} />
          </Box>

          <Divider />
        </Fragment>
      ))}

      <Box display="flex" mt={3} mb={1}>
        <Button variant="contained" onClick={() => setIsSelecting(true)}>
          Wybierz
        </Button>

        <Typography sx={{ m: "auto", mr: 0 }}>
          Dane z {effectiveDate && dateFormat(effectiveDate)} (NBP)
        </Typography>
      </Box>

      {isSelecting && (
        <SelectDialog
          search
          data={selectData}
          selected={selectedCurrencies}
          onSelect={handleSelectCurrency}
          onClose={() => setIsSelecting(false)}
        />
      )}
    </Box>
  );
};
export default CurrencyTable;
