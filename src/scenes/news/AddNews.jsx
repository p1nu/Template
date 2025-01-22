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
import Gallery from "../gallery/Gallery"; // Ensure Gallery component is imported
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { MediaLibrary } from "../gallery/Index";

const AddNews = () => {
  const editorRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { openGallery, selectedImage } = useGallery(); // Access context functions and state

  const [news, setNews] = useState({
    news_title: "",
    news_article: "",
    news_date: "",
    news_image_id: "",
    news_desc: "",
    news_status_id: 1,
    news_created_by_user_id: user?.user_id || "",
  });

  const [image, setImage] = useState("");
  const { open, handleOpen, handleClose } = useMediaGallery(); // Assuming useGallery manages media gallery modal

  // Handle selecting an image from the media gallery
  const handleSelectImage = (image) => {
    setNews((prevNews) => ({ ...prevNews, news_image_id: image.il_id }));
    setImage(image.il_path);
    toast.success("Image selected successfully");
    handleClose();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  // Handle article changes with JoditEditor
  const handleEditorChange = () => {
    const finalContent = editorRef.current?.value;
    setNews((prev) => ({ ...prev, news_article: finalContent }));
  };

  const joditConfig = {
    minHeight: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
    events: {
      blur: (editor) => {
        const content = editorRef.current?.value;
        setNews((prev) => ({ ...prev, news_article: content }));
      },
    },
  };

  const handleAddNews = async () => {
    try {
      await axios.post(`${API_BASE_URL}/news/create`, news);
      toast.success("News added successfully");
      setTimeout(() => {
        navigate("/news"); // Navigate to the news list or another appropriate page
      }, 3000);
    } catch (error) {
      console.error("Add Error:", error);
      toast.error(error.response?.data?.message || "Failed to add news");
    }
  };

  return (
    <Box m={2}>
      <Header title="Add News" subTitle="Create a new news article" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // padding={2}
        // bgcolor={colors.grey[800]}
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
            {/* News Information Section */}
            <Box width="100%">
              {/* Image Selection Section */}
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
                {image ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${image}`}
                    alt="Selected News"
                    width="60%"
                    // mix-width="100%"
                    height="auto"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="h6" color={colors.grey[100]}>
                    Click here to select an image
                  </Typography>
                )}
              </Box>
              {/* News Title */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="news_title"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  News Title
                </InputLabel>
                <InputBase
                  id="news_title"
                  placeholder="News Title"
                  name="news_title"
                  value={news.news_title}
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

              {/* News Date */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="news_date"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  News Date
                </InputLabel>
                <InputBase
                  id="news_date"
                  name="news_date"
                  type="date"
                  value={news.news_date}
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

              {/* News Description */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="news_desc"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  News Description
                </InputLabel>
                <InputBase
                  id="news_desc"
                  placeholder="A brief description of the news"
                  name="news_desc"
                  value={news.news_desc}
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

              {/* News Status */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="news_status_id"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  News Status
                </InputLabel>
                <FormControl fullWidth>
                  <Select
                    id="news_status_id"
                    name="news_status_id"
                    value={news.news_status_id}
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
              {/* News Article */}
              <Box mb={2}>
                <InputLabel
                  htmlFor="news_article"
                  sx={{ mb: "5px", color: colors.grey[100] }}
                >
                  News Article
                </InputLabel>
                <JoditEditor
                  ref={editorRef}
                  value={news.news_article}
                  config={joditConfig}
                  // onChange={handleEditorChange}
                />
              </Box>
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
                width: "90%",
                height: "90%",
                // bgcolor: "background.paper",
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
            onClick={handleAddNews}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              "&:hover": { backgroundColor: colors.blueAccent[400] },
            }}
          >
            Add News
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddNews;
