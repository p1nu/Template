import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, InputBase, InputLabel, Typography, useTheme, FormControl, Select, MenuItem, Modal } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { AuthContext } from "../global/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { MediaLibrary } from "../gallery/Index";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AddProduct = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { open, handleClose, handleOpen } = useMediaGallery();

  const [product, setProduct] = useState({
    product_name: "",
    product_desc: "",
    category_id: "",
    product_price: "",
    product_image: "",
    company_id: "",
  });
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCompanies();
    fetchCategories();

    // Check if we are in edit mode
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setIsEditMode(true);
    }
  }, [API_BASE_URL, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (image) => {
    setProduct((prevProduct) => ({ ...prevProduct, product_image: image.il_path }));
  };

  const handleSaveProduct = async () => {
    if (!product.product_name || !product.product_desc || !product.category_id || !product.product_price || !product.product_image || !product.company_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/product/update/${product.product_id}`, product);
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/product/new`, product);
        toast.success("Product added successfully");
      }
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      product_desc: content,
    }));
  };

  return (
    <Box m={2}>
      <Header title={isEditMode ? "Edit Product" : "Add New Product"} subTitle={isEditMode ? "Update the product details" : "Create a new product"} />
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/categories')}
          sx={{ backgroundColor: colors.blueAccent[200] }}
        >
          Categories
        </Button>
      </Box>
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
          {/* Product Name */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="product_name" sx={{ color: colors.grey[100], mb: '5px' }}>
              Product Name
            </InputLabel>
            <InputBase
              id="product_name"
              placeholder="Product Name"
              name="product_name"
              value={product.product_name}
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

          {/* Product Description */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="product_desc" sx={{ color: colors.grey[100], mb: '5px' }}>
              Product Description
            </InputLabel>
            <ReactQuill
              theme="snow"
              value={product.product_desc}
              onChange={handleEditorChange}
              style={{
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                borderRadius: '4px',
                border: '1px solid #000',
              }}
            />
          </Box>

          {/* Product Category */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="category_id" sx={{ color: colors.grey[100], mb: '5px' }}>
              Product Category
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="category_id"
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: '1px solid #000',
                  borderRadius: '4px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                  '&:hover': {
                    border: '1px solid #000 !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Product Price */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="product_price" sx={{ color: colors.grey[100], mb: '5px' }}>
              Product Price
            </InputLabel>
            <InputBase
              id="product_price"
              placeholder="Product Price"
              name="product_price"
              value={product.product_price}
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

          {/* Select Company */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="company_id" sx={{ color: colors.grey[100], mb: '5px' }}>
              Select Company
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="company_id"
                name="company_id"
                value={product.company_id}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: '1px solid #000',
                  borderRadius: '4px',
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                  '&:hover': {
                    border: '1px solid #000 !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
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

          {/* Product Image */}
          <Box>
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

          {/* Save Product Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveProduct}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              '&:hover': { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? (isEditMode ? 'Updating Product...' : 'Adding Product...') : (isEditMode ? 'Update Product' : 'Add Product')}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddProduct;
