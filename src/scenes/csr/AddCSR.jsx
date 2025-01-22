import React, { useState, useContext, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputLabel,
  Modal,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import JoditEditor from "jodit-react";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import { useGallery } from "../gallery/GalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { MediaLibrary } from "../gallery/Index";

const AddCSR = () => {
  const editorRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { openGallery, selectedImage } = useGallery();

  const [csr, setCsr] = useState({
    csr_name: "",
    csr_desc: "",
    csr_article: "",
    csr_thumbnail: "",
    csr_status_id: 1,
    csr_created_by_user_id: user?.user_id || "",
  });

  const [thumbnail, setThumbnail] = useState("");
  const { open, handleOpen, handleClose } = useMediaGallery();

  const handleSelectImage = (image) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_thumbnail: image.il_id }));
    setThumbnail(image.il_path);
    toast.success("Thumbnail selected successfully");
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCsr((prevCsr) => ({ ...prevCsr, [name]: value }));
  };

  const handleEditorChange = () => {
    const finalContent = editorRef.current?.value;
    setCsr((prev) => ({ ...prev, csr_article: finalContent }));
  };

  const joditConfig = {
    minHeight: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
    events: {
      blur: (editor) => {
        const content = editorRef.current?.value;
        setCsr((prev) => ({ ...prev, csr_article: content }));
      },
    },
  };

  const handleAddCsr = async () => {
    if (
      !csr.csr_name ||
      !csr.csr_desc ||
      !csr.csr_article ||
      !csr.csr_thumbnail ||
      !csr.csr_status_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/csr/new`, csr);
      toast.success("CSR added successfully");
      setTimeout(() => {
        navigate("/csr");
      }, 3000);
    } catch (error) {
      console.error("Add Error:", error);
      toast.error(error.response?.data?.message || "Failed to add CSR");
    }
  };

  return (
    <Box m={2}>
      <Header title="Add CSR" subTitle="Create a new CSR entry" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          "& .ql-container.ql-snow": {
            width: "100% !important",
            height: "200px !important",
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
          borderRadius="8px"
          width="100%"
          boxShadow={3}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
            gap={2}
          >
            <Box width="100%">
              <Box
                width="45%"
                border="1px solid #000"
                display="flex"
                justifyContent="center"
                textAlign="center"
                alignItems="center"
                onClick={handleOpen}
                sx={{
                  borderRadius: "4px",
                  cursor: "pointer",
                  height: "auto",
                  minHeight: "200px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {thumbnail ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${thumbnail}`}
                    alt="Selected CSR"
                    width="60%"
                    height="auto"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="h6" color={colors.grey[100]}>
                    Click here to select a thumbnail
                  </Typography>
                )}
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_name"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Name
                </InputLabel>
                <InputBase
                  id="csr_name"
                  placeholder="CSR Name"
                  name="csr_name"
                  value={csr.csr_name}
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

              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_desc"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Description
                </InputLabel>
                <InputBase
                  id="csr_desc"
                  placeholder="A brief description of the CSR"
                  name="csr_desc"
                  value={csr.csr_desc}
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

              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_status_id"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Status
                </InputLabel>
                <FormControl fullWidth>
                  <Select
                    id="csr_status_id"
                    name="csr_status_id"
                    value={csr.csr_status_id}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      border: "1px solid #000",
                      borderRadius: "4px",
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                      "&:hover": {
                        border: "1px solid #000 !important",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Status
                    </MenuItem>
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={2}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mb={2}>
                <InputLabel
                  htmlFor="csr_article"
                  sx={{ mb: "5px", color: colors.grey[100] }}
                >
                  CSR Article
                </InputLabel>
                <JoditEditor
                  ref={editorRef}
                  value={csr.csr_article}
                  config={joditConfig}
                />
              </Box>
            </Box>
          </Box>

          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                height: "90%",
                boxShadow: 24,
                p: 4,
                overflowY: "auto",
                borderRadius: "8px",
              }}
            >
              <MediaLibrary onSelectImage={handleSelectImage} />
            </Box>
          </Modal>

          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCsr}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              "&:hover": { backgroundColor: colors.blueAccent[400] },
            }}
          >
            Add CSR
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddCSR;
