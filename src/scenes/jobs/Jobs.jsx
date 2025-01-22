import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

// Styled-component for alignment and spacing (if needed)
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Jobs = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

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

    // Fetch companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Error fetching companies");
      }
    };

    fetchData();
    fetchCompanies();
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

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap={1}
        >
          <Link to={`/job/${row.job_id}`}>
            <IconButton>
              <EditIcon sx={{ color: colors.blueAccent[400] }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(row.job_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: "Job Name",
      selector: (row) => row.job_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Schedule",
      selector: (row) => row.job_schedule,
      sortable: true,
      wrap: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.job_start_date,
      sortable: true,
      wrap: true,
    },
    {
      name: "End Date",
      selector: (row) => row.job_end_date,
      sortable: true,
      wrap: true,
    },
    {
      name: "Company",
      selector: (row) => row.job_company_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        const company = companies.find((company) => company.company_id === row.job_company_id);
        return company ? company.company_name : "N/A";
      }
    },
  ];

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    if (companyId) {
      const filtered = jobs.filter(
        (job) => job.job_company_id === companyId
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  };

  return (
    <Box m={2}>
      <Header title="Jobs" subTitle="Manage your job postings" />
      <Box
        display="flex"
        justifyContent="start"
        width="100%"
        gap={2}
        mb={2}
      ></Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={2}
        bgcolor={colors.grey[800]}
      >
        <Box display="flex" justifyContent="start" width="100%" mb={2} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-job")}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add Job
          </Button>

          <InputBase
            placeholder="Search Jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              padding: "10px",
              border: "1px solid #000",
              borderRadius: "4px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
              width: "30%",
            }}
          />
          <FormControl sx={{ width: "30%" }}>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              displayEmpty
              sx={{
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                "&:hover": {
                  border: "1px solid #000 !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="">All Companies</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <DataTable
          columns={columns}
          data={filteredJobs}
          keyField="job_id"
          pageSize={jobs.length > 10 ? 10 : jobs.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Jobs;
