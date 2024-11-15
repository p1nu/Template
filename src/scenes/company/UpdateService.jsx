import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const UpdateService = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [companies, setCompanies] = useState([]);
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
    // Fetch company data
    const fetchCompany = async () => {
      try {
        const response = await axios.get('http://localhost:3030/company/all');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleQuillChange = (field, value) => {
    setService((prevService) => ({ ...prevService, [field]: value }));
  };

  const handleUpdateService = async () => {
    try {
      await axios.put(`http://localhost:3030/service/update/${id}`, service);
      setError('Service updated successfully');
      setTimeout(() => {
        navigate('/services');
      }, 3000); // Navigate to services page after 3 seconds
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
        sx={{
          "& .ql-container.ql-snow": {
            width: "100% !important",
            height: "84% !important",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          width="100%"
          boxShadow={3}
        >
          <Box
            display="flex"
            justifyContent={"space-between"}
            width="100%"
            gap={"20px"}
            alignContent={"center"}
            height="100%"
          >
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="service_name"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Service Name
              </InputLabel>
              <InputBase
                id="service_name"
                placeholder="Service Name"
                name="service_name"
                value={service.service_name}
                onChange={handleChange}
                sx={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="service_company_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Select Company
              </InputLabel>
              <FormControl fullWidth>
                <Select
                  name="service_company_id"
                  value={service.service_company_id}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Company
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="service_desc"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Service Description
            </InputLabel>
            <ReactQuill
              value={service.service_desc}
              onChange={(value) => handleQuillChange("service_desc", value)}
              theme="snow"
              placeholder="Enter service description..."
              style={{
                height: "250px",
                width: "100%",
                margin: "10px 0",
                border: `1px solid #000`,
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="service_value"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Service Value
            </InputLabel>
            <ReactQuill
              value={service.service_value}
              onChange={(value) => handleQuillChange("service_value", value)}
              theme="snow"
              placeholder="Enter service value..."
              style={{
                height: "250px",
                width: "100%",
                margin: "10px 0",
                border: `1px solid #000`,
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="service_vision"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Service Vision
            </InputLabel>
            <ReactQuill
              value={service.service_vision}
              onChange={(value) => handleQuillChange("service_vision", value)}
              theme="snow"
              placeholder="Enter service vision..."
              style={{
                height: "250px",
                width: "100%",
                margin: "10px 0",
                border: `1px solid #000`,
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="service_mission"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Service Mission
            </InputLabel>
            <ReactQuill
              value={service.service_mission}
              onChange={(value) => handleQuillChange("service_mission", value)}
              theme="snow"
              placeholder="Enter service mission..."
              style={{
                height: "250px",
                width: "100%",
                margin: "10px 0",
                border: `1px solid #000`,
              }}
            />
          </Box>
          <InputBase
            placeholder="Updated By User ID"
            name="service_updated_by_user_id"
            value={service.service_updated_by_user_id}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid #000`,
              borderRadius: "2px",
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
            <Typography
              variant="body1"
              color={error.includes("successfully") ? "green" : "red"}
              mt={2}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateService;