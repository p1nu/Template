import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, TextField, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { tokens } from '../../theme';
import mockUsers from '../data/mockData'; // Import the mock data
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
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

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/user/all");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching data from database:', error);
        // Use mock data if there's an error
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = users.filter((user) => {
      return (
        user.user_name &&
        user.user_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredUsers(result);
  }, [search, users]);

  const columns = [
    { name: "ID", selector: (row) => row.user_id, sortable: true, width: "60px" },
    { name: "Name", selector: (row) => row.user_name, sortable: true },
    {
      name: "Access Level",
      selector: (row) => row.user_role_id,
      sortable: true,
      width: "60%",
      cell: (row) => {
        let accessLevel;

        if (row.user_role_id === 1) {
          accessLevel = "Admin";
        } else if (row.user_role_id === 2) {
          accessLevel = "User";
        } else {
          accessLevel = "Guest";
        }

        return (
          <StyledBox $align="space-between">
            <Typography color={colors.grey[100]}>{accessLevel}</Typography>
            <Link to={`/user/${row.user_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="outlined" color="error" sx={{m: 1}}>
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
        // backgroundColor: colors.grey[700], // Set your desired background color here
        // color: colors.grey[100], // Set your desired text color here
        borderTop: `1px solid ${colors.grey[800]}`,
      },
    },
    // subHeader: {
    //   style: {
    //     backgroundColor: colors.grey[700], // Set your desired background color here
    //   },
    // },
  };

  return (
    <Box m="20px">
      <Header title="Users" subTitle="Manage users" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredUsers}
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
              <Link to="/add-user" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{bgcolor: colors.blueAccent[200]}}>
                  Add User
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

export default Users;
