import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Button, InputBase, Modal, Typography, useTheme, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import JoditEditor from 'jodit-react';
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const UpdateService = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const { open, handleClose, handleOpen } = useMediaGallery();
  const editorRef = useRef(null);

  const [service, setService] = useState({
    service_name: '',
    service_desc: '',
    service_value: '',
    service_vision: '',
    service_mission: '',
    service_link: '',
    service_logo: '',
    service_company_id: '',
    service_status_id: '',
    service_updated_by_user_id: user?.user_id,
  });
  const [companies, setCompanies] = useState([]);
  const [currentField, setCurrentField] = useState('');

  useEffect(() => {
    // Fetch service data by ID
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/${id}`);
        setService(response.data[0]);
      } catch (error) {
        console.error('Error fetching service data:', error);
        toast.error('Failed to load service data');
      }
    };
    fetchService();
  }, [id, API_BASE_URL]);

  useEffect(() => {
    // Fetch company data
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast.error('Failed to load company data');
      }
    };
    fetchCompany();
  }, [API_BASE_URL]);

  const handleEditorChange = (field, content) => {
    setService((prevService) => ({
      ...prevService,
      [field]: content,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleImageChange = (image) => {
    const editor = editorRef.current;
    if (editor && currentField) {
      editor.selection.insertImage(`${API_BASE_URL}/uploads/${image.il_path}`);
    }
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/service/update/${id}`, service);
      toast.success('Service updated successfully');
      navigate('/services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error updating service');
    }
  };

  const handleOpenForEditor = () => {e
    setCurrentField('service_desc');
    handleOpen(); // uses your MediaLibrary to insert images into Jodit
  };

  // In your Jodit config, call the new function instead of handleOpen directly
  const config = {
    readonly: false,
    uploader: { insertImageAsBase64URI: true },
    filebrowser: {
      buttons: ['image'],
      insertImageAsBase64URI: false,
      image: {
        upload: false,
        insert: () => {
          handleOpenForEditor();
        },
      },
    },
  };

  return (
    <Box m={2}>
      <Header title="Update Service" subTitle="Update service details" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_name" sx={{ color: colors.grey[100] }}>
            Service Name
          </InputLabel>
          <InputBase
            id="service_name"
            name="service_name"
            value={service.service_name}
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
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_desc" sx={{ color: colors.grey[100] }}>
            Service Description
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={service.service_desc}
            config={config}
            onChange={(content) => handleEditorChange('service_desc', content)}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_value" sx={{ color: colors.grey[100] }}>
            Service Value
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={service.service_value}
            config={config}
            onChange={(content) => handleEditorChange('service_value', content)}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_vision" sx={{ color: colors.grey[100] }}>
            Service Vision
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={service.service_vision}
            config={config}
            onChange={(content) => handleEditorChange('service_vision', content)}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_mission" sx={{ color: colors.grey[100] }}>
            Service Mission
          </InputLabel>
          <JoditEditor
            ref={editorRef}
            value={service.service_mission}
            config={config}
            onChange={(content) => handleEditorChange('service_mission', content)}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_link" sx={{ color: colors.grey[100] }}>
            Service Link
          </InputLabel>
          <InputBase
            id="service_link"
            name="service_link"
            value={service.service_link}
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
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_logo" sx={{ color: colors.grey[100] }}>
            Service Logo
          </InputLabel>
          <Button
            variant="contained"
            title="Add Logo"
            onClick={() => handleOpen()} // Separate handler for logo
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
            }}
          >
            Add Logo
          </Button>
          <Modal open={open} onClose={handleClose}>
            <MediaLibrary onSelectImage={handleImageChange} />
          </Modal>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_company_id" sx={{ color: colors.grey[100] }}>
            Company
          </InputLabel>
          <FormControl fullWidth sx={{ backgroundColor: colors.grey[900], borderRadius: '4px' }}>
            <Select
              id="service_company_id"
              name="service_company_id"
              value={service.service_company_id}
              onChange={handleChange}
              displayEmpty
              sx={{ color: colors.grey[100] }}
            >
              <MenuItem value="" disabled>
                Select Company
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <InputLabel htmlFor="service_status_id" sx={{ color: colors.grey[100] }}>
            Status
          </InputLabel>
          <FormControl fullWidth sx={{ backgroundColor: colors.grey[900], borderRadius: '4px' }}>
            <Select
              id="service_status_id"
              name="service_status_id"
              value={service.service_status_id}
              onChange={handleChange}
              displayEmpty
              sx={{ color: colors.grey[100] }}
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              {/* Add status options here */}
            </Select>
          </FormControl>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            backgroundColor: colors.blueAccent[200],
            '&:hover': { backgroundColor: colors.blueAccent[400] },
          }}
        >
          Update Service
        </Button>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateService;