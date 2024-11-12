import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  InputBase,
} from '@mui/material';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { tokens } from '../../theme';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import mockUsers from '../data/mockData'; // Import the mock data for users

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3030/user/all');
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

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:3030/user/delete/${id}`);
      const response = await axios.get('http://localhost:3030/user/all');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    { name: 'ID', selector: (row) => row.user_id, sortable: true, width: '60px' },
    { name: 'Name', selector: (row) => row.user_name, sortable: true },
    {
      name: 'Access Level',
      selector: (row) => row.user_role_id,
      sortable: true,
      width: '50%',
      cell: (row) => {
        let role;

        if (row.user_role_id === 1) {
          role = 'Admin';
        } else if (row.user_role_id === 2) {
          role = 'User';
        }

        return (
          <Box display="flex" justifyContent="space-between" alignItems="center" textAlign="center" width="100%">
            <Typography color={colors.grey[100]}>{role}</Typography>
            <Link to={`/user/${row.user_id}`} style={{ marginLeft: 'auto' }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ m: 1 }}
              onClick={() => handleDelete(row.user_id)}
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
        fontWeight: 'bold',
        borderTop: `1px solid #000`,
        borderBottom: `1px solid #000`,
      },
    },
    cells: {
      style: {
        borderBottom: '1px solid #000',
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
          border: '1px solid',
          borderColor: colors.grey[700],
          borderRadius: '4px',
          width: '150px',
          height: '35px',
          padding: '10px',
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <Link to="/add-user" style={{ textDecoration: 'none', marginLeft: '10px' }}>
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add User
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Users" subTitle="Manage users" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredUsers}
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

export default Users;
