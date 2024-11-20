import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const UpdateNews = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/news/${id}`);
        const newsData = response.data[0];

        // Format the news_date to "yyyy-MM-dd"
        const date = new Date(newsData.news_date);
        const formattedDate = date.toISOString().split("T")[0];

        setNews({ ...newsData, news_date: formattedDate });
      } catch (error) {
        console.error("Error fetching news data:", error);
        toast.error("Failed to fetch news data");
      }
    };

    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  const handleUpdateNews = async () => {
    try {
      await axios.put(`http://localhost:3030/news/update/${id}`, {
        ...news,
        news_updated_by_user_id: user?.user_id,
      });
      toast.success("News updated successfully");

      setTimeout(() => {
        navigate("/news");
      }, 3000);
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news");
    }
  };

  return (
    <Box m={2}>
      <Box
        display="flex"
        flexDirection="row-reverse"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        padding={2}
        bgcolor={colors.grey[800]}
        height={"100%"}
      >
        <Box height={"80vh"} border={"1px solid #000"} width={"40%"}>
          box 1
        </Box>
        <Box height={"80vh"} border={"1px solid #000"} width={"60%"}>
          {/* News Title */}
          <Box display="flex" flexDirection="column" width="100%">
            <InputBase
              id="news_title"
              placeholder="News Title"
              name="news_title"
              value={news.news_title}
              onChange={handleChange}
              sx={{
                padding: "5px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[800],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* News Date */}
          <Box display="flex" flexDirection="column" width="100%" mt={2}>
            <InputLabel
              htmlFor="news_date"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              News Date
            </InputLabel>
            <InputBase
              id="news_date"
              type="date"
              name="news_date"
              value={news.news_date}
              onChange={handleChange}
              sx={{
                padding: "5px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[800],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* News Article */}
          <Box display="flex" flexDirection="column" width="100%" mt={2}>
            <InputLabel
              htmlFor="news_article"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              News Article
            </InputLabel>
            <InputBase
              id="news_article"
              placeholder="News Article"
              name="news_article"
              value={news.news_content}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                padding: "5px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[800],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* News Author */}
          <Box display="flex" flexDirection="column" width="100%" mt={2}>
            <InputLabel
              htmlFor="news_author"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              News Author
            </InputLabel>
            <InputBase
              id="news_author"
              placeholder="News Author"
              name="news_author"
              value={news.news_author}
              onChange={handleChange}
              sx={{
                padding: "5px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[800],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* News Status */}
          <Box display="flex" flexDirection="column" width="100%" mt={2}>
            <InputLabel
              htmlFor="news_status"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              News Status
            </InputLabel>
            <FormControl fullWidth>
              <Select
                name="news_status"
                value={news.news_status}
                onChange={handleChange}
                sx={{
                  backgroundColor: colors.grey[800],
                  color: colors.grey[100],
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="1">Published</MenuItem>
                <MenuItem value="2">Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateNews}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update News
          </Button>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default UpdateNews;
