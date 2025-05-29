import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Paper,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const drawerWidth = 260;

const NutritionPlanner = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chatId, setChatId] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getChatbotResponse = async (userMessage) => {
    try {
      const response = await fetch("https://healthchatbot-zeta.vercel.app/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
      setInput("");

      const botReply = await getChatbotResponse(userMessage);
      setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);

      try {
        if (!chatId) {
          const res = await fetch("https://health-backend-client.vercel.app/api/prompt/postquery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ query: userMessage, answer: botReply })
          });
          const data = await res.json();
          setChatId(data._id);
        } else {
          await fetch(`https://health-backend-client.vercel.app/api/prompt/updatequery/${chatId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ query: userMessage, answer: botReply })
          });
        }

        fetchHistory();
      } catch (err) {
        console.error("Failed to save or update query:", err);
      }
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("https://health-backend-client.vercel.app/api/prompt/fetchallqueries", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  const loadHistoryChat = (chatMessages, id) => {
    const formatted = chatMessages.flatMap(m => ([
      { text: m.query, sender: "user" },
      { text: m.answer, sender: "bot" }
    ]));
    setMessages(formatted);
    setChatId(id);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: "30px", paddingBottom: "30px" }}>
        <Typography variant="h4" align="center" gutterBottom >
          Personalised Nutrition Planner
        </Typography>

        <Paper
          elevation={3}
          sx={{
            display: "flex",
            borderRadius: "10px",
            overflow: "hidden",
            height: "calc(100vh - 150px)",
            backgroundColor: "white"
          }}
        >
          {/* Left History Panel */}
          <Box
            sx={{
              width: drawerWidth,
              backgroundColor: "#f0f4f8",
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid #cfd8dc"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", padding: 2 }}>
              History
            </Typography>
            <Divider />
            <List sx={{ overflowY: "auto", flexGrow: 1 }}>
              {history.length === 0 ? (
                <Typography sx={{ p: 2 }}>No conversations yet.</Typography>
              ) : (
                history.map((item, index) => (
                  <ListItemButton
                    key={item._id || index}
                    onClick={() => loadHistoryChat(item.messages, item._id)}
                  >
                    <ListItemText
                      primary={item.messages[0]?.query || "No query"}
                      secondary={new Date(item.date).toLocaleString()}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Box>

          {/* Chat and Input Area */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              padding: "20px"
            }}
          >
            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                marginBottom: "10px"
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: "12px"
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "60%",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      backgroundColor: msg.sender === "user" ? "#2196f3" : "#f1f1f1",
                      color: msg.sender === "user" ? "white" : "black",
                      fontSize: "16px",
                      lineHeight: "1.5",
                      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)"
                    }}
                  >
                    {msg.text}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Input Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "8px",
                backgroundColor: "white"
              }}
            >
              <TextField
                multiline
                maxRows={4}
                placeholder="Enter message..."
                variant="standard"
                sx={{ flexGrow: 1, paddingX: "10px" }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default NutritionPlanner;
