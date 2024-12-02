import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputBase,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { MediaLibrary } from "../gallery/Index";
import { AuthContext } from "../global/AuthContext";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = process.env.APP_API_URL;

const AddServiceByCompany = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState({
    service_name: "",
    service_desc: "",
    service_value: "",
    service_vision: "",
    service_mission: "",
    service_logo: "",
    service_company_id: id,
    service_status_id: 1,
    service_created_by_user_id: user?.user_id,
  });
  const [company, setCompany] = useState({
    company_name: "",
  });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch company details
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/${id}`);
        setCompany(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error);
        toast.error("Error fetching company details");
      }
    };

    // Fetch all companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Error fetching companies");
      }
    };

    fetchCompany();
    fetchCompanies();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleQuillChange = (field, value) => {
    setService((prevService) => ({ ...prevService, [field]: value }));
  };

  useEffect(() => {
    // Fetch company by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error("Error fetching data from database:", error);
        toast.error("Failed to fetch company");
      }
    };
    fetchCompany();
  }, [id]);

  const handleAddService = async () => {
    try {
      await axios.post(`${API_BASE_URL}/service/new`, service);
      toast.success("Service added successfully");
      setService({
        service_name: "",
        service_desc: "",
        service_value: "",
        service_vision: "",
        service_mission: "",
        service_logo: "",
        service_company_id: id,
        service_status_id: 1,
        service_created_by_user_id: user?.user_id,
      });
      setTimeout(() => {
        navigate("/services");
      }, 3000);
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Error adding service");
    }
  };

  const { open, handleClose, value, handleOpen } = useMediaGallery();

  const handleSelectImage = (imagePath) => {
    setCompany((prevService) => ({ ...prevService, service_logo: imagePath }));
    toast.success('Logo selected successfully');
  };

  const [isHidden, setIsHidden] = useState(false);

  return (
    <Box m={2}>
      <Header title="Add New Service" subTitle="Create a new service" />
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
            height: "150px !important",
            border: "1px solid #000",
          },
          "& .ql-toolbar": {
            border: "1px solid #000",
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
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems="center"
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
                  value={service.service_company_id || ""}
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
                    {company.company_name || "Select Company"} 
                  </MenuItem>
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
              theme="snow"
              placeholder="Enter service description..."
              value={service.service_desc}
              onChange={(value) => handleQuillChange("service_desc", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginBottom: "40px",
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
              theme="snow"
              placeholder="Enter service value..."
              value={service.service_value}
              onChange={(value) => handleQuillChange("service_value", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginBottom: "40px",
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
              theme="snow"
              placeholder="Enter service vision..."
              value={service.service_vision}
              onChange={(value) => handleQuillChange("service_vision", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginBottom: "40px",
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
              theme="snow"
              placeholder="Enter service mission..."
              value={service.service_mission}
              onChange={(value) => handleQuillChange("service_mission", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginBottom: "40px",
              }}
            />
          </Box>

          {/* Add Service Logo */}
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
              Add Logo
            </Button>
            <Modal open={open} onClose={handleClose}>
              <MediaLibrary onSelectImage={handleSelectImage}/>
            </Modal>
          </Box>

          {/* Service Status */}
          {isHidden && (
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
              Service Status
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
          )}

          {/* Created By User ID */}
          {isHidden && (
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="service_created_by_user_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Created By User ID
            </InputLabel>
            <InputBase
              placeholder="Created By User ID"
              name="service_created_by_user_id"
              value={service.service_created_by_user_id}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          )}

          {/* Add Service Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddService}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Service
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddServiceByCompany;
