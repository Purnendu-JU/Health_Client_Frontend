import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const FirstAidInfoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/firstaid-payment/${id}`, { state: { formData } });
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
      component={Paper}
      elevation={6}
    >
      <Typography variant="h5" mb={2} align="center" fontWeight="bold">
        Enter Your Details
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          required
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          margin="normal"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="normal"
          required
          multiline
          minRows={2}
          value={formData.address}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          Proceed to Payment
        </Button>
      </form>
    </Box>
  );
};

export default FirstAidInfoForm;
