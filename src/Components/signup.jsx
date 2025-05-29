import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
const SignUp = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmpassword: "" });
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        if (credentials.name.trim().length < 3) {
            tempErrors.name = "Name should be at least 3 characters long.";
            isValid = false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(credentials.email)) {
            tempErrors.email = "Please enter a valid email address.";
            isValid = false;
        }
        if (credentials.password.length < 6) {
            tempErrors.password = "Password should be at least 6 characters long.";
            isValid = false;
        }
        if (credentials.password !== credentials.confirmpassword) {
            tempErrors.confirmpassword = "Passwords do not match.";
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();        
        if (!validateForm()) return;
        const { name, email, password } = credentials;
        const response = await fetch("https://health-backend-client.vercel.app/api/auth/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            navigate('/home');
        } 
        else {
            setError("Invalid credentials");
        }
    };
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, marginTop: 5 }}>
                <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
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
                <Typography component="h1" variant="h4" align="center">
                    Sign Up
                </Typography>
                <Typography align="center" >
                    Create a PocketCare Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={credentials.name}
                        onChange={onChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={onChange}
                        error={!!errors.email}
                        helperText={errors.email}
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
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmpassword"
                        label="Confirm Password"
                        type="password"
                        value={credentials.confirmpassword}
                        onChange={onChange}
                        error={!!errors.confirmpassword}
                        helperText={errors.confirmpassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center">
                        Already have an account? <Link to="/" variant="body2">Log In</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};
export default SignUp;