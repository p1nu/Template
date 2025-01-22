import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
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
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// const API_BASE_URL = process.env.APP_API_URL;

// Styled-component for alignment and spacing (if needed)
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Services = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  // Fetch services by company ID
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/service/all`);
      setServices(response.data);
      setFilteredServices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Error fetching services");
    }
  };
  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/all`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Error fetching companies");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCompanies();
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
      name: "Actions",
      cell: (row) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Link to={`/banner/service/${row.service_id}`}>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.blueAccent[200] }}
            >
              Add Banner
            </Button>
          </Link>
          <Link to={`/service/${row.service_id}`}>
            <IconButton>
              <EditIcon sx={{ color: colors.blueAccent[400] }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(row.service_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "250px",
    },
    {
      name: "ID",
      selector: (row) => row.service_id,
      sortable: true,
      wrap: true,
      width: "80px",
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row.service_status_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        let status;

        if (row.service_status_id === 1) {
          status = "Active";
        } else if (row.service_status_id === 2) {
          status = "Inactive";
        }

        return <Typography color={colors.grey[100]}>{status}</Typography>;
      },
    },
    {
      name: "Company",
      selector: (row) => row.company_name,
      sortable: true,
      wrap: true,
    },
  ];

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    if (companyId) {
      const filtered = services.filter(
        (service) => service.service_company_id === companyId
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  };

    // Get the set of company IDs that have products
    const companyIdsWithService = new Set(
      services.map((service) => service.service_company_id)
    );
  
    // Filter companies to only include those that have products
    const filteredCompanies = companies.filter((company) =>
      companyIdsWithService.has(company.company_id)
    );

  return (
    <Box m={2}>
      <Header title="Services" subTitle="Manage services" />
      <Box
        display="flex"
        justifyContent="start"
        width="100%"
        gap={2}
        mb={2}
      ></Box>
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
            onClick={() => navigate("/add-service")}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add Service
          </Button>

          <InputBase
            placeholder="Search Services"
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
          <FormControl sx={{ width: "30%" }}>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              displayEmpty
              sx={{
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                "&:hover": {
                  border: "1px solid #000 !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="">All Companies</MenuItem>
              {filteredCompanies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <DataTable
          columns={columns}
          data={filteredServices}
          keyField="service_id"
          pageSize={services.length > 10 ? 10 : services.length}
          highlightOnHover
          pointerOnHover
          responsive
          // customStyles={customStyles}
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Services;
