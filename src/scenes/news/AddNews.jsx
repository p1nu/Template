import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, InputLabel } from "@mui/material";
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AddNews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [news, setNews] = useState({
    news_title: "",
    news_article: "",
    news_date: "",
    news_image_id: "",
    news_link: "",
    news_created_by_user_id: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  const handleArticleChange = (value) => {
    setNews((prevNews) => ({ ...prevNews, news_article: value }));
  };

  const handleAddNews = async () => {
    try {
      await axios.post("http://localhost:3030/news/new", news);
      setError("News added successfully");
      setNews({
        news_title: "",
        news_article: "",
        news_date: "",
        news_image_id: "",
        news_link: "",
        news_created_by_user_id: "",
      }); // Reset form
      setTimeout(() => {
        navigate("/news");
      }, 3000);
    } catch (error) {
      console.error("Error adding news:", error);
      setError("Error adding news");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

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
          <Box
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
          </Box>

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

          {/* Created By User ID */}
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
              value={news.news_created_by_user_id}
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

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddNews}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add News
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

export default AddNews;
