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

const UpdateNews = () => {
  const { id } = useParams(); // Assuming you're using React Router to pass the news ID
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { openGallery, selectedImage } = useGallery(); // Access context functions and state

  const [news, setNews] = useState({
    news_title: '',
    news_article: '',
    news_date: '',
    news_image_id: '',
    news_desc: '',
    news_status_id: 1,
    news_created_by_user_id: user?.user_id || '',
  });

  const [image, setImage] = useState('');
  const { open, handleOpen, handleClose } = useGallery(); // Assuming useGallery manages media gallery modal

  const [loading, setLoading] = useState(true); // To manage loading state

  // Fetch existing news data
  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/news/${id}`);
      const existingNews = response.data;
      setNews({
        news_title: existingNews.news_title || '',
        news_article: existingNews.news_article || '',
        news_date: existingNews.news_date ? existingNews.news_date.split('T')[0] : '',
        news_image_id: existingNews.news_image_id || '',
        news_desc: existingNews.news_desc || '',
        news_status_id: existingNews.news_status_id || 1,
        news_created_by_user_id: existingNews.news_created_by_user_id || user?.user_id || '',
      });
      setImage(existingNews.news_image_id ? existingNews.image_path : '');

      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch news details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle selecting an image from the media gallery
  const handleSelectImage = (image) => {
    setNews((prevNews) => ({ ...prevNews, news_image_id: image.il_id }));
    setImage(image.il_path);
    toast.success('Image selected successfully');
    handleClose();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  // Handle article changes with TinyMCE
  const handleArticleChange = (content) => {
    setNews((prevNews) => ({ ...prevNews, news_article: content }));
  };

  const handleUpdateNews = async () => {
    try {
      await axios.put(`${API_BASE_URL}/news/update/${id}`, news);
      toast.success('News updated successfully');
      setTimeout(() => {
        navigate('/news'); // Navigate to the news list or another appropriate page
      }, 3000);
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update news');
    }
  };

  // Update created_by_user_id if user changes
  useEffect(() => {
    if (user) {
      setNews((prevNews) => ({
        ...prevNews,
        news_created_by_user_id: user.user_id,
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <Box m={2} display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h6" color={colors.grey[100]}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Header title="Update News" subTitle="Modify news details" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bgcolor={colors.grey[800]}
        sx={{
          '& .ql-container.ql-snow': {
            width: '100% !important',
            height: '200px !important',
            border: '1px solid #000',
          },
          '& .ql-toolbar': {
            border: '1px solid #000',
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
            <Box width="55%">
              {/* News Title */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="news_title" sx={{ color: colors.grey[100], mb: '5px' }}>
                  News Title
                </InputLabel>
                <InputBase
                  id="news_title"
                  placeholder="News Title"
                  name="news_title"
                  value={news.news_title}
                  onChange={handleChange}
                  sx={{
                    padding: '10px',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box>

              {/* News Article */}
              <Box mb={2}>
                <InputLabel htmlFor="news_article" sx={{ mb: '5px', color: colors.grey[100] }}>
                  News Article
                </InputLabel>
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={news.news_article || '<p>Start writing your article here...</p>'}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'anchor',
                      'autolink',
                      'charmap',
                      'codesample',
                      'emoticons',
                      'image',
                      'link',
                      'lists',
                      'media',
                      'searchreplace',
                      'table',
                      'visualblocks',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic underline | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image | help',
                    image_title: true,
                    automatic_uploads: false,
                    file_picker_types: 'image',
                    file_picker_callback: function (cb, value, meta) {
                      // Open the gallery modal
                      openGallery((imageUrl) => {
                        cb(imageUrl, { alt: 'Selected Image' });
                      });
                    },
                  }}
                  onEditorChange={handleArticleChange}
                />
              </Box>

              {/* News Date */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="news_date" sx={{ color: colors.grey[100], mb: '5px' }}>
                  News Date
                </InputLabel>
                <InputBase
                  id="news_date"
                  name="news_date"
                  type="date"
                  value={news.news_date}
                  onChange={handleChange}
                  sx={{
                    padding: '10px',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box>

              {/* News Description */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="news_desc" sx={{ color: colors.grey[100], mb: '5px' }}>
                  News Description
                </InputLabel>
                <InputBase
                  id="news_desc"
                  placeholder="A brief description of the news"
                  name="news_desc"
                  value={news.news_desc}
                  onChange={handleChange}
                  sx={{
                    padding: '10px',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                />
              </Box>

              {/* News Status */}
              <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
                <InputLabel htmlFor="news_status_id" sx={{ color: colors.grey[100], mb: '5px' }}>
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
                      border: '1px solid #000',
                      borderRadius: '4px',
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                      '&:hover': {
                        border: '1px solid #000 !important',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
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
                borderRadius: '4px',
                cursor: 'pointer',
                height: '70vh',
                overflow: 'hidden',
              }}
            >
              {image ? (
                <img
                  src={`${API_BASE_URL}/uploads/${image}`}
                  alt="Selected News"
                  width="100%"
                  height="auto"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="h6" color={colors.grey[100]}>
                  Click here to select an image
                </Typography>
              )}
            </Box>
          </Box>

          {/* Media Library Modal */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                overflowY: 'auto',
                borderRadius: '8px',
              }}
            >
              <MediaLibrary onSelectImage={handleSelectImage} />
            </Box>
          </Modal>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateNews}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200], '&:hover': { backgroundColor: colors.blueAccent[400] } }}
          >
            Update News
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateNews;
