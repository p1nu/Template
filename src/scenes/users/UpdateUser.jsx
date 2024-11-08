import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, MenuItem, Select, FormControl } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const UpdateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [user, setUser] = useState({ user_name: '', user_password: '', user_role_id: '' });

  useEffect(() => {
    // Fetch user data by ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/user/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3030/user/${id}`, user);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Box m={2}>
      <Header title="Update User" subTitle={`${user.user_name}`} />
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
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
      >
        <Typography variant="h4" color={colors.grey[100]} mb={2}>
          Update User
        </Typography>
        <InputBase
          placeholder="Username"
          name="user_name"
          value={user.user_name}
          onChange={handleChange}
          sx={{
            width: '100%',
            margin: '10px 0',
            padding: '10px',
            border: `1px solid ${colors.grey[800]}`,
            borderRadius: '4px',
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
            border: `1px solid ${colors.grey[800]}`,
            borderRadius: '4px',
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
          }}
        />
        <FormControl fullWidth sx={{ margin: '10px 0' }}>
          <Select
            name="user_role_id"
            value={user.user_role_id}
            onChange={handleChange}
            sx={{
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '4px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
              marginTop: '10px',
            }}
          >
            <MenuItem value="1">Admin</MenuItem>
            <MenuItem value="2">User</MenuItem>

          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
          sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
        >
          Update
        </Button>
      </Box>
    </Box>
  </Box>
  );
};

export default UpdateUser;