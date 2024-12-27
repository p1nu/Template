import React, { useState, useContext } from 'react';
import { Box, Button, InputBase, InputLabel, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { AuthContext } from "../global/AuthContext";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: '',
    description: '',
    created_by_user_id: user?.user_id,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleAddCategory = async () => {
    if (!category.name || !category.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/categories`, category);
      toast.success('Category added successfully');
      setTimeout(() => {
        navigate('/categories');
      }, 3000); // Navigate to categories page after 3 seconds
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={2}>
      <Header title="Add New Category" subTitle="Create a new product category" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
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
          width="100%"
          boxShadow={3}
        >
          {/* Category Name */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="name" sx={{ color: colors.grey[100], mb: '5px' }}>
              Category Name
            </InputLabel>
            <InputBase
              id="name"
              placeholder="Category Name"
              name="name"
              value={category.name}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '4px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Category Description */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="description" sx={{ color: colors.grey[100], mb: '5px' }}>
              Category Description
            </InputLabel>
            <InputBase
              id="description"
              placeholder="Category Description"
              name="description"
              value={category.description}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '4px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
              multiline
              rows={4}
            />
          </Box>

          {/* Add Category Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCategory}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              '&:hover': { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? 'Adding Category...' : 'Add Category'}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddCategory;