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
import axios from "axios";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.error("Failed to load companies");
      }
    };
    fetchData();
  }, [API_BASE_URL]);

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
      toast.success("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Error deleting company");
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
        >
          <Link to={`/banner/company/${row.company_id}`}>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.blueAccent[200] }}
            >
              Add Banner
            </Button>
          </Link>
          <Link to={`/company/${row.company_id}`}>
            <IconButton>
              <EditIcon sx={{ color: colors.blueAccent[400] }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(row.company_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "250px",
    },
    {
      name: "ID",
      selector: (row) => row.company_id,
      sortable: true,
      wrap: true,
      width: "80px",
    },
    {
      name: "Logo",
      selector: (row) => row.company_logo,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <Box height={50} width={50}>

        <img
          src={`${API_BASE_URL}/uploads/${row.company_logo}`}
          alt={row.company_name}
          style={{height: "100%", width: "100%", objectFit: "contain"}}
          />
          </Box>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.company_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Acronym",
      selector: (row) => row.company_acronym,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row.company_status_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        let status;

        if (row.company_status_id === 1) {
          status = "Active";
        } else if (row.company_status_id === 2) {
          status = "Inactive";
        }

        return <Typography color={colors.grey[100]}>{status}</Typography>;
      },
    },
  ];

  return (
    <Box m={2}>
      <Header title="Companies" subTitle="Manage companies" />
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
            onClick={() => navigate("/add-company")}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add Company
          </Button>
          <InputBase
            placeholder="Search Companies"
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
        </Box>
        <DataTable
          columns={columns}
          data={filteredCompanies}
          keyField="company_id"
          pageSize={companies.length > 10 ? 10 : companies.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Companies;
