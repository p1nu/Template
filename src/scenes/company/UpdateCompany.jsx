import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Button,
  InputBase,
  Modal,
  Typography,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const UpdateCompany = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const { open, open1, handleClose, handleClose1, handleOpen, handleOpen1 } =
    useMediaGallery();
  const editorRef = useRef();

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
    company_updated_by_user_id: user?.user_id,
  });
  const [companies, setCompanies] = useState([]);
  const [currentField, setCurrentField] = useState("");

  useEffect(() => {
    // Fetch company data by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Error fetching company data");
      }
    };
    fetchCompany();
  }, [id, API_BASE_URL]);

  const handleEditorChange = (field, content) => {
    setCompany((prevCompany) => ({
      ...prevCompany,
      [field]: content,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleImageChange = (image) => {
    const editor = editorRef.current;
    if (editor && currentField) {
      editor.selection.insertImage(`${API_BASE_URL}/uploads/${image.il_path}`);
    }
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/company/update/${id}`, company);
      toast.success("Company updated successfully");
      setTimeout(() => {
        navigate(`/company`);
      }, 3000); // Navigate to company page after 3 seconds
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Error updating company");
    }
  };

  const handleOpenForEditor = (field) => {
    setCurrentField(field);
    handleOpen();
  };

  const handleEditorBlur = (field, content) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: content }));
  };

  const config = {
    minHeight: 400,
    readonly: false,
    uploader: { insertImageAsBase64URI: true },
    events: {
      blur: (editor) => {
        const content = editor.current?.value;
        handleEditorChange(currentField, content);
      },
    },
  };

  return (
    <Box m={2}>
      <Header title="Update Company" subTitle="Update company details" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={3}
        width="100%"
        maxWidth="800px"
        mx="auto"
        p={3}
        bgcolor={colors.grey[800]}
        borderRadius="8px"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          width={"100%"}
        >
          {/* Company Name */}
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <InputLabel htmlFor="company_name" sx={{ color: colors.grey[100] }}>
              Company Name
            </InputLabel>
            <InputBase
              id="company_name"
              name="company_name"
              value={company.company_name}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          {/* Company Acronym */}
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <InputLabel
              htmlFor="company_acronym"
              sx={{ color: colors.grey[100] }}
            >
              Company Acronym
            </InputLabel>
            <InputBase
              id="company_acronym"
              name="company_acronym"
              value={company.company_acronym}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          {/* Company Status */}
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <InputLabel
              htmlFor="company_status_id"
              sx={{ color: colors.grey[100] }}
            >
              Company Status
            </InputLabel>
            <FormControl
              fullWidth
              sx={{ backgroundColor: colors.grey[900], borderRadius: "4px" }}
            >
              <Select
                id="company_status_id"
                name="company_status_id"
                value={company.company_status_id}
                onChange={handleChange}
                displayEmpty
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {/* Logo and Background */}
        <Box display="flex" justifyContent="center" gap={2} width="100%">
          {/* Company Logo */}
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <Button
              variant="contained"
              title="Add Logo"
              onClick={() => handleOpenForEditor("company_logo")}
              sx={{
                mt: 2,
                backgroundColor: colors.blueAccent[200],
              }}
            >
              Add Logo
            </Button>
            <Modal open={open} onClose={handleClose}>
              <MediaLibrary onSelectImage={handleImageChange} />
            </Modal>
          </Box>
          {/* Company Background */}
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <Button
              variant="contained"
              title="Add Background"
              onClick={() => handleOpenForEditor("company_background")}
              sx={{
                mt: 2,
                backgroundColor: colors.blueAccent[200],
              }}
            >
              Add Background
            </Button>
            <Modal open={open1} onClose={handleClose1}>
              <MediaLibrary onSelectImage={handleImageChange} />
            </Modal>
          </Box>
        </Box>
        {/* Company Value */}
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="company_value" sx={{ color: colors.grey[100] }}>
            Company Value
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={company.company_value}
            config={config}
            onBlur={(content) => handleEditorChange("company_value", content)}
          />
        </Box>
        {/* Company Vision */}
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="company_vision" sx={{ color: colors.grey[100] }}>
            Company Vision
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={company.company_vision}
            config={config}
            onBlur={(content) => handleEditorChange("company_vision", content)}
          />
        </Box>
        {/* Company Mission */}
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel
            htmlFor="company_mission"
            sx={{ color: colors.grey[100] }}
          >
            Company Mission
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={company.company_mission}
            config={config}
            onBlur={(content) => handleEditorChange("company_mission", content)}
          />
        </Box>
        {/* Company Description */}
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="company_desc" sx={{ color: colors.grey[100] }}>
            Company Description
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={company.company_desc}
            config={config}
            onBlur={(content) => handleEditorChange("company_desc", content)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            backgroundColor: colors.blueAccent[200],
            "&:hover": { backgroundColor: colors.blueAccent[400] },
          }}
        >
          Update Company
        </Button>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateCompany;
