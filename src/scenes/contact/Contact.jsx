import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputBase,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import DataTable from "react-data-table-component";
import axios from "axios";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Styled-component for alignment and spacing (if needed)
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Contact = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [companyies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/contact/all`);
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error("Error fetching data from database:", error);
        toast.error("Failed to fetch contacts");
      }
    };

    // fetch companies name
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching data from database:", error);
        toast.error("Failed to fetch companies");
      }
    };

    // fetch services name
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/all`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching data from database:", error);
        toast.error("Failed to fetch services");
      }
    };

    fetchServices();
    fetchCompanies();
    fetchData();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.contact_phonenumber.toLowerCase().includes(search.toLowerCase()) ||
        contact.contact_email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [search, contacts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/contact/delete/${id}`);
      toast.success("Contact deleted successfully");

      // Remove the deleted contact from state
      setContacts(contacts.filter((contact) => contact.contact_id !== id));
      setFilteredContacts(filteredContacts.filter((contact) => contact.contact_id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
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
          gap={1}
        >
          <Link to={`/contact/${row.contact_id}`}>
            <IconButton>
              <EditIcon sx={{ color: colors.blueAccent[400] }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(row.contact_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: "ID",
      selector: (row) => row.contact_id,
      sortable: true,
      wrap: true,
      width: "80px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.contact_phonenumber,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => row.contact_email,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Address",
    //   selector: (row) => row.contact_address,
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Telegram",
      selector: (row) => row.contact_telegram,
      sortable: true,
      wrap: true,
    },
    {
      name: "Website",
      selector: (row) => row.contact_website,
      sortable: true,
      wrap: true,
    },
    {
      name: "Company ID",
      selector: (row) => row.contact_company_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        const company = companyies.find((company) => company.company_id === row.contact_company_id);
        return company ? company.company_name : "N/A";
      }
    },
    {
      name: "Service ID",
      selector: (row) => row.contact_service_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        const service = services.find((service) => service.service_id === row.contact_service_id);
        return service ? service.service_name : "N/A";
      }
    },
  ];

  return (
    <Box m={2}>
      <Header title="Contacts" subTitle="Manage your contacts" />
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
            onClick={() => navigate("/add-contact")}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add Contact
          </Button>

          <InputBase
            placeholder="Search Phone or Email"
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
          data={filteredContacts}
          keyField="contact_id"
          pageSize={contacts.length > 10 ? 10 : contacts.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Contact;