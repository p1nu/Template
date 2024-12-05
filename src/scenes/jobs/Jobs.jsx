import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Jobs = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/job/all`);
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs.");
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  useEffect(() => {
    const results = jobs.filter((job) =>
      (job.job_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredJobs(results);
  }, [search, jobs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.put(`${API_BASE_URL}/job/delete/${id}`);
      toast.success("Job deleted successfully.");
      setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== id));
      setFilteredJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job.");
    }
  };

  return (
    <Box m={2}>
      <Header title="Jobs" subTitle="Manage your job postings" />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <InputBase
          placeholder="Search Jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            padding: "10px",
            width: "300px",
            border: "1px solid #000",
            borderRadius: "4px",
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
          }}
        />
        <Button
          variant="contained"
          component={Link}
          to="/add-job"
          sx={{
            backgroundColor: colors.blueAccent[500],
            "&:hover": { backgroundColor: colors.blueAccent[700] },
          }}
        >
          Add New Job
        </Button>
      </Box>

      <Box
        component="table"
        width="100%"
        borderCollapse="collapse"
        bgcolor={colors.grey[800]}
      >
        <thead>
          <tr>
            <Box component="th" sx={{ padding: "12px", textAlign: "left", color: colors.grey[100] }}>
              Job Name
            </Box>
            <Box component="th" sx={{ padding: "12px", textAlign: "left", color: colors.grey[100] }}>
              Schedule
            </Box>
            <Box component="th" sx={{ padding: "12px", textAlign: "left", color: colors.grey[100] }}>
              Start Date
            </Box>
            <Box component="th" sx={{ padding: "12px", textAlign: "left", color: colors.grey[100] }}>
              End Date
            </Box>
            <Box component="th" sx={{ padding: "12px", textAlign: "center", color: colors.grey[100] }}>
              Actions
            </Box>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <Box
              component="tr"
              key={job.job_id}
              sx={{
                "&:nth-of-type(even)": {
                  backgroundColor: colors.grey[700],
                },
              }}
            >
              <Box component="td" sx={{ padding: "12px", color: colors.grey[100] }}>
                {job.job_name}
              </Box>
              <Box component="td" sx={{ padding: "12px", color: colors.grey[100] }}>
                {job.job_schedule}
              </Box>
              <Box component="td" sx={{ padding: "12px", color: colors.grey[100] }}>
                {job.job_start_date}
              </Box>
              <Box component="td" sx={{ padding: "12px", color: colors.grey[100] }}>
                {job.job_end_date}
              </Box>
              <Box
                component="td"
                sx={{
                  padding: "12px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <IconButton
                  component={Link}
                  to={`/job/${job.job_id}`}
                  sx={{ color: colors.blueAccent[300] }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(job.job_id)}
                  sx={{ color: colors.redAccent[300] }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Jobs;
