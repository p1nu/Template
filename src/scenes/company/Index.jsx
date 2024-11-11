import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockCompanies from '../data/mockDataCompany'; // Import the mock data for companies
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

const Companies = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/company/all");
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error('Error fetching data from database:', error);
        // Use mock data if there's an error
        setCompanies(mockCompanies);
        setFilteredCompanies(mockCompanies);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = companies.filter((company) => {
      return (
        company.company_name &&
        company.company_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredCompanies(result);
  }, [search, companies]);

  const columns = [
    { name: "ID", selector: (row) => row.company_id, sortable: true, width: "60px" },
    { name: "Name", selector: (row) => row.company_name, sortable: true },
    { name: "Acronym", selector: (row) => row.company_acronym, sortable: true },
    {
      name: "Status",
      selector: (row) => row.company_status_id,
      sortable: true,
      cell: (row) => {
        let status;

        if (row.company_status_id === 1) {
          status = "Active";
        } else if (row.company_status_id === 2) {
          status = "Inactive";
        }

        return (
          <StyledBox $align="space-between">
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/company/${row.company_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Link to={`/company/service/${row.company_id}`}>
              <Button variant="outlined" color="primary" sx={{ m: 1 }}>
                Services
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
      <Header title="Companies" subTitle="Manage companies" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredCompanies}
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
              <Link to="/add-company" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
                  Add Company
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

export default Companies;
