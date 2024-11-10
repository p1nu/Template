import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, TextField, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockContacts from '../data/mockContacts'; // Import the mock data
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

// Example styled-component using transient props
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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = contacts.filter((contact) => {
      return (
        contact.name &&
        contact.name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredContacts(result);
  }, [search, contacts]);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <StyledBox $align="space-between">
          <Link to={`/contact/${row.id}`} style={{ marginLeft: "auto" }}>
            <Button variant="outlined" color="primary">
              Edit
            </Button>
          </Link>
          <Button variant="outlined" color="error" sx={{m: 1}}>
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
      <Header title="Contacts" subTitle="Manage contacts" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredContacts}
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
              <Link to="/add-contact" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{bgcolor: colors.blueAccent[200]}}>
                  Add Contact
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

export default Contact;