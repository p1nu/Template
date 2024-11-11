import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockServices from '../data/mockServices'; // Import the mock data for services
import { Link, useParams } from "react-router-dom";
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

const ServiceCompany = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState({});

  useEffect(() => {
    // fetch services by company ID
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/service/company/${id}`);
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error('Error fetching data from database:', error);
        // Use mock data if there's an error
        setServices(mockServices);
        setFilteredServices(mockServices);
      }
    };
    fetchData();

    // fetch company by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error('Error fetching data from database:', error);
      }
    };
    fetchCompany();
  }, [id]);

  useEffect(() => {
    const result = services.filter((service) => {
      return (
        service.service_name &&
        service.service_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredServices(result);
  }, [search, services]);

  const columns = [
    { name: "ID", selector: (row) => row.service_id, sortable: true, width: "60px" },
    { name: "Name", selector: (row) => row.service_name, sortable: true },
    { name: "Description", selector: (row) => row.service_desc, sortable: true },
    { name: "Value", selector: (row) => row.service_value, sortable: true },
    { name: "Vision", selector: (row) => row.service_vision, sortable: true },
    { name: "Mission", selector: (row) => row.service_mission, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <StyledBox $align="space-between">
          <Link to={`/service/${row.service_id}`} style={{ marginLeft: "auto" }}>
            <Button variant="outlined" color="primary">
              Edit
            </Button>
          </Link>
          <Button variant="outlined" color="error" sx={{ m: 1 }}>
            Delete
          </Button>
        </StyledBox>
      ),
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
      <Header title="Services by Company" subTitle={`Manage services for : ${company.company_name}`} />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredServices}
          pagination
          highlightOnHover
          responsive
          striped
          subHeader
          subHeaderComponent={
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
              <Link to={`/add-service/${id}`} style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
                  Add Service
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

export default ServiceCompany;