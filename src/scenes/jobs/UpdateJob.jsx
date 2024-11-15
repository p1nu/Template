import React, { useState, useEffect } from 'react';
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
import ReactQuill from 'react-quill-new'; // Corrected import
import 'react-quill-new/dist/quill.snow.css'; // Corrected import path
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'; // Importing format from date-fns

const UpdateJob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    job_name: '',
    job_desc: '',
    job_salary: '',
    job_schedule: '',
    job_link: '',
    job_start_date: '',
    job_end_date: '',
    job_status_id: '',
    job_company_id: '',
    job_created_by_user_id: '',
    job_updated_by_user_id: '', // Added field for Updated By User ID
  });
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch job data by ID
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/job/${id}`);
        if (response.data && response.data.length > 0) {
          const fetchedJob = response.data[0];
          
          // Format the date fields to "yyyy-MM-dd"
          const formattedJob = {
            ...fetchedJob,
            job_start_date: fetchedJob.job_start_date
              ? format(new Date(fetchedJob.job_start_date), 'yyyy-MM-dd')
              : '',
            job_end_date: fetchedJob.job_end_date
              ? format(new Date(fetchedJob.job_end_date), 'yyyy-MM-dd')
              : '',
          };

          setJob(formattedJob);
        } else {
          setError('No job found with the provided ID');  
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        setError('Failed to fetch job data');
      }
    };

    // Fetch all companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3030/company/all');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };


    fetchJob();
    fetchCompanies();
  }, [id]);

  useEffect(() => {
    // Fetch company data by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/company/${job.job_company_id}`);
        setCompany(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    if (job.job_company_id) {
      fetchCompany();
    }
  }, [job.job_company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setJob((prevJob) => ({ ...prevJob, job_desc: value }));
  };

  const handleUpdateJob = async () => {
    // Basic validation
    if (
      !job.job_name ||
      !job.job_desc ||
      !job.job_salary ||
      !job.job_schedule ||
      !job.job_link ||
      !job.job_start_date ||
      !job.job_end_date ||
      !job.job_company_id ||
      !job.job_status_id ||
      !job.job_created_by_user_id ||
      !job.job_updated_by_user_id // Added validation for Updated By User ID
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await axios.put(`http://localhost:3030/job/update/${id}`, job);
      setError('Job updated successfully');
      setTimeout(() => {
        navigate('/jobs');
      }, 3000);
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Error updating job');
    }
  };

  // Reset error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header title="Update Job" subTitle="Modify the job details" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={2}
        bgcolor={colors.grey[800]}
        sx={{
          "& .ql-container.ql-snow": {
            width: '100% !important',
            height: '200px !important',
            border: '1px solid #000',
          },
          "& .ql-toolbar": {
            border: '1px solid #000',
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="4px"
          width="100%"
          boxShadow={3}
        >
          {/* Job Name and Company Selection */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }} // Responsive layout
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems="center"
          >
            {/* Job Name */}
            <Box display="flex" flexDirection="column" width={{ xs: '100%', sm: '48%' }}>
              <InputLabel
                htmlFor="job_name"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Job Name
              </InputLabel>
              <InputBase
                id="job_name"
                placeholder="Job Name"
                name="job_name"
                value={job.job_name || ''}
                onChange={handleChange}
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>

            {/* Company Selection */}
            <Box display="flex" flexDirection="column" width="48%">
              <InputLabel
                htmlFor="job_company_id"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Company
              </InputLabel>
              <FormControl fullWidth>
                <Select 
                  id="job_company_id"
                  name="job_company_id"
                  value={job.job_company_id || ''}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    border: '1px solid #000',
                    borderRadius: '2px',
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="" disabled>
                    {company.company_name || 'Select Company'}
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <InputBase
                id="job_company_id"
                placeholder="Company Name"
                name="job_company_id"
                value={companies.company_name || ''}
                onChange={handleChange}
                disabled
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              /> */}
            </Box>
          </Box>

          {/* Job Link */}
          <Box
            display="flex"
            flexDirection="column"
            margin={"10px 0"}
            width="100%"
          >
            <InputLabel
              htmlFor="job_link"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Job Link
            </InputLabel>
            <InputBase
              id="job_link"
              placeholder="Job Link"
              name="job_link"
              value={job.job_link || ''}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Job Description */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0 40px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_desc"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Job Description
            </InputLabel>
            <ReactQuill
              theme="snow"
              value={job.job_desc || ''}
              onChange={handleDescriptionChange}
              style={{
                height: '200px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Job Salary and Job Schedule */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            margin="10px 0"
            width="100%"
          >
            {/* Job Salary */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_salary"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Job Salary
              </InputLabel>
              <InputBase
                id="job_salary"
                placeholder="Job Salary"
                name="job_salary"
                type="number"
                value={job.job_salary || ''}
                onChange={handleChange}
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>

            {/* Job Schedule */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_schedule"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Job Schedule
              </InputLabel>
              <InputBase
                id="job_schedule"
                placeholder="Job Schedule"
                name="job_schedule"
                type="text"
                value={job.job_schedule || ''}
                onChange={handleChange}
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>
          </Box>

          {/* Job Start Date and Job End Date */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            margin="10px 0"
            width="100%"
          >
            {/* Job Start Date */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_start_date"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Job Start Date
              </InputLabel>
              <InputBase
                id="job_start_date"
                placeholder="Job Start Date"
                name="job_start_date"
                type="date"
                value={job.job_start_date || ''}
                onChange={handleChange}
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>

            {/* Job End Date */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_end_date"
                sx={{ color: colors.grey[100], mb: '5px' }}
              >
                Job End Date
              </InputLabel>
              <InputBase
                id="job_end_date"
                placeholder="Job End Date"
                name="job_end_date"
                type="date"
                value={job.job_end_date || ''}
                onChange={handleChange}
                sx={{
                  padding: '10px',
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>
          </Box>

          {/* Created By User ID */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_created_by_user_id"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Created By User ID
            </InputLabel>
            <InputBase
              id="job_created_by_user_id"
              placeholder="Created By User ID"
              name="job_created_by_user_id"
              value={job.job_created_by_user_id || ''}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          {/* Updated By User ID */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_updated_by_user_id"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Updated By User ID
            </InputLabel>
            <InputBase
              id="job_updated_by_user_id"
              placeholder="Updated By User ID"
              name="job_updated_by_user_id"
              value={job.job_updated_by_user_id || ''}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Job Status */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_status_id"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Job Status
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="job_status_id"
                name="job_status_id"
                value={job.job_status_id || ''}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: '1px solid #000',
                  borderRadius: '2px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateJob}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Job
          </Button>

          {/* Error/Success Message */}
          {error && (
            <Typography
              variant="body1"
              color={error.includes('successfully') ? 'green' : 'red'}
              mt={2}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateJob;