import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, InputBase } from "@mui/material";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import mockNews from '../data/mockNews'; // Import the mock data for news
import { tokens } from '../../theme';

// Example styled-component using transient props
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const News = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Use mock data for news
    setNews(mockNews);
    setFilteredNews(mockNews);
  }, []);

  useEffect(() => {
    const result = news.filter((article) => {
      return (
        article.news_title &&
        article.news_title.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredNews(result);
  }, [search, news]);

  const columns = [
    { name: "ID", selector: (row) => row.news_id, sortable: true },
    { name: "Title", selector: (row) => row.news_title, sortable: true },
    { name: "Date", selector: (row) => row.news_date, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <StyledBox $align="space-between">
          <Link to={`/news/${row.news_id}`} style={{ marginLeft: "auto" }}>
            <Button variant="outlined" color="primary">
              View
            </Button>
          </Link>
          <Button variant="outlined" color="error" sx={{ m: 1 }}>
            Delete
          </Button>
        </StyledBox>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        borderTop: `1px solid ${colors.grey[800]}`,
      },
    },
  };

  return (
    <Box m="20px">
      <Header title="News" subTitle="Manage news articles" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredNews}
          pagination
          highlightOnHover
          responsive
          striped
          subHeader
          subHeaderComponent={
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
                  width: "150px",
                  height: "35px",
                  padding: "10px",
                  color: colors.grey[100],
                  bgcolor: colors.grey[900],
                }}
              />
              <Link to="/add-news" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                <Button variant="contained" sx={{ bgcolor: colors.blueAccent[200] }}>
                  Add News
                </Button>
              </Link>
            </Box>
          }
          customStyles={customStyles}
        />
      </Box>
    </Box>
  );
};

export default News;