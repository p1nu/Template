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

const News = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/news/all`);
        setNews(response.data);
        setFilteredNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to load news');
      }
    };

    fetchNews();
  }, [API_BASE_URL]);

  useEffect(() => {
    const results = news.filter(
      (article) =>
        (article.news_title && article.news_title.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredNews(results);
  }, [search, news]);

  const handleDeleteNews = async (news_id) => {
    try {
      await axios.put(`${API_BASE_URL}/news/delete/${news_id}`);
      toast.success('News deleted successfully');
      setNews((prevNews) => prevNews.filter(article => article.news_id !== news_id));
      setFilteredNews((prevFilteredNews) => prevFilteredNews.filter(article => article.news_id !== news_id));
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Error deleting news');
    }
  };

  const handleEditNews = (id) => {
    navigate(`/news/${id}`);
  };

  const columns = [
    {
      name: 'Actions',
      cell: (row) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <IconButton onClick={() => handleEditNews(row.news_id)}>
            <EditIcon sx={{ color: colors.blueAccent[400] }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteNews(row.news_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: '100px',
    },
    {
      name: 'ID',
      selector: (row) => row.news_id,
      sortable: true,
      wrap: true,
    },
    {
      name: 'News Title',
      selector: (row) => row.news_title,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Date',
      selector: (row) => new Date(row.news_date).toLocaleDateString(),
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <Box m={2}>
      <Header title="News" subTitle="List of all news articles" />
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
          onClick={() => navigate('/add-news')}
          sx={{ backgroundColor: colors.blueAccent[200] }}
        >
          Add News
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
            placeholder="Search News"
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
        </Box>
        <DataTable
          columns={columns}
          data={filteredNews}
          keyField="news_id"
          pageSize={news.length > 10 ? 10 : news.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default News;