import React, { useState } from 'react';
import { Box, Button, InputBase, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundImage: 'url(https://files.123freevectors.com/wp-content/original/164191-abstract-blue-texture-background-illustration.jpg?q=100)', // Replace with your texture image
        // backgroundImage: 'url(http://localhost:3030/uploads/1730744289370-goofy.jpg)', // Replace with your texture image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        bgcolor={colors.grey[900]}
        borderRadius="8px"
        boxShadow={5}
      >
        <Typography variant="h4" color={colors.grey[100]} mb={2}>
          Login
        </Typography>
        <InputBase
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;