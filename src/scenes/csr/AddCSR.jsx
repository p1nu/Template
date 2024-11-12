import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, InputLabel } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AddCSR = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [csr, setCsr] = useState({
    csr_title: "",
    csr_article: "",
    csr_date: "",
    csr_image_id: "",
    csr_link: "",
    csr_created_by_user_id: "",
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCsr((prevCsr) => ({ ...prevCsr, [name]: value }));
  };

  const handleArticleChange = (value) => {
    setCsr((prevCsr) => ({ ...prevCsr, csr_article: value }));
  };

  const handleAddCsr = async () => {
    try {
      await axios.post("http://localhost:3030/csr/new", csr);
      setError("CSR added successfully");
      setCsr({
        csr_title: "",
        csr_article: "",
        csr_date: "",
        csr_image_id: "",
        csr_link: "",
        csr_created_by_user_id: "",
      }); // Reset form
      setTimeout(() => {
        navigate("/csr");
      }, 3000);
    } catch (error) {
      console.error("Error adding CSR:", error);
      setError("Error adding CSR");
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
      <Header title="Add New CSR" subTitle="Create a new CSR entry" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bgcolor={colors.grey[800]}
        sx={{
          "& .ql-container.ql-snow": {
            width: "100% !important",
            height: "200px !important",
            border: "1px solid #000",
          },
          "& .ql-toolbar": {
            border: "1px solid #000",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2x"
          width="100%"
          boxShadow={3}
        >
          {/* CSR Title */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_title"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              CSR Title
            </InputLabel>
            <InputBase
              id="csr_title"
              placeholder="CSR Title"
              name="csr_title"
              value={csr.csr_title}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* CSR Article */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_article"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              CSR Article
            </InputLabel>
            <ReactQuill
              theme="snow"
              value={csr.csr_article}
              onChange={handleArticleChange}
              placeholder="Write your CSR article here..."
              style={{
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                borderRadius: "2px",
              }}
            />
          </Box>

          {/* CSR Date */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_date"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              CSR Date
            </InputLabel>
            <InputBase
              id="csr_date"
              name="csr_date"
              type="date"
              value={csr.csr_date}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* CSR Image ID */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_image_id"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              CSR Image ID
            </InputLabel>
            <InputBase
              id="csr_image_id"
              placeholder="Image ID"
              name="csr_image_id"
              value={csr.csr_image_id}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* CSR Link */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_link"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              CSR Link
            </InputLabel>
            <InputBase
              id="csr_link"
              placeholder="https://example.com"
              name="csr_link"
              value={csr.csr_link}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Created By User ID */}
          <Box
            display="flex"
            flexDirection="column"
            margin="10px 0"
            width="100%"
          >
            <InputLabel
              htmlFor="csr_created_by_user_id"
              sx={{ color: colors.grey[100], mb: '5px' }}
            >
              Created By User ID
            </InputLabel>
            <InputBase
              id="csr_created_by_user_id"
              placeholder="User ID"
              name="csr_created_by_user_id"
              value={csr.csr_created_by_user_id}
              onChange={handleChange}
              sx={{
                padding: '10px',
                border: '1px solid #000',
                borderRadius: '2px',
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCsr}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add CSR
          </Button>

          {/* Error/Success Message */}
          {error && (
            <Typography
              variant="body1"
              color={error.includes('successfully') ? 'green' : 'red'}
              mt={2}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddCSR;