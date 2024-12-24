import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Modal,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../global/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MediaLibrary } from "../gallery/Index";
import { useMediaGallery } from "../gallery/MediaGalleryContext";

const AddProduct = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { open, handleClose, handleOpen } = useMediaGallery();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
    company_id: "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

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

    fetchCompanies();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (image) => {
    setProduct((prevProduct) => ({ ...prevProduct, image: image.il_path }));
    toast.success("Image selected successfully");
  };

  const handleAddProduct = async () => {
    // Basic validation
    if (!product.name || !product.description || !product.category || !product.price || !product.image || !product.company_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {

      await axios.post(`${API_BASE_URL}/product/new`, product);

      toast.success("Product added successfully");
      setProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        image: "",
        company_id: "",
      });
      setTimeout(() => {
        navigate("/products");
      }, 3000);
    } catch (error) {
      console.error("Add Product Error:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={2}>
      <Header title="Add New Product" subTitle="Create a new product listing" />
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
            <InputLabel htmlFor="name" sx={{ color: colors.grey[100], mb: "5px" }}>
              Product Name
            </InputLabel>
            <InputBase
              id="name"
              placeholder="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Product Description */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="description" sx={{ color: colors.grey[100], mb: "5px" }}>
              Product Description
            </InputLabel>
            <InputBase
              id="description"
              placeholder="Product Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
              multiline
              rows={4}
            />
          </Box>

          {/* Product Category */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="category" sx={{ color: colors.grey[100], mb: "5px" }}>
              Product Category
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: "1px solid #000",
                  borderRadius: "4px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                  "&:hover": {
                    border: "1px solid #000 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Apparel">Apparel</MenuItem>
                <MenuItem value="Home Goods">Home Goods</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Product Price */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="price" sx={{ color: colors.grey[100], mb: "5px" }}>
              Product Price
            </InputLabel>
            <InputBase
              id="price"
              placeholder="Product Price"
              name="price"
              value={product.price}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Company Name */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="company_id" sx={{ color: colors.grey[100], mb: "5px" }}>
              Company Name
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="company_id"
                name="company_id"
                value={product.company_id}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: "1px solid #000",
                  borderRadius: "4px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                  "&:hover": {
                    border: "1px solid #000 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
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

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddProduct}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              "&:hover": { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddProduct;
