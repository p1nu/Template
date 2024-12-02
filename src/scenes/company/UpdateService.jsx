import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, InputBase, Modal, Typography, useTheme, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = process.env.APP_API_URL;

const UpdateService = () => {
  const { user } = useContext(AuthContext);
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
    service_updated_by_user_id: user?.user_id,
  });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch service data by ID
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/${id}`);
        setService(response.data[0]);
      } catch (error) {
        console.error('Error fetching service data:', error);
        toast.error('Failed to load service data');
      }
    };
    fetchService();
  }, [id]);

  useEffect(() => {
    // Fetch company data
    const fetchCompany = async () => {
      try {
        const response = await axios.get('${API_BASE_URL}/company/all');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast.error('Failed to load company data');
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
      await axios.put(`${API_BASE_URL}/service/update/${id}`, {
        ...service, service_updated_by_user_id: user?.user_id,
      });
      toast.success('Service updated successfully');
      setTimeout(() => {
        navigate('/services');
      }, 3000); // Navigate to services page after 3 seconds
    } catch (error) {
      console.log('Service:', service);
      console.error('Error updating service:', error);
      toast.error('Error updating service');
    }
  };

  const { open, handleClose, value, handleOpen } = useMediaGallery();

  const handleSelectImage = (image) => {
    setService((prevService) => ({ ...prevService, service_logo: image.il_path }));
    toast.success('Logo selected successfully');
  };

  const [isHidden, setIsHidden] = useState(false);

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

          {/* Service Name and Select Company */}
          <Box
            display="flex"
            justifyContent={"space-between"}
            width="100%"
            gap={"20px"}
            alignContent={"center"}
            height="100%"
          >

            {/* Service Name */}
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

            {/* Select Company */}
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

          {/* Service Description */}
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

          {/* Service Value */}
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

          {/* Service Vision */}
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

          {/* Service Mission */}
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

          {/* Service Status ID */}
          
            <Box
              display="flex"
              flexDirection="column"
              margin="10px 0"
              width="100%"
            >
              <InputLabel
                htmlFor="service_status_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Service Status ID
              </InputLabel>
              <FormControl fullWidth>
                <Select
                  name="service_status_id"
                  value={service.service_status_id}
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
                    Select Service Status
                  </MenuItem>
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="2">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          

          {/* Add Logo or Update Logo */}
          <Box>
            <Button
              variant="contained"
              title="Add Logo"
              onClick={handleOpen}
              sx={{
                mt: 2,
                backgroundColor: colors.blueAccent[200],
              }}
            >
              Update Logo
            </Button>
            <Modal open={open} onClose={handleClose}>
              <MediaLibrary onSelectImage={handleSelectImage}/>
            </Modal>
          </Box>

          {/* Updated by user id */}
          {/* {isHidden && (
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
          )} */}

          {/* Update Service Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateService}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Service
          </Button>
        </Box>
      </Box>
      <ToastContainer theme='colored' autoClose={2000} />
    </Box>
  );
};

export default UpdateService;