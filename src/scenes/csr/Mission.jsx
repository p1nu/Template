import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

const Mission = () => {
  const { id } = useParams(); // Get CSR ID from URL parameters
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/mission/csr/${id}`);
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
          <Card key={mission.mission_id} sx={{ mb: 2 }}>
            <CardContent>
              {mission.image && (
                <img
                  src={`http://localhost:3030/uploads/${mission.image}`}
                  alt="Mission"
                  width="100%"
                />
              )}
              {mission.video && (
                <video src={mission.video} controls width="100%" />
              )}
              <Typography variant="body1" mt={2} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mission.description) }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Mission;