import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardMedia, Typography, Button, Grid, Box, CardActions,
  Accordion, AccordionSummary, AccordionDetails, Divider, Badge, Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useNavigate } from "react-router-dom";

const FirstAidStore = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://health-backend-client.vercel.app/api/products/firstaid", {
          headers: { "auth-token": localStorage.getItem("token") },
        });
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("https://health-backend-client.vercel.app/api/orders/vieworders", {
          headers: { "auth-token": localStorage.getItem("token") },
        });
        const data = await res.json();
        setOrders(data.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const handleBuyNow = (id) => {
    navigate(`/firstaid-info/${id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <PendingActionsIcon color="warning" sx={{ mr: 1 }} />;
      case "Dispatched":
        return <LocalShippingIcon color="primary" sx={{ mr: 1 }} />;
      case "Delivered":
        return <CheckCircleIcon color="success" sx={{ mr: 1 }} />;
      default:
        return <PendingActionsIcon sx={{ mr: 1 }} />;
    }
  };

  return (
    <Box sx={{ px: 3, py: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Paper elevation={4} sx={{ mb: 5, p: 3, borderRadius: 3, backgroundColor: "#ffffff" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          📦 Your Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {orders.length === 0 ? (
          <Typography color="text.secondary">No orders yet. Let's fix that! 🛍️</Typography>
        ) : (
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 1 }}>
            {orders.map((order) => (
              <Card
                key={order._id}
                sx={{
                  minWidth: 300,
                  flexShrink: 0,
                  backgroundColor: "#f0fff0",
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {getStatusIcon(order.dispatchStatus)} {order.productName}
                </Typography>
                <Typography variant="body2"><strong>Order ID:</strong> {order.razorpayOrderId}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{order.amount}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {order.dispatchStatus}</Typography>
                <Typography variant="body2"><strong>Delivery To:</strong> {order.customerName} ({order.customerPhone})</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {order.customerAddress}
                </Typography>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(to right, #198754, #28a745)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "1.5px",
          mb: 5,
        }}
      >
        Health Essentials at Healthy Prices!
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'contain', backgroundColor: '#f0f0f0' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography>
                  <s>₹{product.originalPrice}</s>{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ₹{product.discountedPrice}
                  </span>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Stock Available: {product.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="medium"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={product.stock === 0}
                  onClick={() => handleBuyNow(product._id)}
                >
                  {product.stock === 0 ? "Out of Stock" : "BUY NOW"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FirstAidStore;
