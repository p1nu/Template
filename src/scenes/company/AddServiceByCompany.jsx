import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddServiceByCompany = () => {
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
    service_company_id: id,
    service_status_id: "",
    service_created_by_user_id: "",
  });
  const [company, setCompany] = useState({
    company_name: "",
  });
  const [error, setError] = useState("");

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
        const response = await axios.get(`http://localhost:3030/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error("Error fetching data from database:", error);
      }
    };
    fetchCompany();
  }, [id]);

  const handleAddService = async () => {
    try {
      await axios.post(`http://localhost:3030/service/new`, service);
      setError("Service added successfully");
      setService({
        service_name: "",
        service_desc: "",
        service_value: "",
        service_vision: "",
        service_mission: "",
        service_company_id: id,
        service_status_id: "",
        service_created_by_user_id: "",
      }); // Reset form
      setTimeout(() => {
        navigate("/services");
      }, 3000); // Navigate to services page after 3 seconds
    } catch (error) {
      console.error("Error adding service:", error);
      setError("Error adding service");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header
        title="Add New Service"
        subTitle={`Create a new service for: ${company.company_name}`}
      />
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
            <InputBase
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
                  Select Status
                </MenuItem>
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="2">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
          <InputBase
            placeholder="Company Name"
            name="service_company_id"
            value={company.company_name}
            onChange={handleChange}
            disabled
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Created By User ID"
            name="service_created_by_user_id"
            value={service.service_created_by_user_id}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddService}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Service
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

export default AddServiceByCompany;
