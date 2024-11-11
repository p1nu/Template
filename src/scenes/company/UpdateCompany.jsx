import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const UpdateCompany = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    company_name: "",
    company_acronym: "",
    company_value: "",
    company_vision: "",
    company_mission: "",
    company_desc: "",
    company_status_id: "",
    company_created_by_user_id: "",
    company_updated_by_user_id: "",
  });
  const [user, setUser] = useState({
    user_name: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch company data by ID
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/company/${id}`);
        setCompany(response.data[0]);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    fetchCompany();
  }, [id]);

  useEffect(() => {
    //Fetch user data by ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/user/${company.company_created_by_user_id}`
        );
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (company.company_created_by_user_id) {
      fetchUser();
    }
  }, [company.company_created_by_user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleUpdateCompany = async () => {
    try {
      await axios.put(`http://localhost:3030/company/update/${id}`, company);
      setError("Company updated successfully");
      setTimeout(() => {
        navigate("/company");
      }, 3000); // Navigate to companies page after 3 seconds
    } catch (error) {
      console.error("Error updating company:", error);
      setError("Error updating company");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Clear error after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [error]);

  return (
    <Box m={2}>
      <Header
        title="Update Company"
        subTitle={`Update details for ${company.company_name}`}
      />
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
          width="50%"
          boxShadow={3}
        >
          <Typography variant="h4" color={colors.grey[100]} mb={2}>
            Update Company
          </Typography>
          <InputBase
            placeholder="Company Name"
            name="company_name"
            value={company.company_name}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Company Acronym"
            name="company_acronym"
            value={company.company_acronym}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <TextField
            placeholder="Company Value"
            name="company_value"
            value={company.company_value}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: "2px",
                padding: "10px",
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: "100%",
              margin: "10px 0",
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <TextField
            placeholder="Company Vision"
            name="company_vision"
            value={company.company_vision}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: "2px",
                padding: "10px",
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: "100%",
              margin: "10px 0",
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <TextField
            placeholder="Company Mission"
            name="company_mission"
            value={company.company_mission}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: "2px",
                padding: "10px",
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: "100%",
              margin: "10px 0",
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <TextField
            placeholder="Company Description"
            name="company_desc"
            value={company.company_desc}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: {
                color: colors.grey[100],
                backgroundColor: colors.grey[900],
                borderRadius: "2px",
                padding: "10px",
              },
            }}
            InputLabelProps={{
              style: {
                color: colors.grey[100],
              },
            }}
            sx={{
              width: "100%",
              margin: "10px 0",
              border: `1px solid ${colors.grey[800]}`,
            }}
          />
          <FormControl fullWidth sx={{ margin: "10px 0" }}>
            <Select
              name="company_status_id"
              value={company.company_status_id}
              onChange={handleChange}
              sx={{
                border: `1px solid ${colors.grey[800]}`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                marginTop: "10px",
              }}
            >
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Inactive</MenuItem>
            </Select>
          </FormControl>
          <InputBase
            placeholder="Created By User ID"
            name="company_created_by_user_id"
            value={user.user_name}
            disabled
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <InputBase
            placeholder="Updated By User ID"
            name="company_updated_by_user_id"
            value={company.company_updated_by_user_id}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid ${colors.grey[800]}`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateCompany}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update Company
          </Button>
          {error && (
            <Typography
              variant="body1"
              color={error.includes("successfully") ? "green" : "red"}
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

export default UpdateCompany;
