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
import { AuthContext } from "../global/AuthContext";
import { MediaGallery, OpenMediaButton, MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCompany = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    company_name: "",
    company_acronym: "",
    company_value: "",
    company_vision: "",
    company_mission: "",
    company_desc: "",
    company_logo: "",
    company_background: "",
    company_status_id: "",
    company_created_by_user_id: "",
    company_updated_by_user_id: "",
  });
  const [username, setUsername] = useState({
    user_name: "",
  });
  const token = localStorage.getItem("token");
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Fetch company data by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Error fetching company data");
      }
    };
    fetchCompany();
  }, [id]);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/user/${company.company_created_by_user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsername(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
      }
    };
    if (company.company_created_by_user_id) {
      fetchUser();
    }
  }, [company.company_created_by_user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleQuillChange = (field, value) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  const handleUpdateCompany = async () => {
    try {
      await axios.put(`http://localhost:3030/company/update/${id}`, {
        company_name: company.company_name,
        company_acronym: company.company_acronym,
        company_value: company.company_value,
        company_vision: company.company_vision,
        company_mission: company.company_mission,
        company_desc: company.company_desc,
        company_logo: company.company_logo,
        company_background: company.company_background,
        company_status_id: company.company_status_id,
        company_updated_by_user_id: user?.user_id,
      });
      toast.success("Company updated successfully");
      setTimeout(() => {
        navigate("/company");
      }, 3000); // Navigate to companies page after 3 seconds
    } catch (error) {
      console.log("Company:", company);
      console.error("Error updating company:", error);
      toast.error("Error updating company");
    }
  };

  const { open, open1, handleClose, handleClose1, handleOpen, handleOpen1 } = useMediaGallery();

  const handleSelectLogo = (image) => {
    setCompany((prevCompany) => ({ ...prevCompany, company_logo: image.il_path }));
    toast.success("Logo selected successfully");
  };

  const handleSelectBackground = (image) => {
    setCompany((prevCompany) => ({ ...prevCompany, company_background: image.il_path }));
    toast.success("Background selected successfully");
  };

  return (
    <Box m={2}>
      <Header
        title="Update Company"
        subTitle={`Update details for ${company.company_name}`}
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

          {/* Company Status */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="company_status_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Company Status
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="company_status_id"
                name="company_status_id"
                value={company.company_status_id}
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

          {/* Created By User ID */}
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
              Created By User
            </InputLabel>
            <InputBase
              id="company_created_by_user_id"
              placeholder="Created By User ID"
              name="company_created_by_user_id"
              disabled
              value={username.user_name || ""}
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

          {/* Updated By User ID */}
          {isHidden && (
            <Box
              display="flex"
              flexDirection="column"
              margin="10px 0"
              width="100%"
            >
              <InputLabel
                htmlFor="company_updated_by_user_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Updated By User ID
              </InputLabel>
              <InputBase
                id="company_updated_by_user_id"
                placeholder="Updated By User ID"
                name="company_updated_by_user_id"
                value={user?.user_id || ""}
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

          {/* Update Company Logo and Background */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Add Company Logo */}
            <Box width={"100%"}>
              <Button
                variant="contained"
                title="Add Logo"
                onClick={handleOpen}
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: colors.blueAccent[200],
                }}
              >
                Add Logo
              </Button>
              <Modal open={open} onClose={handleClose}>
                <MediaLibrary onSelectImage={handleSelectLogo} />
              </Modal>
            </Box>

            {/* Update Company Banner */}
            <Box width={"100%"}>
              <Button
                variant="contained"
                title="Add Background"
                onClick={handleOpen1}
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: colors.blueAccent[200],
                }}
              >
                Add Background
              </Button>
              <Modal open={open1} onClose={handleClose1}>
                <MediaLibrary onSelectImage={handleSelectBackground} />
              </Modal>
            </Box>
          </Box>

          {/* Update Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateCompany}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Company
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateCompany;
