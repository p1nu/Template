import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputBase,
  InputLabel,
  FormControl,
  Modal,
} from "@mui/material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import { OpenMediaButton, MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";

const AddCompany = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [company, setCompany] = useState({
    company_id: "",
    company_name: "",
    company_acronym: "",
    company_value: "",
    company_vision: "",
    company_mission: "",
    company_desc: "",
    company_logo: "",
    company_created_by_user_id: "",
  });
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleQuillChange = (field, value) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  const handleAddCompany = async () => {
    try {
      await axios.post("http://localhost:3030/company/new", {
        ...company,
        company_created_by_user_id: user?.user_id,
      });
      setError("Company added successfully");
      setCompany({
        company_name: "",
        company_acronym: "",
        company_value: "",
        company_vision: "",
        company_mission: "",
        company_desc: "",
        company_created_by_user_id: "",
      });
      setTimeout(() => {
        navigate("/company");
      }, 3000);
    } catch (error) {
      console.error("Error adding company:", error);
      setError("Error adding company");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const { open, handleClose, value, handleOpen } = useMediaGallery();

  const handleSelectImage = (imagePath) => {
    setCompany((prevCompany) => ({ ...prevCompany, company_logo: imagePath }));
    setError('Logo selected successfully');
    // Optionally, add a timeout to clear the message
    setTimeout(() => setError(''), 3000);
  };


  return (
    <Box m={2}>
      <Header title="Add New Company" subTitle="Create a new company" />
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
          {/* Company Name and Acronym */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems="center"
          >
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="company_name"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Company Name
              </InputLabel>
              <InputBase
                id="company_name"
                placeholder="Company Name"
                name="company_name"
                value={company.company_name}
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
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="company_acronym"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Company Acronym
              </InputLabel>
              <InputBase
                id="company_acronym"
                placeholder="Company Acronym"
                name="company_acronym"
                value={company.company_acronym}
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

          {/* Company Value */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="company_value"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company Value
            </InputLabel>
            <ReactQuill
              theme="snow"
              placeholder="Enter company value..."
              value={company.company_value}
              onChange={(value) => handleQuillChange("company_value", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Company Vision */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="company_vision"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company Vision
            </InputLabel>
            <ReactQuill
              theme="snow"
              placeholder="Enter company vision..."
              value={company.company_vision}
              onChange={(value) => handleQuillChange("company_vision", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Company Mission */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="company_mission"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company Mission
            </InputLabel>
            <ReactQuill
              theme="snow"
              placeholder="Enter company mission..."
              value={company.company_mission}
              onChange={(value) => handleQuillChange("company_mission", value)}
              style={{
                height: "150px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Company Description */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="company_desc"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company Description
            </InputLabel>
            <ReactQuill
              theme="snow"
              placeholder="Enter company description..."
              value={company.company_desc}
              onChange={(value) => handleQuillChange("company_desc", value)}
              style={{
                height: "200px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Created By User ID */}
          {/* This field should be disabled and should automatically populate with the user ID of the currently logged in user */}
          {/* The user ID can be accessed from the AuthContext */}
          {isHidden && (
            <Box
              display="flex"
              flexDirection="column"
              margin="10px 0"
              width="100%"
            >
              <InputLabel
                htmlFor="company_created_by_user_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Created By User ID
              </InputLabel>
              <InputBase
                id="company_created_by_user_id"
                placeholder="Created By User ID"
                name="company_created_by_user_id"
                value={user?.user_id}
                disabled
                // onChange={handleChange}
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

          {/* Add Company Logo */}
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

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCompany}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Company
          </Button>

          {/* Error/Success Message */}
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

export default AddCompany;
