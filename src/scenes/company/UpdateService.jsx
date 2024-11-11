import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, MenuItem, Select, FormControl, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const UpdateService = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [service, setService] = useState({
    service_name: '',
    service_desc: '',
    service_value: '',
    service_vision: '',
    service_mission: '',
    service_company_id: '',
    service_status_id: '',
    service_updated_by_user_id: '',
  });
  const [user, setUser] = useState({
    user_name: '',
  });
  const [company, setCompany] = useState({
    company_name: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch service data by ID
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/service/${id}`);
        setService(response.data[0]);
      } catch (error) {
        console.error('Error fetching service data:', error);
      }
    };
    fetchService();
  }, [id]);

  useEffect(() => {
    // Fetch user data by ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/user/${service.service_created_by_user_id}`);
        setUser(response.data[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch company data by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/company/${service.service_company_id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    if (service.service_created_by_user_id) {
      fetchUser();
    }
    if (service.service_company_id) {
      fetchCompany();
    }
  }, [service.service_created_by_user_id, service.service_company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleUpdateService = async () => {
    try {
      await axios.put(`http://localhost:3030/service/update/${id}`, service);
      setError('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Error updating service');
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
      <Header title="Update Service" subTitle={`Update details for ${service.service_name}`} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
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
            Update Service
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
          <TextField
            placeholder="Service Value"
            name="service_value"
            value={service.service_value}
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
          <TextField
            placeholder="Service Vision"
            name="service_vision"
            value={service.service_vision}
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
          <TextField
            placeholder="Service Mission"
            name="service_mission"
            value={service.service_mission}
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
          <TextField
            placeholder="Service Description"
            name="service_desc"
            value={service.service_desc}
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
          <InputBase
            placeholder="Company Name"
            name="service_company_id"
            value={company.company_name}
            onChange={handleChange}
            disabled
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
          <InputBase
            placeholder="Created By User ID"
            name="service_created_by_user_id"
            disabled
            value={user.user_name}
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
            placeholder="Updated By User ID"
            name="service_updated_by_user_id"
            value={service.service_updated_by_user_id}
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
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateService}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Service
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

export default UpdateService;