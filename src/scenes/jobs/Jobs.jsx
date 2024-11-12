import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  InputBase,
  InputLabel,
  FormControl,
} from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";

// Styled-component for alignment and spacing
// const StyledBox = styled.div`
//   display: flex;
//   justify-content: ${({ $align }) => $align || "flex-start"};
//   align-items: center;
//   text-align: center;
//   width: 100%;
// `;

const Jobs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/job/all");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = jobs.filter((job) =>
      (job.job_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredJobs(results);
  }, [search, jobs]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:3030/job/delete/${id}`);
      const response = await axios.get("http://localhost:3030/job/all");
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const columns = [
    {
      name: "Job Name",
      selector: (row) => row.job_name,
      sortable: true,
      width: "20%",
    },
    { name: "Company", selector: (row) => row.job_company_id, sortable: true },
    { name: "Salary", selector: (row) => `$${row.job_salary}`, sortable: true },
    { name: "Schedule", selector: (row) => row.job_schedule, sortable: true },
    {
      name: "Status",
      selector: (row) => row.job_status_id,
      sortable: true,
      width: "50%",
      cell: (row) => {
        let status;

        if (row.job_status_id === 1) {
          status = "Active";
        } else if (row.job_status_id === 2) {
          status = "Inactive";
        }

        return (
          <Box display="flex" justifyContent="space-between" alignItems="center" textAlign="center" width="100%">
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/job/${row.job_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            {/* <Link to={`/job/details/${row.job_id}`}>
              <Button variant="outlined" color="primary" sx={{ m: 1 }}>
                Details
              </Button>
            </Link> */}
            <Button
              variant="outlined"
              color="error"
              sx={{ m: 1 }}
              onClick={() => handleDelete(row.job_id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  const customStyles = {
    header: {
      style: {
        backgroundColor: colors.grey[900],
        color: colors.grey[100],
      },
    },
    headCells: {
      style: {
        // backgroundColor: colors.grey[900],
        color: colors.grey[100],
        fontWeight: "bold",
        borderTop: `1px solid #000`, // Matching Companies.jsx
        borderBottom: `1px solid #000`, // Matching Companies.jsx
      },
    },
    cells: {
      style: {
        borderBottom: "1px solid #000", // Matching border color
      },
    },
  };

  // Subheader Component - Search Bar and Add Job Button
  const SubHeaderComponent = (
    <Box display="flex" alignItems="center">
      <InputBase
        placeholder="Search Name"
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
      <Link
        to="/add-job"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add Job
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Jobs" subTitle="Manage job postings" />
      <Box
        m="10px 0 0 0"
        height="auto"
        // border={`1px solid ${colors.grey[700]}`} // Matching border
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredJobs}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={SubHeaderComponent}
          customStyles={customStyles}
        />
      </Box>
    </Box>
  );
};

export default Jobs;
