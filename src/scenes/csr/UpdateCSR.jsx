import React, { useState, useEffect, useContext, useRef } from "react";
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
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AuthContext } from "../global/AuthContext";
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gallery from '../gallery/Gallery'; // Ensure Gallery component is imported
import { useGallery } from '../gallery/GalleryContext';  // Adjust the import path as necessary


const UpdateCSR = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();

  const [csr, setCsr] = useState({
    csr_name: "",
    csr_desc: "",
    csr_article: "",
    csr_thumbnail: "",
    csr_status_id: 1,
    csr_updated_by_user_id: user?.user_id || "",
  });

  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const { open, handleOpen, handleClose } = useMediaGallery();

  // Fetch existing CSR data
  useEffect(() => {
    const fetchCsr = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/csr/${id}`);
        const existingCsr = response.data;
        setCsr({
          csr_name: existingCsr.csr_name || "",
          csr_desc: existingCsr.csr_desc || "",
          csr_article: existingCsr.csr_article || "",
          csr_thumbnail: existingCsr.csr_thumbnail || "",
          csr_status_id: existingCsr.csr_status_id || 1,
          csr_updated_by_user_id: user?.user_id || "",
        });
        setThumbnail(existingCsr.image_path || "");
      } catch (error) {
        console.error("Fetch CSR Error:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch CSR details"
        );
      }
    };

    fetchCsr();
  }, [API_BASE_URL, id, user]);

  // Handle selecting an image from the media gallery
  const handleSelectImage = (image) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_thumbnail: image.il_id }));
    setThumbnail(image.il_path);
    toast.success("Thumbnail selected successfully");
    handleClose();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCsr((prevCsr) => ({ ...prevCsr, [name]: value }));
  };

  // Handle article changes with TinyMCE
  const handleArticleChange = (content) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_article: content }));
  };

  // Handle form submission to update CSR
  const handleUpdateCsr = async () => {
    // Basic validation
    if (
      !csr.csr_name ||
      !csr.csr_article ||
      !csr.csr_desc ||
      !csr.csr_thumbnail ||
      !csr.csr_status_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/csr/update/${id}`, csr);
      toast.success("CSR updated successfully");
      setTimeout(() => {
        navigate("/csr");
      }, 3000);
    } catch (error) {
      console.error("Update CSR Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update CSR"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={2}>
      <Header title="Update CSR" subTitle="Modify CSR details" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bgcolor={colors.grey[800]}
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
            {/* CSR Information Section */}
            <Box width="55%">
              {/* CSR Name */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="csr_name" sx={{ color: colors.grey[100], mb: "5px" }}>
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

              {/* CSR Description */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="csr_desc" sx={{ color: colors.grey[100], mb: "5px" }}>
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
                    minHeight: "60px",
                  }}
                  multiline
                />
              </Box>

              {/* CSR Article */}
              <Box mb={2}>
                <InputLabel htmlFor="csr_article" sx={{ mb: "5px", color: colors.grey[100] }}>
                  CSR Article
                </InputLabel>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={csr.csr_article}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "anchor",
                      "autolink",
                      "charmap",
                      "codesample",
                      "emoticons",
                      "image",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic underline | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image | help",
                    image_title: true,
                    automatic_uploads: false,
                    file_picker_types: "image",
                    file_picker_callback: function (cb, value, meta) {
                      openGallery((imageUrl, imageData) => {
                        cb(imageUrl, { alt: "Selected Image" });
                      });
                    },
                  }}
                  onEditorChange={handleArticleChange}
                />
              </Box>

              {/* CSR Status */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="csr_status_id" sx={{ color: colors.grey[100], mb: "5px" }}>
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
            </Box>

            {/* Thumbnail Selection Section */}
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
                height: "220px",
                overflow: "hidden",
              }}
            >
              {thumbnail ? (
                <img
                  src={`${API_BASE_URL}/uploads/${thumbnail}`}
                  alt="CSR Thumbnail"
                  width="100%"
                  height="auto"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <Typography variant="h6" color={colors.grey[100]}>
                  Click here to select a thumbnail
                </Typography>
              )}
            </Box>
          </Box>

          {/* Media Library Modal */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                height: "80%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                overflowY: "auto",
                borderRadius: "8px",
              }}
            >
              <MediaLibrary onSelectImage={handleSelectImage} />
            </Box>
          </Modal>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateCsr}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              "&:hover": { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? "Updating CSR..." : "Update CSR"}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateCSR;