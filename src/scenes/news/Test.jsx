import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Button, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gallery from '../gallery/Gallery'; // Ensure Gallery component is imported
import { useGallery } from '../gallery/GalleryContext'; // Import the useGallery hook

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Test = () => {
  const editorRef = useRef(null);
  const { openGallery, selectedImage } = useGallery(); // Access context functions and state
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNews = async () => {
    if (editorRef.current) {
      const contentData = editorRef.current.getContent();

      try {
        const payload = {
          news_title: newsTitle,
          news_article: contentData,
          image_url: selectedImage, // Include the selected image URL
          // Add other fields as necessary
        };

        await axios.post(`${API_BASE_URL}/news/new`, payload);
        toast.success("News added successfully");
        // Reset form if needed
        setNewsTitle("");
        setContent("");
        editorRef.current.setContent("");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add news");
      }
    }
  };

  return (
    <Box m={2}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
        padding={2}
        bgcolor="#f9f9f9"
        borderRadius="8px"
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        {/* News Title */}
        <Box mb={2}>
          <InputLabel htmlFor="news_title" sx={{ mb: "5px" }}>
            News Title
          </InputLabel>
          <TextField
            id="news_title"
            placeholder="Enter news title"
            variant="outlined"
            fullWidth
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
          />
        </Box>

        {/* TinyMCE Editor */}
        <Box mb={2}>
          <InputLabel htmlFor="news_article" sx={{ mb: "5px" }}>
            News Article
          </InputLabel>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // Use environment variable for security
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Start writing your article here...</p>"
            init={{
              height: 500,
              menubar: true,
              plugins: ['anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',],
              toolbar:
                'undo redo | formatselect | bold italic underline | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | image | help',
              image_title: true,
              automatic_uploads: false, // Disable automatic uploads to use custom gallery
              file_picker_types: 'image',
              file_picker_callback: function (cb, value, meta) {
                // Open the gallery modal
                openGallery((imageUrl) => {
                  console.log('Selected image:', imageUrl);
                  cb(imageUrl, { alt: 'image' });
                });
              },
            }}
            onEditorChange={(content, editor) => setContent(content)}
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNews}
          sx={{ mt: 2 }}
        >
          Add News
        </Button>

        {/* Toast Notifications */}
        <ToastContainer theme="colored" autoClose={2000} />
      </Box>
    </Box>
  );
};

export default Test;