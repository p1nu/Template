import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Button, Modal, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaGallery } from '../gallery/MediaGalleryContext';
import { MediaLibrary } from '../gallery/Index';

const PreviewBanner = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { serviceId } = useParams();
  const [previewBanners, setPreviewBanners] = useState([]);
  const { open, handleOpen, handleClose } = useMediaGallery();
  const navigate = useNavigate();

  const fetchPreviewBanners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/preview-banner/service/${serviceId}`);
      setPreviewBanners(Array.isArray(response.data) ? response.data : []);
      console.log('Preview banners:', response.data);
      console.log('Service ID:', serviceId);
      // toast.success('Preview banners loaded successfully.');
    } catch (error) {
      console.error('Error fetching preview banners:', error);
      toast.error('Failed to load preview banners.');
    }
  };

  const handleSelectImage = async (image) => {
    try {
      const payload = {
        name: image.il_name,
        service_id: serviceId,
        url: image.il_path,
      };

      await axios.post(`${API_BASE_URL}/preview-banner/`, payload);

      fetchPreviewBanners(); // Refresh the preview banner list
      toast.success('Banner added to preview successfully.');
    } catch (error) {
      console.error('Error adding banner to preview:', error);
      toast.error('Failed to add banner to preview.');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      await axios.delete(`${API_BASE_URL}/preview-banner/${bannerId}`);
      toast.success('Banner deleted successfully.');
      fetchPreviewBanners(); // Refresh the preview banner list
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner.');
    }
  };

  useEffect(() => {
    fetchPreviewBanners();
  }, [serviceId]);

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Preview Banners
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
        onClick={handleOpen}
      >
        Add Preview Banner
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: colors.blueAccent[200], ml: 2 }}
        onClick={() => navigate(`/banner/service/${serviceId}`)}
      >
        Banner
      </Button>
      <Modal open={open} onClose={handleClose}>
        <MediaLibrary onSelectImage={handleSelectImage} />
      </Modal>
      <Box mt={2} height="60vh" overflow="auto">
        <Grid container spacing={2}>
          {previewBanners.map((banner) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={banner.id}>
              <Box
                sx={{
                  position: 'relative',
                  border: `2px solid ${colors.grey[800]}`,
                  '&:hover': {
                    border: `2px solid ${colors.primary[500]}`,
                  },
                  height: '200px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={`${API_BASE_URL}/uploads/${banner.url}`}
                  alt={`Banner ${banner.id}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'scale-down' }}
                />
                <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', width: '100%', textAlign: 'center' }}>
                  {banner.name}
                </Typography>
                <IconButton
                  sx={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  aria-label={`delete ${banner.name}`}
                  onClick={() => handleDeleteBanner(banner.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default PreviewBanner;