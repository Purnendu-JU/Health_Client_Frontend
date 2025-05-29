import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Paper
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Counselling = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getChatbotResponse = async (userMessage) => {
    try {
      const response = await fetch("https://healthchatbot-zeta.vercel.app/counseling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      return "Sorry, there was an error contacting the chatbot.";
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setInput("");

      const botReply = await getChatbotResponse(userMessage);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Personalized Counselling
      </Typography>

      <Paper
        elevation={3}
        sx={{
          height: "60vh",
          overflowY: "auto",
          p: 2,
          borderRadius: 3,
          background: "#fafafa",
          mb: 2
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                color: msg.sender === "user" ? "white" : "black",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Paper>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 3,
          p: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask your questions here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          multiline
          maxRows={3}
          variant="standard"
          sx={{ flex: 1 }}
        />

        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Counselling;
