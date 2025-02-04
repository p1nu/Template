import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const API_BASE_URL = process.env.APP_API_URL;

const UpdateContact = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Contact state
  const [contact, setContact] = useState({
    contact_phonenumber: "",
    contact_address: "",
    contact_email: "",
    contact_telegram: "",
    contact_website: "",
    contact_company_id: "",
    contact_service_id: "",
    contact_created_by_user_id: user?.user_id,
  });

  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]); // Services for the selected company

  // Fetch contact data by ID
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contact/${id}`);
        setContact(response.data[0]);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        toast.error("Failed to fetch contact data");
      }
    };

    fetchContact();
  }, [id]);

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);

  // Fetch services when the selected company changes
  useEffect(() => {
    const fetchServices = async () => {
      if (contact.contact_company_id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/service/company/${contact.contact_company_id}`
          );
          setServices(response.data);
        } catch (error) {
          console.error("Error fetching services:", error);
          setServices([]); // Reset services if fetch fails
          toast.error("Failed to fetch services");
        }
      } else {
        setServices([]); // Reset services when no company is selected
      }
    };

    fetchServices();
  }, [contact.contact_company_id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => {
      // Reset service_id when company changes
      if (name === "contact_company_id") {
        return { ...prevContact, contact_service_id: "", [name]: value };
      }
      return { ...prevContact, [name]: value };
    });
  };

  // Handle form submission
  const handleUpdateContact = async () => {
    try {
      await axios.put(`${API_BASE_URL}/contact/update/${id}`, {
        ...contact,
        contact_created_by_user_id: user?.user_id,
      });
      toast.success("Contact updated successfully");

      setTimeout(() => {
        navigate("/contact");
      }, 3000);
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
    }
  };

  return (
    <Box m={2}>
      <Header title="Update Contact" subTitle="Modify contact details" />
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
          width="100%"
          boxShadow={3}
        >
          {/* Company Selection */}
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            marginBottom="10px"
          >
            <InputLabel
              htmlFor="contact_company_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company
            </InputLabel>
            <FormControl fullWidth>
              <Select
                name="contact_company_id"
                value={contact.contact_company_id}
                onChange={handleChange}
                sx={{
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Conditionally Render Service Selection */}
          {contact.contact_company_id && (
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              marginBottom="10px"
            >
              <InputLabel
                htmlFor="contact_service_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Service
              </InputLabel>
              <FormControl fullWidth>
                <Select
                  name="contact_service_id"
                  value={contact.contact_service_id || "0"}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="0">
                    <em>None</em>
                  </MenuItem>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <MenuItem
                        key={service.service_id}
                        value={service.service_id || ""}
                      >
                        {service.service_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">
                      <em>No Services Available</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          )}
          {/* Phone Number and Email */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems="center"
          >
            {/* Phone Number */}
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="contact_phonenumber"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Phone Number
              </InputLabel>
              <InputBase
                id="contact_phonenumber"
                placeholder="Enter phone number"
                name="contact_phonenumber"
                value={contact.contact_phonenumber}
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
            {/* Email */}
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="contact_email"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Email
              </InputLabel>
              <InputBase
                id="contact_email"
                placeholder="Enter email"
                name="contact_email"
                value={contact.contact_email}
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
          </Box>

          {/* Address */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="contact_address"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Address
            </InputLabel>
            <InputBase
              id="contact_address"
              placeholder="Enter address"
              name="contact_address"
              value={contact.contact_address}
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

          {/* Telegram and Website */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems="center"
            marginBottom="10px"
          >
            {/* Telegram */}
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="contact_telegram"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Telegram
              </InputLabel>
              <InputBase
                id="contact_telegram"
                placeholder="Enter Telegram username"
                name="contact_telegram"
                value={contact.contact_telegram}
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
            {/* Website */}
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="contact_website"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Website
              </InputLabel>
              <InputBase
                id="contact_website"
                placeholder="Enter website URL"
                name="contact_website"
                value={contact.contact_website}
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
          </Box>

          

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateContact}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Contact
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000}/>
    </Box>
  );
};

export default UpdateContact;