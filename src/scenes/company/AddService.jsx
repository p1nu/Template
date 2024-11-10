import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, MenuItem, Select, FormControl, TextField } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const AddService = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [service, setService] = useState({
    service_name: '',
    service_code: '',
    service_status_id: '',
    service_description: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleAddService = async () => {
    try {
      await axios.post('http://localhost:3030/service', service);
      setError('Service added successfully');
      setService({
        service_name: '',
        service_code: '',
        service_status_id: '',
        service_description: '',
      }); // Reset form
    } catch (error) {
      console.error('Error adding service:', error);
      setError('Error adding service');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header title="Add New Service" subTitle="Create a new service" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
        padding={2}
        bgcolor={colors.grey[800]}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          width="50%" 
          boxShadow={3}
        >
          <Typography variant="h4" color={colors.grey[100]} mb={2}>
            Add Service
          </Typography>
          <InputBase
            placeholder="Service Name"
            name="service_name"
            value={service.service_name}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Service Code"
            name="service_code"
            value={service.service_code}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <TextField
            placeholder="Service Description"
            name="service_description"
            value={service.service_description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: '2px',
                padding: '10px',
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: '100%',
              margin: '10px 0',
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <FormControl fullWidth sx={{ margin: '10px 0' }}>
            <Select
              name="service_status_id"
              value={service.service_status_id}
              onChange={handleChange}
              sx={{
                border: `1px solid ${colors.grey[800]}`,
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginTop: '10px',
              }}
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddService}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Service
          </Button>
          {error && (
            <Typography variant="body1" color={error.includes('successfully') ? 'green' : 'red'} mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddService;