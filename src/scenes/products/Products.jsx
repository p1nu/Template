import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
} from '@mui/material';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { tokens } from '../../theme';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || 'flex-start'};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Products = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/all`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/category`);
      setCategories(response.data);
      setSelectedCategory(response.data[0]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        product.category === selectedCategory
    );
    setFilteredProducts(results);
  }, [search, products, selectedCategory]);

  const columns = [
    {
      name: 'Product Name',
      selector: (row) => row.name,
      sortable: true,
      width: 'auto',
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      width: '15%',
    },
    {
      name: 'Price',
      selector: (row) => `$${row.price}`,
      sortable: true,
      width: '10%',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" textAlign="center" width="100%">
          <Link to={`/product/${row.id}`}>
            <Button variant="outlined" color="primary">
              Edit
            </Button>
          </Link>
          <Button variant="outlined" color="error" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/product/delete/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const customStyles = {
    header: {
      style: {
        backgroundColor: colors.grey[900],
        color: colors.grey[100],
      },
    },
    headCells: {
      style: {
        color: colors.grey[100],
        fontWeight: 'bold',
        borderTop: `1px solid #000`,
        borderBottom: `1px solid #000`,
      },
    },
    cells: {
      style: {
        borderBottom: '1px solid #000',
      },
    },
  };

  const SubHeaderComponent = (
    <Box display="flex" alignItems="center">
      <InputBase
        placeholder="Search Product Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          ml: 2,
          border: '1px solid',
          borderColor: colors.grey[700],
          borderRadius: '4px',
          width: '200px',
          height: '35px',
          padding: '10px',
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          marginLeft: '10px',
          padding: '10px',
          borderRadius: '4px',
          borderColor: colors.grey[700],
          backgroundColor: colors.grey[900],
          color: colors.grey[100],
        }}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Link to="/add-product" style={{ textDecoration: 'none', marginLeft: '10px' }}>
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add Product
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Products" subTitle="Manage products" />
      <Box m="10px 0 0 0" height="auto" bgcolor={colors.grey[800]} padding="10px">
        <DataTable
          columns={columns}
          data={filteredProducts}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={SubHeaderComponent}
          customStyles={customStyles}
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default Products;