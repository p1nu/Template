import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Box, Button, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGallery } from "../gallery/GalleryContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Test = () => {
  const editorRef = useRef(null);
  const { openGallery } = useGallery();
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");

  const joditConfig = {
    events: {
      afterOpenPopup: (dialog) => {
        console.log("Dialog opened", dialog.container);
        const urlButton = dialog.container.querySelector('.jodit-tabs__button[data-ref="link"]');
        if (urlButton) {
          console.log("URL button found");
          urlButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Open gallery");
            openGallery((selectedUrl) => {
              const urlInput = dialog.container.querySelector('input[name="url"]');
              if (urlInput) {
                urlInput.value = selectedUrl;
                dialog.tabs.activate("url");
              }
            });
          });
        } else {
          console.log("URL button not found");
        }
      },
    },
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "image",
      "|",
      "ul",
      "ol",
      "|",
      "align",
      "undo",
      "redo",
    ],
  };

  const handleAddNews = async () => {
    try {
      await axios.post(`${API_BASE_URL}/news/create`, {
        news_title: newsTitle,
        news_article: content,
      });
      toast.success("News created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create news");
    }
  };

  return (
    <Box p={2}>
      <InputLabel sx={{ mb: 1 }}>News Title</InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        value={newsTitle}
        onChange={(e) => setNewsTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <InputLabel sx={{ mb: 1 }}>News Article</InputLabel>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={joditConfig}
        onBlur={(newContent) => setContent(newContent)}
      />

      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" onClick={handleAddNews}>
          Save
        </Button>
      </Box>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Test;