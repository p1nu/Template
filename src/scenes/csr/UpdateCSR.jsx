import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputLabel,
  Modal,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
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

const UpdateCSR = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();

  const [csr, setCsr] = useState({
    csr_title: "",
    csr_article: "",
    csr_date: "",
    csr_image_id: "",
    csr_link: "",
    csr_status_id: 1,
    csr_updated_by_user_id: user?.user_id || "",
  });

  const [image, setImage] = useState("");
  const { open, handleOpen, handleClose } = useMediaGallery();

  useEffect(() => {
    const fetchCsr = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/csr/${id}`);
        const csrData = response.data;

        // Format the csr_date to "yyyy-MM-dd"
        const date = new Date(csrData.csr_date);
        const formattedDate = date.toISOString().split("T")[0];

        setCsr({ ...csrData, csr_date: formattedDate });
        setImage(csrData.image_path); // Assuming the image path is returned
      } catch (error) {
        console.error("Error fetching CSR data:", error);
        toast.error("Failed to fetch CSR data");
      }
    };

    fetchCsr();
  }, [id]);

  // Handle selecting an image from the media gallery
  const handleSelectImage = (image) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_image_id: image.il_id }));
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
    setCsr((prevCsr) => ({ ...prevCsr, csr_article: value }));
  };

  const handleUpdateCsr = async () => {
    try {
      await axios.put(`http://localhost:3030/csr/update/${id}`, {
        ...csr,
        csr_updated_by_user_id: user?.user_id,
      });
      toast.success("CSR updated successfully");
      setTimeout(() => {
        navigate("/csr");
      }, 3000);
    } catch (error) {
      console.error("Error updating CSR:", error);
      toast.error("Failed to update CSR");
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
                  htmlFor="csr_title"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Title
                </InputLabel>
                <InputBase
                  id="csr_title"
                  placeholder="CSR Title"
                  name="csr_title"
                  value={csr.csr_title}
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

              {/* CSR Article */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="csr_article"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  CSR Article
                </InputLabel>
                <ReactQuill
                  theme="snow"
                  value={csr.csr_article}
                  onChange={handleArticleChange}
                  placeholder="Write your article here..."
                  style={{
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                    borderRadius: "2px",
                  }}
                />
              </Box>

              {/* CSR Date */}
              <Box
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
              </Box>

              {/* CSR Link */}
              <Box
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
              </Box>
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
                    value={csr.csr_status_id}
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
                  src={`http://localhost:3030/uploads/${image}`}
                  alt="csr"
                  width="100%"
                  height="auto"
                />
              ) : (
                <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                  Click to select an image
                </Typography>
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
            onClick={handleUpdateCsr}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update CSR
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateCSR;