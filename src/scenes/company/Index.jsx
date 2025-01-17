import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import mockCompanies from "../data/mockDataCompany"; // Import the mock data for companies
// const API_BASE_URL = process.env.APP_API_URL;

const Companies = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error("Error fetching data from database:", error);
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

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/company/delete/${id}`);
      const response = await axios.get(`${API_BASE_URL}/company/all`);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.company_id,
      sortable: true,
      width: "60px",
    },
    { name: "Name", selector: (row) => row.company_name, sortable: true },
    { name: "Acronym", selector: (row) => row.company_acronym, sortable: true },
    {
      name: "Status",
      selector: (row) => row.company_status_id,
      sortable: true,
      width: "50%",
      cell: (row) => {
        let status;

        if (row.company_status_id === 1) {
          status = "Active";
        } else if (row.company_status_id === 2) {
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
              <Link
                to={`/banner/company/${row.company_id}`}
                // style={{ marginLeft: "auto" }}
              >
                <Button variant="outlined" color="primary">
                  Add Banner
                </Button>
              </Link>
              <Link
                to={`/company/${row.company_id}`}
                // style={{ marginLeft: "auto" }}
              >
                <Button variant="outlined" color="primary">
                  Edit
                </Button>
              </Link>
              <Link to={`/company/service/${row.company_id}`}>
                <Button variant="outlined" color="primary">
                  Services
                </Button>
              </Link>
              <Link to={`/products`}>
                <Button variant="outlined" color="primary">
                  Products
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                // sx={{ m: 1 }}
                onClick={() => handleDelete(row.company_id)}
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
        to="/add-company"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add Company
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Companies" subTitle="Manage companies" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredCompanies}
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

export default Companies;
