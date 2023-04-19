import { useEffect, useState } from "react";

import { Box, Checkbox, Button } from "@mui/material";

import Card from "../componenets/Card";
import OperationTable from "../componenets/OperationTable";

import { Operation } from "../interfaces/operation";
import API from "../util/api";

const History = () => {
  const [operations, setOperations] = useState<Operation[]>();
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    const { status, data } = await API.post("/operations");
    if (status !== 200) {
      console.log("Error while fetching operations");
      return;
    }
    setOperations(data as Operation[]);
  };

  const handleSelectOperation = (_id: string) => {
    if (selectedOperations.includes(_id)) {
      setSelectedOperations(selectedOperations.filter((x) => x !== _id));
      return;
    }
    setSelectedOperations([...selectedOperations, _id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && operations) {
      setSelectedOperations(operations.map((x) => x._id));
      return;
    }
    setSelectedOperations([]);
  };

  const numberOfSelected = selectedOperations.length;

  return (
    <>
      <Card title="Filtry Wyszukiwania" expandable closed>
        <Checkbox />
      </Card>

      <Card title="Zestawienie Operacji">
        <OperationTable
          data={operations || []}
          selected={selectedOperations}
          onSelect={handleSelectOperation}
          onSelectAll={handleSelectAll}
        />
      </Card>

      <Box sx={{ mt: 1, textAlign: "right" }}>
        <Button
          variant="contained"
          color="info"
          sx={{ margin: 1 }}
          disabled={numberOfSelected === 0}
        >
          {numberOfSelected > 1 ? "POTWIERDZENIA" : "POTWIERDZENIE"}
        </Button>

        <Button
          variant="contained"
          color="success"
          sx={{ margin: 1 }}
          disabled={numberOfSelected === 0}
        >
          {numberOfSelected > 1 ? "ZESTAWIENIA" : "ZESTAWIENIE"}
        </Button>
      </Box>
    </>
  );
};
export default History;
