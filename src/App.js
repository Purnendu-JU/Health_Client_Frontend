import "./App.css";
import { Container } from "@mui/material";
import MiniDrawer from "./Components/SideNav";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Home from "./Components/Home";
import HospitalLocation from "./Components/HospitalLocation";
import FeedBack from './Components/Contact'
import FirstAidStore from "./Components/FirstAidStore";
import Counselling from "./Components/Counselling";
import NutritionPlanner from "./Components/NutritionPlanner";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Login from './Components/login';
import Signup from './Components/signup';
import PrivateRoute from './PrivateRoute';
import FirstAidInfoForm from "./Components/FirstAidInfoForm";
import FirstAidPayment from "./Components/FirstAidPayment";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container>{children}</Container>
      </Box>
    </Box>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Container><Login /></Container>} />
      <Route path="/signup" element={<Container><Signup /></Container>} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Layout><Home /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/nutrition-planner"
        element={
          <PrivateRoute>
            <Layout><NutritionPlanner /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/counselling"
        element={
          <PrivateRoute>
            <Layout><Counselling /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/hospital-location"
        element={
          <PrivateRoute>
            <Layout><HospitalLocation /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/first-aid-store"
        element={
          <PrivateRoute>
            <Layout><FirstAidStore /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <PrivateRoute>
            <Layout><FeedBack /></Layout>
          </PrivateRoute>
        }
      />
      <Route path="/firstaid-info/:id" element={
          <PrivateRoute>
            <FirstAidInfoForm />
          </PrivateRoute>
        } />
        <Route path="/firstaid-payment/:id" element={
          <PrivateRoute>
            <FirstAidPayment />
          </PrivateRoute>
        } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
