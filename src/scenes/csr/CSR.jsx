import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import mockCSR from '../data/mockCSR'; // Import the mock data for CSR
import { tokens } from '../../theme';

// Example styled-component using transient props
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"}; 
  align-items: center;
  text-align: center;
  width: 100%;
`;

const CSR = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [csr, setCSR] = useState([]);
  const [filteredCSR, setFilteredCSR] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Use mock data for CSR
    setCSR(mockCSR);
    setFilteredCSR(mockCSR);
  }, []);

  useEffect(() => {
    const result = csr.filter((activity) => {
      return (
        activity.csr_title &&
        activity.csr_title.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredCSR(result);
  }, [search, csr]);

  const columns = [
    { name: "ID", selector: (row) => row.csr_id, sortable: true },
    { name: "Title", selector: (row) => row.csr_title, sortable: true },
    { name: "Date", selector: (row) => row.csr_date, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <StyledBox $align="space-between">
          <Link to={`/csr/${row.csr_id}`} style={{ marginLeft: "auto" }}>
            <Button variant="outlined" color="primary">
              View
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
      <Header title="CSR Activities" subTitle="Manage CSR activities" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredCSR}
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
              <Link to="/add-csr" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
                  Add CSR
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

export default CSR;