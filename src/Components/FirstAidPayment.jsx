import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper, TextField, Divider } from "@mui/material";
import axios from "axios";

const FirstAidPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const { formData } = location.state;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await fetch(`https://health-backend-client.vercel.app/api/products/firstaid/${id}`, {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem('token')
          }
        });
        const data = await res.json();
        setProduct(data.products);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };
    fetchProduct();
  }, [id]);


  const handlePayment = async () => {
    if (!product) return;

    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        const createOrderResponse = await axios.post(
          "https://health-backend-client.vercel.app/api/orders/create-order",
          {
            amount: product.discountedPrice,
            productName: product.name,
            customer: formData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            }
          }
        );

        const { id: razorpayOrderId } = createOrderResponse.data.order;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: product.discountedPrice * 100,
          currency: "INR",
          name: "PocketCare First Aid Store",
          description: `Payment for ${product.name}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              await axios.post("https://health-backend-client.vercel.app/api/orders/payment-success", {
            razorpayOrderId,
            paymentDetails: {
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
            productName: product.name,
            amount: product.discountedPrice,
            customer: formData,
          }, {
            headers: {
              "auth-token": localStorage.getItem("token")
            }
          });
            const stockResponse = await axios.put(
          `https://health-backend-client.vercel.app/api/products/purchase/${id}`,
          {},
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        alert("Payment successful and order placed!");
        navigate("/home");
      } 
      catch (err) {
        console.error("Error after payment:", err);
        alert("Payment succeeded, but order finalization failed. Please contact support.");
      }
    },
      theme: { color: "#198754" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    script.onerror = () => {
      alert("Failed to load Razorpay SDK.");
    };

      document.body.appendChild(script);
    } 
    catch (error) {
      console.error(error);
      alert("Payment initiation failed.");
    }
  };

  if (!formData) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Invalid access. Please start from the product page.</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6">Loading product details...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
      component={Paper}
      elevation={6}
    >
      <Typography variant="h5" mb={2} align="center" fontWeight="bold">
        Confirm and Pay
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField label="Name" fullWidth margin="normal" value={formData.name} InputProps={{ readOnly: true }} />
      <TextField label="Email" fullWidth margin="normal" value={formData.email} InputProps={{ readOnly: true }} />
      <TextField label="Phone" fullWidth margin="normal" value={formData.phone} InputProps={{ readOnly: true }} />
      <TextField label="Address" fullWidth margin="normal" multiline minRows={2} value={formData.address} InputProps={{ readOnly: true }} />

      <Typography
        variant="h6"
        mt={3}
        mb={2}
        color="primary"
        textAlign="center"
        fontWeight="medium"
      >
        Amount to Pay: ₹{product.discountedPrice}
      </Typography>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handlePayment}
        size="large"
      >
        Pay ₹{product.discountedPrice} Now
      </Button>
    </Box>
  );
};

export default FirstAidPayment;
