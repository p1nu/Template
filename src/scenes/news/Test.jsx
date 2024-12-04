import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Button } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Test = () => {
  const editorRef = useRef(null);
  const [content, setContent] = React.useState("");

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const newsDate = new Date().toISOString().split('T')[0];

  const handleAddNews = async () => {
    try {
      const payload = {
        news_title: "Your News Title",
        news_article: content,
        news_date: newsDate,
        news_image_id: 1,
        news_status_id: 1,
        news_created_by_user_id: 4,
      };

      await axios.post(`${API_BASE_URL}/news/new`, payload);
      toast.success("News added successfully");
      // Reset form if needed
      setContent("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add news");
    }
  };

  return (
    <Box m={2}>
      <Editor
        apiKey="bhj581stwl77qz8vs4lh0c770ljiu1agfudmhhftmobbq6ar" // Replace with your TinyMCE API key
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>Start writing your article here...</p>"
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic underline | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | image | help',
          image_title: true,
          automatic_uploads: true,
          images_upload_url: `${API_BASE_URL}/image/upload/single`, // Your image upload endpoint
          file_picker_types: 'image',
          file_picker_callback: function (cb, value, meta) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
              const file = this.files[0];
              const reader = new FileReader();
              reader.onload = function () {
                const id = 'blobid' + (new Date()).getTime();
                const blobCache = editorRef.current.editorUpload.blobCache;
                const base64 = reader.result.split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };
            input.click();
          },
        }}
        onEditorChange={handleEditorChange}
      />
      
      <Button
        variant="contained"
        fullWidth
        onClick={handleAddNews}
        sx={{ mt: 2 }}
      >
        Add News
      </Button>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Test;