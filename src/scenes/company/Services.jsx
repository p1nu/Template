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
import mockServices from "../data/mockServices";

// Styled-component for alignment and spacing (if needed)
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Services = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/service/all");
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Use mock data if there's an error
        setServices(mockServices);
        setFilteredServices(mockServices);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = services.filter((service) =>
      (service.service_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredServices(results);
  }, [search, services]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:3030/service/delete/${id}`);
      const response = await axios.get("http://localhost:3030/service/all");
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      width: "25%",
    },
    {
      name: "Associated Job",
      selector: (row) => row.service_job_id,
      sortable: true,
      cell: (row) => {
        const [job, setJob] = useState({
          job_name: "",
        });

        useEffect(() => {
          const fetchJob = async () => {
            try {
              const response = await axios.get(
                `http://localhost:3030/job/${row.service_job_id}`
              );
              const jobData = response.data[0];
              setJob(jobData);
            } catch (error) {
              console.error("Error fetching job:", error);
            }
          };
          if (row.service_job_id) {
            fetchJob();
          }
        }, [row.service_job_id]);

        return (
          <Typography color={colors.grey[100]}>{job.job_name}</Typography>
        );
      },
    },
    {
      name: "Description",
      selector: (row) => row.service_desc,
      sortable: true,
      width: "30%",
    },
    {
      name: "Status",
      selector: (row) => row.service_status_id,
      sortable: true,
      width: "15%",
      cell: (row) => {
        let status;

        if (row.service_status_id === 1) {
          status = "Active";
        } else if (row.service_status_id === 2) {
          status = "Inactive";
        }

        return (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            textAlign="center"
            width="100%"
          >
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/service/${row.service_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ m: 1 }}
              onClick={() => handleDelete(row.service_id)}
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
        color: colors.grey[100],
        fontWeight: "bold",
        borderTop: `1px solid #000`,
        borderBottom: `1px solid #000`,
      },
    },
    cells: {
      style: {
        borderBottom: "1px solid #000",
      },
    },
  };

  const SubHeaderComponent = (
    <Box display="flex" alignItems="center">
      <InputBase
        placeholder="Search Service Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          ml: 2,
          border: "1px solid",
          borderColor: colors.grey[700],
          borderRadius: "4px",
          width: "200px",
          height: "35px",
          padding: "10px",
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <Link
        to="/add-service"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add Service
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Services" subTitle="Manage services" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredServices}
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

export default Services;