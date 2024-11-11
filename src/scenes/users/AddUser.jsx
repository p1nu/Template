import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, MenuItem, Select, FormControl } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState({ user_name: '', user_password: '', user_role_id: '' });
  const [error, setError] = useState('');

  const navegate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3030/user/new', user);
      setError('User added successfully');
      setUser({ user_name: '', user_password: '', user_role_id: '' }); // Reset form
      setTimeout(() => {
        navegate('/users');
      }, 3000); // Navigate to users page after 3 seconds
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Error adding user');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header title="Add New User" subTitle="Create a new user" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
        bgcolor={colors.grey[800]}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          boxShadow={3}
          width="50%"
        >
          <InputBase
            placeholder="Username"
            name="user_name"
            value={user.user_name}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid #000`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Password"
            name="user_password"
            type="password"
            value={user.user_password}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid #000`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <FormControl fullWidth sx={{ margin: '10px 0' }}>
            <Select
              placeholder='User Role'
              name="user_role_id"
              value={user.user_role_id}
              onChange={handleChange}
              displayEmpty
              sx={{
                border: `1px solid #000`,
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginTop: '10px',
              }}
            > 
              <MenuItem value="" disabled>User Role</MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="2">User</MenuItem>
              {/* <MenuItem value="3">Guest</MenuItem> */}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddUser}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add User
          </Button>
          {error && (
            <Typography variant="body1" color={error.includes('successfully') ? 'green' : 'red'} mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddUser;