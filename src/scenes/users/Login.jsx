import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, InputBase, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { AuthContext } from '../global/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import { useTimeout } from '@mui/x-data-grid/internals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = process.env.APP_API_URL;

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user_name, setUser_name] = useState('');
  const [user_password, setUser_password] = useState('');

  const { login } = useContext(AuthContext); // Removed 'user' as it's not needed here

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        user_name,
        user_password,
      });
      if (response.data.token) {
        login(response.data.token); // Use AuthContext's login function
      }
      toast.success('Login successful');
    } catch (error) {
      console.error(
        'Error logging in:',
        error.response ? error.response.data : error.message
      );
      toast.error('Invalid username or password');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        // backgroundImage: 'url(https://files.123freevectors.com/wp-content/original/164191-abstract-blue-texture-background-illustration.jpg?q=100)', // Replace with your texture image
        // backgroundImage: 'url(http://localhost:3030/uploads/1730744289370-goofy.jpg)', // Replace with your texture image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        bgcolor: colors.blueAccent[300],
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        bgcolor={colors.grey[900]}
        borderRadius="2px"
        boxShadow={5}
        width="20%"
      >
        <Typography variant="h4" color={colors.grey[100]} mb={2}>
          Login
        </Typography>
        <InputBase
          placeholder="Username"
          value={user_name}
          onChange={(e) => setUser_name(e.target.value)}
          sx={{
            width: '100%',
            margin: '10px 0',
            padding: '10px',
            border: `1px solid ${colors.grey[700]}`,
            borderRadius: '4px',
            backgroundColor: colors.grey[800],
            color: colors.grey[100],
          }}
        />
        <InputBase
          placeholder="Password"
          type="password"
          value={user_password}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          onChange={(e) => setUser_password(e.target.value)}
          sx={{
            width: '100%',
            margin: '10px 0',
            padding: '10px',
            border: `1px solid ${colors.grey[700]}`,
            borderRadius: '4px',
            backgroundColor: colors.grey[800],
            color: colors.grey[100],
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2, color: colors.grey[900], backgroundColor: colors.primary[400] }}
        >
          Login
        </Button>
      </Box>
      <ToastContainer theme='colored' autoClose={2000}/>
    </Box>
  );
};

export default Login;