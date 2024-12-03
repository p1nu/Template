import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
// const API_BASE_URL = process.env.APP_API_URL;

const Mission = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // Get CSR ID from URL parameters
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mission/csr/${id}`);
        setMissions(response.data);
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };
    fetchMissions();
  }, [id]);

  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Missions</Typography>
        <Button variant="contained" component={Link} to={`/add-mission/${id}`}>
          Add Mission
        </Button>
      </Box>
      <Box mt={2}>
        {missions.map((mission) => (
          <Card key={mission.id} sx={{ mb: 2 }}>
            <CardContent>
              {mission.image && (
                <img
                  src={`${API_BASE_URL}/uploads/${mission.image}`}
                  alt="Mission"
                  width="100%"
                />
              )}
              {mission.video && (
                <video src={mission.video} controls width="100%" />
              )}
              <Typography variant="body1" mt={2} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mission.description) }} />
              <Box display="flex" justifyContent="flex-end">
                <Link to={`/update-mission/${mission.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" color="primary">
                    Update
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Mission;