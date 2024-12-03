import React, { useState, useContext, useEffect } from "react";
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
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AuthContext } from "../global/AuthContext";
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const API_BASE_URL = process.env.APP_API_URL;

const AddCSR = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [csr, setCsr] = useState({
    csr_name: "",
    csr_desc: "",
    csr_thumbnail: "",
    csr_created_by_user_id: user?.user_id || "",
  });

  const [image, setImage] = useState("");
  const { open, handleOpen, handleClose } = useMediaGallery();

  // Handle selecting an image from the media gallery
  const handleSelectImage = (image) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_thumbnail: image.il_path }));
    setImage(image.il_path);
    toast.success("Image selected successfully");
    handleClose();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCsr((prevCsr) => ({ ...prevCsr, [name]: value }));
  };

  // Handle article changes with react-quill
  const handleArticleChange = (value) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_desc: value }));
  };

  const handleAddCsr = async () => {
    try {
      await axios.post(`${API_BASE_URL}/csr/new`, csr);
      toast.success("CSR added successfully");
      setCsr({
        csr_name: "",
        csr_desc: "",
        csr_thumbnail: "",
        csr_created_by_user_id: user?.user_id || "",
      });
      setTimeout(() => {
        navigate("/csr");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      setCsr((prevCsr) => ({
        ...prevCsr,
        csr_created_by_user_id: user.user_id,
      }));
    }
  }, [user]);

  return (
    <Box m={2}>
      <Header title="Add New CSR" subTitle="Create a new CSR entry" />
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
          borderRadius="2x"
          width="100%"
          boxShadow={3}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width={"100%"}
            gap={2}
          >
            <Box width={"55%"}>
              {/* CSR Title */}
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
                  id="csr_title"
                  placeholder="CSR Name"
                  name="csr_name"
                  value={csr.csr_name}
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

              {/* CSR Desc */}
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
                <ReactQuill
                  theme="snow"
                  value={csr.csr_desc}
                  onChange={handleArticleChange}
                  placeholder="Write your description here..."
                  style={{
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                    borderRadius: "2px",
                  }}
                />
              </Box>

              {/* CSR Date */}
              {/* <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_date"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Date
                </InputLabel>
                <InputBase
                  id="csr_date"
                  name="csr_date"
                  type="date"
                  value={csr.csr_date}
                  onChange={handleChange}
                  sx={{
                    padding: "10px",
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box> */}

              {/* CSR Link */}
              {/* <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_link"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Link
                </InputLabel>
                <InputBase
                  id="csr_link"
                  placeholder="https://example.com"
                  name="csr_link"
                  value={csr.csr_link}
                  onChange={handleChange}
                  sx={{
                    padding: "10px",
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box> */}

              {/* CSR status */}
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
                    value={csr.csr_status_id || 1}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      border: `1px solid #000`,
                      borderRadius: "2px",
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                      "& :hover": {
                        border: "none !important",
                      },
                      "& :focus": {
                        border: "none",
                      },
                      "& .active": {
                        border: "none",
                      },
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
            </Box>
            <Box
              width="45%"
              border={"1px solid #000"}
              display={"flex"}
              justifyContent={"center"}
              textAlign={"center"}
              alignItems={"center"}
              onClick={handleOpen}
            >
              {image ? (
                <img
                  src={`${API_BASE_URL}/uploads/${image}`}
                  alt="csr"
                  width="100%"
                  height="auto"
                />
              ) : (
                <Typography variant="h6">Click here to select image for thumbnail</Typography>
              )}
            </Box>
          </Box>
          <Modal open={open} onClose={handleClose}>
            <MediaLibrary onSelectImage={handleSelectImage} />
          </Modal>
          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCsr}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
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
