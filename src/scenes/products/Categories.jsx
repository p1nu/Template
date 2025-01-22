import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Modal,
  InputBase,
  InputLabel,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { AuthContext } from '../global/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useMediaGallery } from '../gallery/MediaGalleryContext';
import { MediaLibrary } from '../gallery/Index';

const Categories = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { open, handleClose, handleOpen } = useMediaGallery();

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    category_name: '',
    category_desc: '',
    category_image: '',
    company_id: '',
    sub_id: '',
  });
  const [newSubCategory, setNewSubCategory] = useState({
    sub_name: '',
    sub_desc: '',
    sub_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [showSubCategories, setShowSubCategories] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories data:', error);
      toast.error('Failed to load categories data');
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subcategory/all`);
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories data:', error);
      toast.error('Failed to load subcategories data');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/all`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies data:', error);
      toast.error('Failed to load companies data');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchCompanies();
  }, [API_BASE_URL]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setCurrentCategory(null);
    setNewCategory({
      category_name: '',
      category_desc: '',
      category_image: '',
      sub_id: '',
      company_id: '',
    });
  };

  const handleOpenSubModal = () => setOpenSubModal(true);
  const handleCloseSubModal = () => {
    setOpenSubModal(false);
    setNewSubCategory({
      sub_name: '',
      sub_desc: '',
      sub_image: '',
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value || '',
    }));
  };

  const handleSubCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewSubCategory((prevSubCategory) => ({
      ...prevSubCategory,
      [name]: value,
    }));
  };

  const handleImageChange = (image) => {
    setNewCategory((prevCategory) => ({ ...prevCategory, category_image: image.il_path }));
  };

  const handleSubImageChange = (image) => {
    setNewSubCategory((prevSubCategory) => ({ ...prevSubCategory, sub_image: image.il_path }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.category_name) {
      toast.error('Please fill in the category name');
      return;
    }

    if (!newCategory.company_id) {
      toast.error('Please select a company');
      return;
    }

    setLoading(true);
    try {
      const categoryData = {
        category_name: newCategory.category_name,
        category_desc: newCategory.category_desc,
        category_image: newCategory.category_image,
        company_id: newCategory.company_id,
      };

      if (newCategory.sub_id) {
        categoryData.sub_id = newCategory.sub_id;
      }

      if (editMode) {
        await axios.put(`${API_BASE_URL}/product/category/update/${currentCategory.category_id}`, categoryData);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/product/category/new`, categoryData);
        toast.success('Category added successfully');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating category:', error.response ? error.response.data : error.message);
      toast.error('Error adding/updating category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.sub_name || !newSubCategory.sub_desc || !newSubCategory.sub_image) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/subcategory/new`, newSubCategory);
      toast.success('Subcategory added successfully');
      handleCloseSubModal();
      fetchSubCategories();
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Error adding subcategory');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setNewCategory({
      category_name: category.category_name || '',
      category_desc: category.category_desc || '',
      category_image: category.category_image || '',
      sub_id: category.sub_id !== null && category.sub_id !== undefined ? category.sub_id : '',
      company_id: category.company_id !== null && category.company_id !== undefined ? category.company_id : '',
    });
    setEditMode(true);
    handleOpenModal();
  };

  const handleEditSubCategory = (subCategory) => {
    setNewSubCategory({
      sub_name: subCategory.sub_name || '',
      sub_desc: subCategory.sub_desc || '',
      sub_image: subCategory.sub_image || '',
    });
    setEditMode(true);
    handleOpenSubModal();
  };

  const handleDeleteCategory = (category) => {
    setDeleteItem(category);
    setDeleteType('category');
    setDeleteModalOpen(true);
  };

  const handleDeleteSubCategory = (subCategory) => {
    setDeleteItem(subCategory);
    setDeleteType('subcategory');
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteType === 'category') {
      try {
        await axios.delete(`${API_BASE_URL}/product/category/delete/${deleteItem.category_id}`);
        toast.success('Category deleted successfully');
        setCategories((prevCategories) => prevCategories.filter((cat) => cat.category_id !== deleteItem.category_id));
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category');
      }
    } else if (deleteType === 'subcategory') {
      try {
        await axios.delete(`${API_BASE_URL}/subcategory/delete/${deleteItem.sub_id}`);
        toast.success('Subcategory deleted successfully');
        setSubCategories((prevSubCategories) =>
          prevSubCategories.filter((sub) => sub.sub_id !== deleteItem.sub_id)
        );
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        toast.error('Error deleting subcategory');
      }
    }
    setDeleteModalOpen(false);
    setDeleteItem(null);
    setDeleteType('');
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteItem(null);
    setDeleteType('');
  };

  const toggleView = () => {
    setShowSubCategories(!showSubCategories);
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
        <Box display="flex" justifyContent="flex-start" width="100%" mb={2} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Products
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add New Category
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleView}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            {showSubCategories ? 'Show All Categories' : 'Show All Subcategories'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenSubModal}
            sx={{ backgroundColor: colors.blueAccent[200] }}
          >
            Add New Subcategory
          </Button>
        </Box>
        {!showSubCategories ? (
          <List sx={{ width: '100%', bgcolor: colors.grey[900], borderRadius: '2px', boxShadow: 3 }}>
            {categories.map((category) => (
              <ListItem key={category.category_id} sx={{ borderBottom: `1px solid ${colors.grey[700]}` }}>
                <ListItemText primary={category.category_name} />
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(category)}>
                  <EditIcon sx={{ color: colors.blueAccent[400] }} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category)}>
                  <DeleteIcon sx={{ color: colors.redAccent[400] }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <List sx={{ width: '100%', bgcolor: colors.grey[900], borderRadius: '2px', boxShadow: 3 }}>
            {subCategories.map((subCategory) => (
              <ListItem key={subCategory.sub_id} sx={{ borderBottom: `1px solid ${colors.grey[700]}` }}>
                <ListItemText primary={subCategory.sub_name} />
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditSubCategory(subCategory)}>
                  <EditIcon sx={{ color: colors.blueAccent[400] }} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSubCategory(subCategory)}>
                  <DeleteIcon sx={{ color: colors.redAccent[400] }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add/Edit Category Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
          mt="10px"
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
              onChange={handleCategoryChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '4px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="category_desc" sx={{ color: colors.grey[100], mb: '5px' }}>
              Category Description
            </InputLabel>
            <InputBase
              id="category_desc"
              placeholder="Category Description"
              name="category_desc"
              value={newCategory.category_desc}
              onChange={handleCategoryChange}
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
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="sub_id" sx={{ color: colors.grey[100], mb: '5px' }}>
              Subcategory
            </InputLabel>
            <FormControl fullWidth sx={{ backgroundColor: colors.grey[900], borderRadius: '4px' }}>
              <Select
                id="sub_id"
                name="sub_id"
                value={newCategory.sub_id || ''}
                onChange={handleCategoryChange}
                displayEmpty
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="" disabled>
                  Select Subcategory
                </MenuItem>
                {subCategories.map((subCategory) => (
                  <MenuItem key={subCategory.sub_id} value={subCategory.sub_id}>
                    {subCategory.sub_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="company_id" sx={{ color: colors.grey[100], mb: '5px' }}>
              Company
            </InputLabel>
            <FormControl fullWidth sx={{ backgroundColor: colors.grey[900], borderRadius: '4px' }}>
              <Select
                id="company_id"
                name="company_id"
                value={newCategory.company_id || ''}
                onChange={handleCategoryChange}
                displayEmpty
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="" disabled>
                  Select Company
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="category_image" sx={{ color: colors.grey[100], mb: '5px' }}>
              Category Image
            </InputLabel>
            <Button
              variant="contained"
              title="Add Image"
              onClick={handleOpen}
              sx={{
                mt: 2,
                backgroundColor: colors.blueAccent[200],
              }}
            >
              Add Image
            </Button>
            <Modal open={open} onClose={handleClose}>
              <MediaLibrary onSelectImage={handleImageChange} />
            </Modal>
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
            {loading
              ? editMode
                ? 'Updating Category...'
                : 'Adding Category...'
              : editMode
              ? 'Update Category'
              : 'Add Category'}
          </Button>
        </Box>
      </Modal>

      {/* Add/Edit Subcategory Modal */}
      <Modal open={openSubModal} onClose={handleCloseSubModal}>
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
            {editMode ? 'Edit Subcategory' : 'Add New Subcategory'}
          </Typography>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="sub_name" sx={{ color: colors.grey[100], mb: '5px' }}>
              Subcategory Name
            </InputLabel>
            <InputBase
              id="sub_name"
              placeholder="Subcategory Name"
              name="sub_name"
              value={newSubCategory.sub_name}
              onChange={handleSubCategoryChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '4px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="sub_desc" sx={{ color: colors.grey[100], mb: '5px' }}>
              Subcategory Description
            </InputLabel>
            <InputBase
              id="sub_desc"
              placeholder="Subcategory Description"
              name="sub_desc"
              value={newSubCategory.sub_desc}
              onChange={handleSubCategoryChange}
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

          {/* Subcategory Image Upload */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="sub_image" sx={{ color: colors.grey[100], mb: '5px' }}>
              Subcategory Image
            </InputLabel>
            <Button
              variant="contained"
              title="Add Image"
              onClick={handleOpen}
              sx={{
                mt: 2,
                backgroundColor: colors.blueAccent[200],
              }}
            >
              Add Image
            </Button>
            <Modal open={open} onClose={handleClose}>
              <MediaLibrary onSelectImage={handleSubImageChange} />
            </Modal>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddSubCategory}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              '&:hover': { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading
              ? editMode
                ? 'Updating Subcategory...'
                : 'Adding Subcategory...'
              : editMode
              ? 'Update Subcategory'
              : 'Add Subcategory'}
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={cancelDelete}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          width="300px"
          boxShadow={3}
          mx="auto"
          mt="20%"
        >
          <Typography variant="h6" sx={{ color: colors.grey[100], mb: 2 }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ color: colors.grey[100], mb: 4 }}>
            Are you sure you want to delete this{' '}
            {deleteType === 'category' ? 'category' : 'subcategory'}?
          </Typography>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              sx={{ backgroundColor: colors.redAccent[400], mr: 2 }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={cancelDelete}
              sx={{ backgroundColor: colors.blueAccent[200] }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Categories;