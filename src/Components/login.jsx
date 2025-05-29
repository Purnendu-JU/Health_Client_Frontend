import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("https://health-backend-client.vercel.app/api/auth/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('user', json.username); // <-- Add this
            navigate('/home');
        }
        else {
            alert("Invalid Credentials");
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, marginTop: 8, marginBottom: 11.8}}>
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                    <Box
                        component="img"
                        src={`${process.env.PUBLIC_URL}/favicon-32x32.png`}
                        alt="PocketCare Logo"
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                        }}
                    >
                        PocketCare
                    </Typography>
                </Box>
                <Typography component="h1" variant="h4" align="center" >
                    Login
                </Typography>
                <Typography align="center">
                    Use your PocketCare Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={onChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={credentials.password}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 2 }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account? <Link to="/signup" variant="body2">Sign Up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
export default Login;