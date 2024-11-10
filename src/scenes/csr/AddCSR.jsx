import React, { useState, useEffect } from 'react';
import { Box, Button, InputBase, Typography, useTheme, TextField } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const AddCSR = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [csr, setCsr] = useState({
    title: '',
    description: '',
    coordinator: '',
    status: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCsr((prevCsr) => ({ ...prevCsr, [name]: value }));
  };

  const handleAddCsr = async () => {
    try {
      await axios.post('http://localhost:3030/csr', csr);
      setError('CSR added successfully');
      setCsr({
        title: '',
        description: '',
        coordinator: '',
        status: '',
      }); // Reset form
    } catch (error) {
      console.error('Error adding CSR:', error);
      setError('Error adding CSR');
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
      <Header title="Add CSR" subTitle="Create a new CSR initiative" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
        padding={2}
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
          width="50%" 
          boxShadow={3}
        >
          <Typography variant="h4" color={colors.grey[100]} mb={2}>
            Add CSR
          </Typography>
          <InputBase
            placeholder="Title"
            name="title"
            value={csr.title}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <TextField
            placeholder="Description"
            name="description"
            value={csr.description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: '2px',
                padding: '10px',
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: '100%',
              margin: '10px 0',
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <InputBase
            placeholder="Coordinator"
            name="coordinator"
            value={csr.coordinator}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Status"
            name="status"
            value={csr.status}
            onChange={handleChange}
            sx={{
              width: '100%',
              margin: '10px 0',
              padding: '10px',
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: '2px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCsr}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add CSR
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

export default AddCSR;