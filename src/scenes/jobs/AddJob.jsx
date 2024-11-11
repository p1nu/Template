import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, MenuItem, Select, FormControl, TextField } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const AddJob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [job, setJob] = useState({
    job_title: '',
    job_description: '',
    job_requirements: '',
    job_status_id: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleAddJob = async () => {
    try {
      await axios.post('http://localhost:3030/job', job);
      setError('Job added successfully');
      setJob({
        job_title: '',
        job_description: '',
        job_requirements: '',
        job_status_id: '',
      }); // Reset form
    } catch (error) {
      console.error('Error adding job:', error);
      setError('Error adding job');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header title="Add New Job" subTitle="Create a new job" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
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
          borderRadius="2px"
          width="50%" 
          boxShadow={3}
        >
          <Typography variant="h4" color={colors.grey[100]} mb={2}>
            Add Job
          </Typography>
          <InputBase
            placeholder="Job Title"
            name="job_title"
            value={job.job_title}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <TextField
            placeholder="Job Description"
            name="job_description"
            value={job.job_description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: '2px',
                padding: '10px',
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: '100%',
              margin: '10px 0',
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <TextField
            placeholder="Job Requirements"
            name="job_requirements"
            value={job.job_requirements}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: '2px',
                padding: '10px',
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: '100%',
              margin: '10px 0',
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <FormControl fullWidth sx={{ margin: '10px 0' }}>
            <Select
              name="job_status_id"
              value={job.job_status_id}
              onChange={handleChange}
              sx={{
                border: `1px solid ${colors.grey[800]}`,
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginTop: '10px',
              }}
            >
              <MenuItem value="1">Open</MenuItem>
              <MenuItem value="2">Closed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddJob}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Job
          </Button>
          {error && (
            <Typography variant="body1" color={error.includes('successfully') ? 'green' : 'red'} mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddJob;