import React, { useEffect, useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Grid, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({
    phone: '',
    subject: '',
    message: ''
  });
  let navigate = useNavigate();

  const fetchUser = async () => {
    const response = await fetch("https://health-backend-client.vercel.app/api/auth/getuser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
    });
    const json = await response.json();
    setUserData({
        name: json.name,
        email: json.email
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      name: userData.name,
      email: userData.email
    };
    if (!payload.phone.trim()) {
        delete payload.phone;
    }
    const response = await fetch("https://health-backend-client.vercel.app/api/review/contact", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(payload)
    });
    const json = await response.json();
    if(json.success){
        alert("Message sent successfully!");
        navigate('/home');
    }
    else{
        alert("Server error!! Try again after some time!!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ml: 19, mb: 5}}>
          Contact Us
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Phone (optional)"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                name="subject"
                fullWidth
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                name="message"
                fullWidth
                multiline
                minRows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactForm;
