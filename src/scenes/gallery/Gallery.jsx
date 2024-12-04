// Gallery.jsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Grid2,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from '@mui/material';
import { useGallery } from './GalleryContext';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const style = {
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
};

const Gallery = () => {
  const { isGalleryOpen, closeGallery, images, selectImage, fetchImages } = useGallery();
  const [tabValue, setTabValue] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axios.post(`${API_BASE_URL}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Images uploaded successfully');
      fetchImages(); // Reload images after upload
      setUploading(false);
      setTabValue(0); // Switch back to Gallery tab
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadError('Failed to upload images');
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <Modal
      open={isGalleryOpen}
      onClose={closeGallery}
      aria-labelledby="image-gallery-title"
      aria-describedby="image-gallery-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="image-gallery-title" variant="h6">
            Image Gallery
          </Typography>
          <IconButton onClick={closeGallery}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs for Gallery and Upload */}
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Gallery Tabs">
          <Tab label="Gallery" />
          <Tab label="Upload" />
        </Tabs>

        {/* Gallery Tab Content */}
        {tabValue === 0 && (
          <Box mt={2}>
            <Grid2 container spacing={2}>
              {images.length > 0 ? (
                images.map((image) => (
                  <Grid2 item xs={12} sm={6} md={4} lg={3} key={image.il_id}>
                    <Box
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover .overlay': {
                          opacity: 1,
                        },
                      }}
                      onClick={() => selectImage(image.il_path)}
                    >
                      <img
                        src={`${API_BASE_URL}/uploads/${image.il_path}`}
                        alt={image.il_name}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(0,0,0,0.5)',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="h6" color="#fff">
                          Select
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>
                ))
              ) : (
                <Typography>No images available.</Typography>
              )}
            </Grid2>
          </Box>
        )}

        {/* Upload Tab Content */}
        {tabValue === 1 && (
          <Box mt={2}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? '#f0f0f0' : '#fafafa',
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon fontSize="large" color="action" />
              <Typography variant="h6" color="textSecondary">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag and drop some files here, or click to select files'}
              </Typography>
            </Box>
            {uploading && (
              <Box display="flex" alignItems="center" mt={2}>
                <CircularProgress size={24} />
                <Typography variant="body1" ml={2}>
                  Uploading...
                </Typography>
              </Box>
            )}
            {uploadError && (
              <Typography variant="body2" color="error" mt={2}>
                {uploadError}
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
              startIcon={<CloudUploadIcon />}
            >
              Browse Files
              <input type="file" hidden multiple accept="image/*" onChange={(e) => onDrop(Array.from(e.target.files))} />
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default Gallery;