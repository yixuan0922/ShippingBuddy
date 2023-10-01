import * as React from "react";
import { useState } from "react";
import { Box, Button, Container, TextField, CircularProgress } from "@mui/material";

const SearchPage = () => {
  const [inputStr, setInputStr] = useState("Enter Here!");
  const [dataReceived, setDataReceived] = useState("Hi! What can i do for you?");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async () => {
    setLoading(true);

    // console.log(JSON.stringify({ query: inputStr }));
    const rawResponse = await fetch("https://psa-hack.onrender.com/query", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query: inputStr }),
    });
    // console.log(rawResponse);
    const content = await rawResponse.json();
    // console.log(content);
    setDataReceived(content.response);

    setLoading(false);
  };

  return (
    <Container
      sx={{ marginTop: 5, marginBottom: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <Box
        sx={{ backgroundColor: "#ebf2ff", padding: 4, borderRadius: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        {loading ? <CircularProgress color="primary" /> : dataReceived}
      </Box>
      <TextField
        sx={{ marginTop: 5 }}
        fullWidth
        id="outlined-multiline-static"
        label="Your Prompt here"
        value={inputStr}
        onChange={(event) => setInputStr(event.target.value)}
        multiline
        rows={4}
        // defaultValue="Default Value"
      />
      <Button variant="contained" onClick={onSubmitHandler}>
        Ask
      </Button>
    </Container>
  );
};

export default SearchPage;
