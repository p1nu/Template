import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, InputBase, Typography, useTheme, FormControl, Select, MenuItem, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/all-with-categories`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      }
    };

    fetchProducts();
    fetchCategories();
    fetchCompanies();
  }, [API_BASE_URL]);

  useEffect(() => {
    const results = products.filter(
      (product) =>
        (product.product_name && product.product_name.toLowerCase().includes(search.toLowerCase())) &&
        (selectedCategory === '' || product.category_id === selectedCategory) &&
        (selectedCompany === '' || product.company_id === selectedCompany)
    );
    setFilteredProducts(results);
  }, [search, products, selectedCategory, selectedCompany]);

  const handleDeleteProduct = async (product_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/product/delete/${product_id}`);
      toast.success('Product deleted successfully');
      setProducts((prevProducts) => prevProducts.filter(product => product.product_id !== product_id));
      setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter(product => product.product_id !== product_id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const handleEditProduct = (product) => {
    navigate('/add-product', { state: { product } });
  };

  const columns = [
    {
      name: 'Actions',
      cell: (row) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <IconButton onClick={() => handleEditProduct(row)}>
            <EditIcon sx={{ color: colors.blueAccent[400] }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(row.product_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: '100px',
    },
    {
      name: 'Product Name',
      selector: (row) => row.product_name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Price',
      selector: (row) => `$${row.product_price}`,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Company',
      selector: (row) => {
        const company = companies.find((c) => c.company_id === row.company_id);
        return company ? company.company_name : 'Unknown';
      },
      sortable: true,
      wrap: true,
    },
  ];

  // Get the set of company IDs that have products
  const companyIdsWithProducts = new Set(products.map(product => product.company_id));

  // Filter companies to only include those that have products
  const filteredCompanies = companies.filter(company => companyIdsWithProducts.has(company.company_id));

  return (
    <Box m={2}>
      <Header title="Products" subTitle="List of all products" />
      <Box
        display="flex"
        justifyContent="start"
        width="100%"
        gap={2}
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-product')}
          sx={{ backgroundColor: colors.blueAccent[200] }}
        >
          Add Product
        </Button>
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
        <Box display="flex" justifyContent="space-between" width="100%" mb={2}>
          <InputBase
            placeholder="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              padding: '10px',
              border: '1px solid #000',
              borderRadius: '4px',
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
              width: '30%',
            }}
          />
          <FormControl sx={{ width: '30%' }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '30%' }}>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
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
              <MenuItem value="">All Companies</MenuItem>
              {filteredCompanies.map((company) => (
                <MenuItem key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="product_id"
          pageSize={products.length > 10 ? 10 : products.length}
          highlightOnHover
          pointerOnHover
          responsive
          
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Products;