import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockJobs from '../data/mockJobs'; // Import the mock data for jobs
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";

// Example styled-component using transient props
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Jobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/jobs/all");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Error fetching data from database:', error);
        // Use mock data if there's an error
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = jobs.filter((job) => {
      return (
        job.jobs_title &&
        job.jobs_title.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredJobs(result);
  }, [search, jobs]);

  const columns = [
    { name: "ID", selector: (row) => row.jobs_id, sortable: true, width: "50px" },
    { name: "Title", selector: (row) => row.jobs_title, sortable: true },
    { name: "Description", selector: (row) => row.jobs_description, sortable: true },
    {
      name: "Status",
      selector: (row) => row.jobs_status_id,
      sortable: true,
      cell: (row) => {
        let status;

        if (row.jobs_status_id === 1) {
          status = "Active";
        } else if (row.jobs_status_id === 2) {
          status = "Inactive";
        }

        return (
          <StyledBox $align="space-between">
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/job/${row.jobs_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="outlined" color="error" sx={{ m: 1 }}>
              Delete
            </Button>
          </StyledBox>
        );
      },
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        borderTop: `1px solid ${colors.grey[800]}`,
      },
    },
  };

  return (
    <Box m="20px">
      <Header title="Jobs" subTitle="Manage jobs" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredJobs}
          pagination
          highlightOnHover
          responsive
          striped
          subHeader
          subHeaderComponent={
            <Box display="flex" alignItems="center">
              <InputBase
                placeholder="Search Title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  ml: 2,
                  border: "1px solid",
                  borderColor: colors.grey[700],
                  borderRadius: "4px",
                  width: "150px",
                  height: "35px",
                  padding: "10px",
                  color: colors.grey[100],
                  bgcolor: colors.grey[900],
                }}
              />
              <Link to="/add-job" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
                  Add Job
                </Button>
              </Link>
            </Box>
          }
          customStyles={customStyles}
        />
      </Box>
    </Box>
  );
};

export default Jobs;