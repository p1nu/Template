import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase, InputLabel } from "@mui/material";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";
import Header from "../../components/Header";
import { tokens } from '../../theme';
import { format } from 'date-fns'; // Imported format from date-fns
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = process.env.APP_API_URL;

const News = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/news/all`);
        setNews(response.data);
        setFilteredNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to fetch news");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = news.filter((article) =>
      (article.news_title || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredNews(results);
  }, [search, news]);

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/news/delete/${id}`);
      const response = await axios.get(`${API_BASE_URL}/news/all`);
      setNews(response.data);
      setFilteredNews(response.data);
      toast.success("News deleted successfully");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news");
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.news_id, sortable: true },
    { name: "Title", selector: (row) => row.news_title, sortable: true },
    { 
      name: "Date", 
      selector: (row) => format(new Date(row.news_date), 'MM/dd/yyyy'), 
      sortable: true 
    },
    {
      name: "Actions",
      cell: (row) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          textAlign="center"
          width="100%"
        >
          <Link to={`/news/${row.news_id}`} style={{ marginLeft: "auto" }}>
            <Button variant="outlined" color="primary">
              View
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            sx={{ m: 1 }}
            onClick={() => handleDelete(row.news_id)}
          >
            Delete
          </Button>
        </Box>
      ),
      sortable: false,
      width: "50%",
    },
  ];

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
        fontWeight: "bold",
        borderTop: `1px solid #000`, // Consistent top border
        borderBottom: `1px solid #000`, // Consistent bottom border
      },
    },
    cells: {
      style: {
        borderBottom: "1px solid #000", // Consistent cell border
      },
    },
  };

  // Subheader Component - Search Bar and Add News Button
  const SubHeaderComponent = (
    <Box display="flex" alignItems="center">
      <InputBase
        placeholder="Search Title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          ml: 2,
          border: "1px solid",
          borderColor: colors.grey[700],
          borderRadius: "4px",
          width: "200px",
          height: "35px",
          padding: "10px",
          color: colors.grey[100],
          bgcolor: colors.grey[900],
        }}
      />
      <Link
        to="/add-news"
        style={{ textDecoration: "none", marginLeft: "10px" }}
      >
        <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
          Add News
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="News" subTitle="Manage news articles" />
      <Box
        m="10px 0 0 0"
        height="auto"
        bgcolor={colors.grey[800]}
        padding="10px"
      >
        <DataTable
          columns={columns}
          data={filteredNews}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={SubHeaderComponent}
          customStyles={customStyles}
        />
      </Box>
    </Box>
  );
};

export default News;