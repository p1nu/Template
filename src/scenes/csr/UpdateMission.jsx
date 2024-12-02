import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  InputLabel,
  InputBase,
  Select,
  MenuItem,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { AuthContext } from '../global/AuthContext';
import { MediaLibrary } from '../gallery/Index';
import { useMediaGallery } from '../gallery/MediaGalleryContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateMission = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const { open, handleOpen, handleClose } = useMediaGallery();
  const { id } = useParams();
  const navigate = useNavigate();

  const [mediaType, setMediaType] = useState('');
  const [media, setMedia] = useState('');
  const [description, setDescription] = useState('');

  const [mission, setMission] = useState({
    description: '',
    image: '',
    video: '',
    updated_by_user_id: user?.user_id,
  });

  useEffect(() => {
    // Fetch mission data by ID
    const fetchMission = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/mission/${id}`);
        const missionData = response.data;
        setMission(missionData[0]);
        setDescription(missionData[0].description);
        if (missionData.image) {
          setMediaType('image');
          setMedia(missionData.image);
        } else if (missionData.video) {
          setMediaType('video');
          setMedia(missionData.video);
        }
      } catch (error) {
        console.error('Error fetching mission:', error);
        toast.error('Error fetching mission data');
      }
    };
    fetchMission();
  }, [id]);

  // Handle media type change
  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
    setMedia('');
    setMission((prevMission) => ({ ...prevMission, image: '', video: '' }));
  };

  // Handle selecting an image
  const handleSelectImage = (image) => {
    setMedia(image.il_path);
    setMission((prevMission) => ({ ...prevMission, image: image.il_path, video: '' }));
    toast.success('Image selected successfully');
    handleClose();
  };

  // Handle video link input
  const handleVideoLinkChange = (e) => {
    const videoLink = e.target.value;
    setMedia(videoLink);
    setMission((prevMission) => ({ ...prevMission, video: videoLink, image: '' }));
  };

  // Handle description change
  const handleDescriptionChange = (value) => {
    setDescription(value);
    setMission((prevMission) => ({ ...prevMission, description: value }));
  };

  // Handle form submission
  const handleUpdateMission = async () => {
    try {
      await axios.put(`http://localhost:3030/mission/update/${id}`, mission);
      toast.success('Mission updated successfully');
      navigate(-1); // Navigate back
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error('Error updating mission');
    }
  };

  return (
    <Box m={2}>
      <Typography variant="h4" mb={2}>
        Update Mission
      </Typography>

      {/* Media Type Selection */}
      <Box mb={2}>
        <InputLabel sx={{ mb: 1 }}>Select Media Type</InputLabel>
        <Select
          value={mediaType}
          onChange={handleMediaTypeChange}
          displayEmpty
          sx={{
            width: '200px',
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </Box>

      {/* Media Input */}
      {mediaType === 'image' && (
        <Box mb={2}>
          <Button variant="contained" onClick={handleOpen}>
            Select Image
          </Button>
          {media && (
            <Box mt={2}>
              <Typography>Selected Image:</Typography>
              <img src={`http://localhost:3030/uploads/${media}`} alt="Selected" width="200px" />
            </Box>
          )}
          <Modal open={open} onClose={handleClose}>
            <MediaLibrary onSelectImage={handleSelectImage} />
          </Modal>
        </Box>
      )}

      {mediaType === 'video' && (
        <Box mb={2}>
          <InputLabel sx={{ mb: 1 }}>Video Link</InputLabel>
          <InputBase
            placeholder="Enter video link"
            value={media}
            onChange={handleVideoLinkChange}
            sx={{
              width: '100%',
              padding: '10px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
        </Box>
      )}

      {/* Description */}
      <Box mb={2}>
        <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter description..."
          style={{
            height: '200px',
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
          }}
        />
      </Box>

      {/* Submit Button */}
      <Button variant="contained" onClick={handleUpdateMission}>
        Update Mission
      </Button>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateMission;