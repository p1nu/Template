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

const Contact = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/contact/all");
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error("Error fetching data from database:", error);
        toast.error("Failed to fetch contacts");
      }
    };

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
      await axios.delete(`http://localhost:3030/contact/delete/${id}`);
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
      name: "ID",
      selector: (row) => row.contact_id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.contact_phonenumber,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.contact_email,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.contact_address,
      sortable: true,
    },
    {
      name: "Telegram",
      selector: (row) => row.contact_telegram,
      sortable: true,
    },
    {
      name: "Website",
      selector: (row) => row.contact_website,
      sortable: true,
    },
    {
      name: "Company ID",
      selector: (row) => row.contact_company_id,
      sortable: true,
    },
    {
      name: "Service ID",
      selector: (row) => row.contact_service_id,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.contact_id,
      sortable: false,
      cell: (row) => (
        <Box display="flex" gap="10px">
          <Link to={`/contact/edit/${row.contact_id}`}>
            <Button variant="outlined" color="primary">
              Edit
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(row.contact_id)}
          >
            Delete
          </Button>
        </Box>
      ),
      width: "200px",
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
        placeholder="Search Phone or Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          ml: 2,
          border: "1px solid",
          borderColor: colors.grey[700],
          borderRadius: "4px",
          width: "250px",
          height: "35px",
          padding: "10px",
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <Link
        to="/add-contact"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add Contact
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Contacts" subTitle="Manage your contacts" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredContacts}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={SubHeaderComponent}
          customStyles={customStyles}
        />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Contact;