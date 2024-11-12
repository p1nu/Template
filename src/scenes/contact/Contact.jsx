import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockContacts from '../data/mockContacts'; // Import the mock data
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

// Styled-component for alignment and spacing
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Contact = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/contact/all");
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error('Error fetching data from database:', error);
        // Use mock data if there's an error
        setContacts(mockContacts);
        setFilteredContacts(mockContacts);
        setError("Error fetching contacts from the server. Displaying mock data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = contacts.filter((contact) =>
      (contact.contact_name || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredContacts(results);
  }, [search, contacts]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:3030/contact/delete/${id}`);
      const response = await axios.get("http://localhost:3030/contact/all");
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      console.error("Error deleting contact:", error);
      setError("Error deleting contact");
    }
  };

  const columns = [
    {
      name: "Contact Name",
      selector: (row) => row.contact_name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Email",
      selector: (row) => row.contact_email,
      sortable: true,
      width: "25%",
    },
    {
      name: "Phone",
      selector: (row) => row.contact_phone,
      sortable: true,
      width: "15%",
    },
    {
      name: "Company",
      selector: (row) => row.contact_company_id,
      sortable: true,
      cell: (row) => {
        const [company, setCompany] = useState({
          company_name: "",
        });

        useEffect(() => {
          // Fetch company name
          const fetchCompany = async () => {
            try {
              const response = await axios.get(
                `http://localhost:3030/company/${row.contact_company_id}`
              );
              const companyData = response.data[0];
              setCompany(companyData);
            } catch (error) {
              console.error("Error fetching company:", error);
            }
          };
          if (row.contact_company_id) {
            fetchCompany();
          }
        }, [row.contact_company_id]);

        return (
          <Typography color={colors.grey[100]}>{company.company_name}</Typography>
        );
      },
      width: "20%",
    },
    {
      name: "Status",
      selector: (row) => row.contact_status_id,
      sortable: true,
      width: "20%",
      cell: (row) => {
        let status;

        if (row.contact_status_id === 1) {
          status = "Active";
        } else if (row.contact_status_id === 2) {
          status = "Inactive";
        }

        return (
          <Box display="flex" justifyContent="space-between" alignItems="center" textAlign="center" width="100%">
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/contact/${row.contact_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ m: 1 }}
              onClick={() => handleDelete(row.contact_id)}
            >
              Delete
            </Button>
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
        placeholder="Search Contact Name"
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
      {/* Error Message */}
      {error && (
        <Typography
          variant="body1"
          color="red"
          mt={2}
          textAlign="center"
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Contact;