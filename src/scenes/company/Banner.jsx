import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  ImageList,
  ImageListItem,
  Modal,
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import {MediaLibrary} from '../gallery/Index'; // Adjust the import path as needed
import { useParams } from 'react-router-dom';
import { useMediaGallery } from '../gallery/MediaGalleryContext';

const Banner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const companyId = useParams().id;

  const [banners, setBanners] = useState([]);
  const [openMediaLibrary, setOpenMediaLibrary] = useState(false);
  const [message, setMessage] = useState('');

  const { open, handleOpen, handleClose } = useMediaGallery();

  // Fetch banners associated with the company
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/banner/company/${companyId}`
      );
      setBanners(response.data[0]);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setMessage('Failed to load banners.');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [companyId]);

  // Handle image selection from Media Library
  const handleSelectImage = async (image) => {
    try {
      await axios.post('http://localhost:3030/banner/new', {
        banner_name: image.il_name,
        banner_company_id: companyId,
        banner_image_id: image.il_id, // Use image ID
      });
      console.log("image", image);
      setMessage('Banner added successfully.');
      fetchBanners(); // Refresh the banner list
    } catch (error) {
      console.log("image", image);
      console.error('Error adding banner:', error);
      setMessage('Failed to add banner.');
    }
  };

  return (
    <Box m="20px">
      <Typography variant="h5" color={colors.grey[100]}>
        Company Banners
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
        onClick={handleOpen}
      >
        Add Banner Image
      </Button>

      {/* Media Library Modal */}
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.5)"
        >
          <Box
            bgcolor={colors.grey[900]}
            boxShadow={24}
            p={4}
            borderRadius="10px"
            width="80%"
            maxHeight="80vh"
            overflow="auto"
          >
            <MediaLibrary
              onSelectImage={handleSelectImage}
            />
          </Box>
        </Box>
      </Modal>

      {/* Display Feedback Message */}
      {message && (
        <Typography
          variant="body1"
          color={message.includes('successfully') ? 'green' : 'red'}
          mt={2}
        >
          {message}
        </Typography>
      )}

      {/* Display Banner Images */}
      <Box mt={2}>
        <ImageList cols={3} gap={16}>
          {banners.toReversed().map((banner) => (
            <ImageListItem key={banner.banner_id}>
              <img
                src={`http://localhost:3030/uploads/${banner.image_path}`}
                alt={`Banner ${banner.banner_id}`}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
};

export default Banner;
