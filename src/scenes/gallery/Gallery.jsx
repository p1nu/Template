// Gallery.jsx
import React from 'react';
import { Modal, Box, Grid2, IconButton, Typography } from '@mui/material';
import { useGallery } from './GalleryContext';
import CloseIcon from '@mui/icons-material/Close';

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
  const { isGalleryOpen, closeGallery, images, selectImage } = useGallery();

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
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
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
    </Modal>
  );
};

export default Gallery;