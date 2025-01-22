import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import {
  Box,
  Button,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardActionArea
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Test = () => {
  const editorRef = useRef(null); // Will hold the actual Jodit instance
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/image/all`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleAddNews = async () => {
    try {
      await fetch(`${API_BASE_URL}/news/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          news_title: newsTitle,
          news_article: content,
        }),
      });
      toast.success("News created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create news");
    }
  };

  const handleImageInsert = (imageUrl) => {
    const jodit = editorRef.current;
    if (!jodit) {
      console.log("Jodit instance not ready");
      return;
    }
    if (jodit.s) {
      jodit.s.insertImage(imageUrl);
      jodit.s.focus(); // Focus the editor after inserting the image
    } else {
      console.log("No selection available on Jodit instance");
    }
    setIsImagePickerOpen(false);
  };

  const openImagePicker = () => setIsImagePickerOpen(true);
  const closeImagePicker = () => setIsImagePickerOpen(false);

  const joditConfig = {
    buttons: [
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
      "|",
      {
        name: "customImage",
        exec: openImagePicker,
        tooltip: "Insert Image from Gallery",
      },
    ],
    events: {
      onInit: jodit => {
        editorRef.current = jodit; // store the Jodit instance
        console.log("Jodit onInit:", jodit);
      },
    },
    uploader: {
      insertImageAsBase64URI: true,
    },
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
        onChange={(newContent) => setContent(newContent)}
      />

      <Box mt={2}>
        <Button variant="contained" onClick={handleAddNews}>Save</Button>
      </Box>

      <Dialog open={isImagePickerOpen} onClose={closeImagePicker}>
        <DialogTitle>Select an Image</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={4} key={image.id}>
                <Card>
                  <CardActionArea
                    onClick={() => handleImageInsert(`${API_BASE_URL}/uploads/${image.il_path}`)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${API_BASE_URL}/uploads/${image.il_path}`}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImagePicker}>Close</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Test;