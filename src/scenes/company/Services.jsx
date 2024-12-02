import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  Typography,
  useTheme,
} from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import { tokens } from "../../theme";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = process.env.APP_API_URL;

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
  const [company, setCompany] = useState({});

  // Fetch services by company ID
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/service/all`
      );
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Error fetching services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const results = services.filter((service) =>
      (service.service_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredServices(results);
  }, [search, services]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/service/delete/${id}`);
      fetchServices();
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Error deleting service");
    }
  };

  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      width: "auto",
    },
    {
      name: "Description",
      selector: (row) => row.service_desc,
      sortable: true,
      width: "15%",
    },
    {
      name: "Status",
      selector: (row) => row.service_status_id,
      sortable: true,
      width: "60%",
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
            <Box display={"flex"} justifyContent={"center"} gap={"10px"}>
              <Link to={`/banner/service/${row.service_id}`}>
                <Button variant="outlined" color="primary">
                  Add Banner
                </Button>
              </Link>
              <Link
                to={`/service/${row.service_id}`}
                style={{ marginLeft: "auto" }}
              >
                <Button variant="outlined" color="primary">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(row.service_id)}
              >
                Delete
              </Button>
            </Box>
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
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Services;
