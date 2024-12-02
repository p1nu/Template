import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase, InputLabel } from "@mui/material";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";
import Header from "../../components/Header";
import { tokens } from '../../theme';
import { format } from 'date-fns'; // Imported format from date-fns

const CSR = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [csr, setCSR] = useState([]);
  const [filteredCSR, setFilteredCSR] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCSR = async () => {
      try {
        const response = await axios.get("http://localhost:3030/csr/all");
        setCSR(response.data);
        setFilteredCSR(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching CSR:", error);
        setError("Error fetching CSR data");
      }
    };
    fetchCSR();
  }, []);

  useEffect(() => {
    const results = csr.filter((entry) =>
      (entry.csr_title || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCSR(results);
  }, [search, csr]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3030/csr/delete/${id}`);
      const response = await axios.get("http://localhost:3030/csr/all");
      setCSR(response.data);
      setFilteredCSR(response.data);
      setError("CSR deleted successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting CSR:", error);
      setError("Error deleting CSR");
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.csr_id, sortable: true },
    { name: "Title", selector: (row) => row.csr_name, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          textAlign="center"
          width="100%"
        >
          <Link to={`/mission/${row.csr_id}`} style={{ marginLeft: "auto", textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              View
            </Button>
          </Link>
          <Link to={`/csr/${row.csr_id}`} style={{ marginLeft: "auto", textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              Update
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            sx={{ m: 1 }}
            onClick={() => handleDelete(row.csr_id)}
          >
            Delete
          </Button>
        </Box>
      ),
      sortable: false,
      width: "50%",
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

  // Subheader Component - Search Bar and Add CSR Button
  const SubHeaderComponent = (
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
          width: "200px",
          height: "35px",
          padding: "10px",
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <Link
        to="/add-csr"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add CSR
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="CSR" subTitle="Manage CSR entries" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredCSR}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={SubHeaderComponent}
          customStyles={customStyles}
        />
        {/* Error/Success Message */}
        {error && (
          <Typography
            variant="body1"
            color={error.includes('successfully') ? 'green' : 'red'}
            mt={2}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CSR;