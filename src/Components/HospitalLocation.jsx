import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import EmergencyIcon from '@mui/icons-material/Emergency';
import CloseIcon from '@mui/icons-material/Close';

export default function ContactPage() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
          fetchNearestHospitals(latitude, longitude);
        },
        (error) => {
          alert('Unable to retrieve your location. Please enable GPS and try again.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    if (data.display_name) {
      setLocation(data.display_name);
    } else {
      setLocation('Location not found');
    }
  };

  const fetchNearestHospitals = async (latitude, longitude) => {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=hospital](around:5000,${latitude},${longitude});out;`
    );
    const data = await response.json();

    if (data.elements.length > 0) {
      const nearestHospitals = data.elements.map((hospital) => ({
      name: hospital.tags.name || 'Unknown Hospital',
      address: hospital.tags['addr:full'] || 'Address not available',
      contact: hospital.tags.phone || 'Not available',
      email: hospital.tags.email || 'Not available',
      website: hospital.tags.website || 'Not available',
      district: hospital.tags['addr:district'] || 'Not available',
      postcode: hospital.tags['addr:postcode'] || 'Not available',
      state: hospital.tags['addr:state'] || 'Not available',
    }));

      setHospitals(nearestHospitals);
    } else {
      setHospitals([]);
      alert('No hospitals found nearby.');
    }
  };

  const handleOpenDialog = (hospital) => {
    setSelectedHospital(hospital);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        align="center"
        color="success.main"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LocalHospitalRoundedIcon sx={{ mr: 1 }} /> Nearest Hospitals Information
      </Typography>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={getLocation}
          startIcon={<LocationOnIcon />}
        >
          Get Current Location & Nearest Hospitals
        </Button>
      </Box>

      {location && (
        <Box mt={4} textAlign="center">
          <Typography
            variant="h6"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'error.main' }}
          >
            <LocationOnIcon sx={{ mr: 1 }} /> Your Current Location:
          </Typography>
          <Typography color="text.secondary" mt={1}>
            {location}
          </Typography>
        </Box>
      )}

      {hospitals.length > 0 && (
        <Box mt={4}>
          <Grid container spacing={3}>
            {hospitals.map((hospital, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={5} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Address:</strong> {hospital.address}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleOpenDialog(hospital)}
                    >
                      Contact Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {hospitals.length === 0 && location && (
        <Box textAlign="center" mt={5}>
          <Typography
            variant="h6"
            color="error.main"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}
          >
            <EmergencyIcon sx={{ mr: 1 }} /> No Hospitals Found Nearby
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="large"
            href="tel:108"
          >
            Call Emergency Help (108)
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedHospital?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>Address:</strong> {selectedHospital?.address}
          </Typography>
          <Typography gutterBottom>
            <strong>Phone:</strong> {selectedHospital?.contact}
          </Typography>
          <Typography gutterBottom>
            <strong>Email:</strong> {selectedHospital?.email}
          </Typography>
          <Typography gutterBottom>
            <strong>Website:</strong> {selectedHospital?.website}
          </Typography>
          <Typography gutterBottom>
            <strong>District:</strong> {selectedHospital?.district}
          </Typography>
          <Typography gutterBottom>
            <strong>Postcode:</strong> {selectedHospital?.postcode}
          </Typography>
          <Typography gutterBottom>
            <strong>State:</strong> {selectedHospital?.state}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="success" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
