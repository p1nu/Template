import React, { useState, useEffect, useContext } from "react";
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
const API_BASE_URL = process.env.APP_API_URL;

const AddNews = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [news, setNews] = useState({
    news_title: "",
    news_article: "",
    news_date: "",
    news_image_id: "",
    news_link: "",
    news_status_id: 1,
    news_created_by_user_id: user?.user_id || "",
  });
  const [image, setImage] = useState("");
  const { open, handleOpen, handleClose } = useMediaGallery();
  const navigate = useNavigate();
  const isHidden = false;

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

  // Handle article changes with react-quill
  const handleArticleChange = (value) => {
    setNews((prevNews) => ({ ...prevNews, news_article: value }));
  };

  const handleAddNews = async () => {
    try {
      await axios.post(`${API_BASE_URL}/news/new`, news);
      toast.success("News added successfully");
      setNews({
        news_title: "",
        news_article: "",
        news_date: "",
        news_image_id: "",
        news_link: "",
        news_status_id: 1,
        news_created_by_user_id: user?.user_id || "",
      }); // Reset form
      setTimeout(() => {
        navigate("/news");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      setNews((prevNews) => ({
        ...prevNews,
        news_created_by_user_id: user.user_id,
      }));
    }
  }, [user]);

  return (
    <Box m={2}>
      <Header title="Add New News" subTitle="Create a new news article" />
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
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box>

              {/* News Article */}
              <Box
                display="flex"
                flexDirection="column"
                margin="10px 0"
                width="100%"
              >
                <InputLabel
                  htmlFor="news_article"
                  sx={{ color: colors.grey[100], mb: "5px" }}
                >
                  News Article
                </InputLabel>
                <ReactQuill
                  theme="snow"
                  value={news.news_article}
                  onChange={handleArticleChange}
                  placeholder="Write your article here..."
                  style={{
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                    borderRadius: "2px",
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
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box>

              {/* News Image ID */}
              {/* <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="news_image_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              News Image ID
            </InputLabel>
            <InputBase
              id="news_image_id"
              placeholder="Image ID"
              name="news_image_id"
              value={news.news_image_id}
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
              <Box>
                {/* News Link */}
                <Box
                  display="flex"
                  flexDirection="column"
                  margin="10px 0"
                  width="100%"
                >
                  <InputLabel
                    htmlFor="news_link"
                    sx={{ color: colors.grey[100], mb: "5px" }}
                  >
                    News Link
                  </InputLabel>
                  <InputBase
                    id="news_link"
                    placeholder="https://example.com"
                    name="news_link"
                    value={news.news_link}
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
                {/* News status */}
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
                    Company Status
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="news_status_id"
                      name="news_status_id"
                      value={news.news_status_id}
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

              {/* Created By User ID */}
              {/* {isHidden && (
                <Box
                  display="flex"
                  flexDirection="column"
                  margin="10px 0"
                  width="100%"
                >
                  <InputLabel
                    htmlFor="news_created_by_user_id"
                    sx={{ color: colors.grey[100], mb: "5px" }}
                  >
                    Created By User ID
                  </InputLabel>
                  <InputBase
                    id="news_created_by_user_id"
                    placeholder="User ID"
                    name="news_created_by_user_id"
                    value={user?.user_id}
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
              )} */}
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
                  alt="news"
                  width="100%"
                  height="auto"
                />
              ) : (
                <Typography variant="h6">Click here to select image</Typography>
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
            onClick={handleAddNews}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
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
