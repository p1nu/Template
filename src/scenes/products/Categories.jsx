import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, useTheme, List, ListItem, ListItemText, Modal, InputBase, InputLabel, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    category_name: '',
    created_by_user_id: user?.user_id,
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories data
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories data:', error);
      toast.error('Failed to load categories data');
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [API_BASE_URL]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentCategory(null);
    setNewCategory({
      category_name: '',
      created_by_user_id: user?.user_id,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.category_name) {
      toast.error('Please fill in the category name');
      return;
    }

    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`${API_BASE_URL}/product/category/update/${currentCategory.category_id}`, newCategory);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/product/category/new`, newCategory);
        toast.success('Category added successfully');
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error('Error adding/updating category:', error);
      toast.error('Error adding/updating category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setNewCategory({
      category_name: category.category_name,
      created_by_user_id: user?.user_id,
    });
    setEditMode(true);
    handleOpen();
  };

  const handleDeleteCategory = async (category_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/product/category/delete/${category_id}`);
      toast.success('Category deleted successfully');
      setCategories((prevCategories) => prevCategories.filter(category => category.category_id !== category_id));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  return (
    <Box m={2}>
      <Header title="Product Categories" subTitle="List of all product categories" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={2}
        bgcolor={colors.grey[800]}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ mb: 2, backgroundColor: colors.blueAccent[200] }}
        >
          Add New Category
        </Button>
        <List sx={{ width: '100%', bgcolor: colors.grey[900], borderRadius: '2px', boxShadow: 3 }}>
          {categories.map((category) => (
            <ListItem key={category.category_id} sx={{ borderBottom: `1px solid ${colors.grey[700]}` }}>
              <ListItemText primary={category.category_name} />
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(category)}>
                <EditIcon sx={{ color: colors.blueAccent[400] }} />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.category_id)}>
                <DeleteIcon sx={{ color: colors.redAccent[400] }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          width="400px"
          boxShadow={3}
          mx="auto"
          mt="10%"
        >
          <Typography variant="h6" sx={{ color: colors.grey[100], mb: 2 }}>
            {editMode ? 'Edit Category' : 'Add New Category'}
          </Typography>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="category_name" sx={{ color: colors.grey[100], mb: '5px' }}>
              Category Name
            </InputLabel>
            <InputBase
              id="category_name"
              placeholder="Category Name"
              name="category_name"
              value={newCategory.category_name}
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
            {loading ? (editMode ? 'Updating Category...' : 'Adding Category...') : (editMode ? 'Update Category' : 'Add Category')}
          </Button>
        </Box>
      </Modal>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Categories;