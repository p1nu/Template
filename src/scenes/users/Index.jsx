import React, { useState, useEffect, useContext } from 'react';
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
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";
import Header from "../../components/Header";
import { tokens } from '../../theme';
import { format } from 'date-fns'; // Imported format from date-fns
import mockUsers from '../data/mockData'; // Import the mock data for users
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import { AuthContext } from '../global/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled-component for alignment and spacing (if needed)
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Users = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token
        const response = await axios.get(`${API_BASE_URL}/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        // console.log(token);
        console.error('Error fetching data from database:', error);
        toast.error("Error fetching user data");
        // Optionally handle unauthorized access
        if (error.response && error.response.status === 401) {
          // Redirect to login or show a message
          navigate('/login');
        }
        // Use mock data if there's an error
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const result = users.filter((user) => {
      return (
        user.user_name &&
        user.user_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredUsers(result);
  }, [search, users]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/user/delete/${id}`);
      const response = await axios.get(`${API_BASE_URL}/user/all`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
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
          <Link to={`/user/${row.user_id}`}>
            <IconButton>
              <EditIcon sx={{ color: colors.blueAccent[400] }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(row.user_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: 'ID',
      selector: (row) => row.user_id,
      sortable: true,
      wrap: true,
      width: '80px'
    },
    {
      name: 'Name',
      selector: (row) => row.user_name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Access Level',
      selector: (row) => row.user_role_id,
      sortable: true,
      wrap: true,
      cell: (row) => {
        let role;

        if (row.user_role_id === 1) {
          role = 'Admin';
        } else if (row.user_role_id === 2) {
          role = 'User';
        }

        return (
          <Typography color={colors.grey[100]}>{role}</Typography>
        );
      },
    },
  ];

  return (
    <Box m={2}>
      <Header title="Users" subTitle="Manage users" />
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
            onClick={() => navigate("/add-user")}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add User
          </Button>

          <InputBase
            placeholder="Search Name"
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
          data={filteredUsers}
          keyField="user_id"
          pageSize={users.length > 10 ? 10 : users.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme='colored' autoClose={2000}/>
    </Box>
  );
};

export default Users;
