import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../global/AuthContext';
import { useGallery } from '../gallery/GalleryContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import JoditEditor from 'jodit-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const UpdateJob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [job, setJob] = useState({
    job_name: '',
    job_desc: '',
    job_schedule: '',
    job_start_date: '',
    job_end_date: '',
    job_created_by_user_id: '',
    job_updated_by_user_id: user?.user_id || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { openGallery } = useGallery();

  const editorRef = useRef(null);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/job/${id}`);
        const existingJob = response.data;
        setJob({
          job_name: existingJob.job_name || '',
          job_desc: existingJob.job_desc || '',
          job_schedule: existingJob.job_schedule || '',
          job_start_date: existingJob.job_start_date ? format(new Date(existingJob.job_start_date), 'yyyy-MM-dd') : '',
          job_end_date: existingJob.job_end_date ? format(new Date(existingJob.job_end_date), 'yyyy-MM-dd') : '',
          job_created_by_user_id: existingJob.job_created_by_user_id || '',
          job_updated_by_user_id: user?.user_id || '',
        });
      } catch (err) {
        console.error('Error fetching job details:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch job details');
      }
    };

    fetchJob();
  }, [API_BASE_URL, id, user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  // Handle description changes with TinyMCE
  // const handleDescriptionChange = (content) => {
  //   setJob((prevJob) => ({ ...prevJob, job_desc: content }));
  // };

  // Handle form submission to update job
  const handleUpdateJob = async () => {
    // Basic validation
    if (
      !job.job_name ||
      !job.job_desc ||
      !job.job_schedule ||
      !job.job_start_date ||
      !job.job_end_date
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/job/update/${id}`, job);
      toast.success('Job updated successfully');
      setTimeout(() => {
        navigate('/jobs'); // Navigate to the jobs list or another appropriate page
      }, 3000);
    } catch (error) {
      console.error('Update Job Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };


    const joditConfig = {
    minHeight: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
    events: {
      blur: (editor) => {
        const content = editorRef.current?.value;
        setJob((prev) => ({ ...prev, job_desc: content }));
      }
    }
  };

  return (
    <Box m={2}>
      <Header title="Update Job" subTitle="Modify job details" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bgcolor={colors.grey[800]}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="8px"
          width="100%"
          boxShadow={3}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
            gap={2}
          >
            {/* Job Information Section */}
            <Box width="55%">
              {/* Job Name, Schedule, and Dates on the same line */}
              <Box display="flex" flexDirection="row" gap={2} width="100%">
                {/* Job Name */}
                <Box display="flex" flexDirection="column" margin="10px 0" width="30%">
                  <InputLabel htmlFor="job_name" sx={{ color: colors.grey[100], mb: '5px' }}>
                    Job Name
                  </InputLabel>
                  <InputBase
                    id="job_name"
                    placeholder="Job Name"
                    name="job_name"
                    value={job.job_name}
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

                {/* Job Schedule */}
                <Box display="flex" flexDirection="column" margin="10px 0" width="30%">
                  <InputLabel htmlFor="job_schedule" sx={{ color: colors.grey[100], mb: '5px' }}>
                    Job Schedule
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="job_schedule"
                      name="job_schedule"
                      value={job.job_schedule}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        border: '1px solid #000',
                        borderRadius: '4px',
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        '&:hover': {
                          border: '1px solid #000 !important',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Schedule
                      </MenuItem>
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                      <MenuItem value="Part-Time">Part-Time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Job Start and End Date */}
                <Box display="flex" flexDirection="row" gap={2} width="40%">
                  {/* Job Start Date */}
                  <Box display="flex" flexDirection="column" margin="10px 0" width="50%">
                    <InputLabel htmlFor="job_start_date" sx={{ color: colors.grey[100], mb: '5px' }}>
                      Start Date
                    </InputLabel>
                    <InputBase
                      id="job_start_date"
                      name="job_start_date"
                      type="date"
                      value={job.job_start_date}
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

                  {/* Job End Date */}
                  <Box display="flex" flexDirection="column" margin="10px 0" width="50%">
                    <InputLabel htmlFor="job_end_date" sx={{ color: colors.grey[100], mb: '5px' }}>
                      End Date
                    </InputLabel>
                    <InputBase
                      id="job_end_date"
                      name="job_end_date"
                      type="date"
                      value={job.job_end_date}
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
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Job Description with TinyMCE */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="job_desc" sx={{ color: colors.grey[100], mb: '5px' }}>
              Job Description
            </InputLabel>
            <JoditEditor
              ref={editorRef}
              value={job.job_desc}
              config={joditConfig}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateJob}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              '&:hover': { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? 'Updating Job...' : 'Update Job'}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default UpdateJob;