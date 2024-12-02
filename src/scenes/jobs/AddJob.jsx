import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputBase,
} from "@mui/material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.APP_API_URL;

const AddJob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [job, setJob] = useState({
    job_name: "",
    job_desc: "",
    job_salary: "",
    job_schedule: "",
    job_link: "",
    job_start_date: "",
    job_end_date: "",
    job_company_id: "",
    job_created_by_user_id: "",
  });
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setJob((prevJob) => ({ ...prevJob, job_desc: value }));
  };

  const handleAddJob = async () => {
    try {
      await axios.post(`${API_BASE_URL}job/new`, job);
      setError("Job added successfully");
      setJob({
        job_name: "",
        job_desc: "",
        job_salary: "",
        job_schedule: "",
        job_link: "",
        job_start_date: "",
        job_end_date: "",
        job_company_id: "",
        job_created_by_user_id: "",
      });
      setTimeout(() => {
        navigate("/jobs");
      }, 3000);
    } catch (error) {
      console.error("Error adding job:", error);
      setError("Error adding job");
    }
  };

  useEffect(() => {
    // Fetch company data
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header title="Add New Job" subTitle="Create a new job posting" />
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
            width: "100% !important",
            height: "84% !important",
            border: "1px solid #000",
          },
          "& .ql-toolbar": {
            border: "1px solid #000",
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
          borderRadius="2px"
          width="100%"
          boxShadow={3}
        >
          {/* Job Name */}
          <Box
            display="flex"
            justifyContent="space-between"
            gap="20px"
            width="100%"
            alignItems={"center"}
          >
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="job_name"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Job Name
              </InputLabel>
              <InputBase
                id="job_name"
                placeholder="Job Name"
                name="job_name"
                value={job.job_name}
                onChange={handleChange}
                sx={{
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>
            {/* Company Selection */}
            <Box display="flex" flexDirection="column" width="100%">
              <InputLabel
                htmlFor="job_company_id"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Company
              </InputLabel>
              <FormControl fullWidth>
                <Select
                  id="job_company_id"
                  name="job_company_id"
                  value={job.job_company_id}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    border: `1px solid #000`,
                    borderRadius: "2px",
                    backgroundColor: colors.grey[900],
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Company
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem
                      key={company.company_id}
                      value={company.company_id}
                    >
                      {company.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          {/* Job Link */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_link"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Job Link
            </InputLabel>
            <InputBase
              id="job_link"
              placeholder="Job Link"
              name="job_link"
              value={job.job_link}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Job Description */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="job_desc"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Job Description
            </InputLabel>
            <ReactQuill
              theme="snow"
              value={job.job_desc}
              onChange={handleDescriptionChange}
              style={{
                height: "200px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Job Salary and Job Schedule on the Same Line */}
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
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Job Salary
              </InputLabel>
              <InputBase
                id="job_salary"
                placeholder="Job Salary"
                name="job_salary"
                type="number"
                value={job.job_salary}
                onChange={handleChange}
                sx={{
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>

            {/* Job Schedule */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_schedule"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Job Schedule
              </InputLabel>
              <InputBase
                id="job_schedule"
                placeholder="Job Schedule"
                name="job_schedule"
                type="text"
                value={job.job_schedule}
                onChange={handleChange}
                sx={{
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>
          </Box>

          {/* Job Start Date and Job End Date on the Same Line */}
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
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Job Start Date
              </InputLabel>
              <InputBase
                id="job_start_date"
                placeholder="Job Start Date"
                name="job_start_date"
                type="date"
                value={job.job_start_date}
                onChange={handleChange}
                sx={{
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              />
            </Box>

            {/* Job End Date */}
            <Box display="flex" flexDirection="column" flex={1}>
              <InputLabel
                htmlFor="job_end_date"
                sx={{ color: colors.grey[100], mb: "5px" }}
              >
                Job End Date
              </InputLabel>
              <InputBase
                id="job_end_date"
                placeholder="Job End Date"
                name="job_end_date"
                type="date"
                value={job.job_end_date}
                onChange={handleChange}
                fullWidth
                sx={{
                  padding: "10px",
                  border: `1px solid #000`,
                  borderRadius: "2px",
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
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Created By User ID
            </InputLabel>
            <InputBase
              id="job_created_by_user_id"
              placeholder="Created By User ID"
              name="job_created_by_user_id"
              value={job.job_created_by_user_id}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddJob}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Job
          </Button>

          {/* Error/Success Message */}
          {error && (
            <Typography
              variant="body1"
              color={error.includes("successfully") ? "green" : "red"}
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

export default AddJob;
