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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const UpdateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_name: "",
    user_password: "",
    user_role_id: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch user data by ID
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/user/${id}`);
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:3030/user/update/${id}`, user);
      setError("User updated successfully");
      setTimeout(() => {
        navigate("/users");
      }, 3000); // Navigate to users page after 3 seconds
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user");
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
        title="Update User"
        subTitle={`Update details for ${user.user_name}`}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
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
          <InputBase
            placeholder="Username"
            name="user_name"
            value={user.user_name}
            onChange={handleChange}
            sx={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: `1px solid #000`,
              borderRadius: "2px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
            }}
          />
          {showPassword && (
            <InputBase
              placeholder="Password"
              name="user_password"
              type="password"
              value={user.user_password}
              onChange={handleChange}
              sx={{
                width: "100%",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "2px",
                border: `1px solid ${colors.grey[800]}`,
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          )}
          <FormControl fullWidth sx={{ margin: "10px 0", borderRadius: "2px", }}>
            <Select
              name="user_role_id"
              value={user.user_role_id}
              onChange={handleChange}
              displayEmpty
              sx={{
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: "#000",
                marginTop: "10px",
              }}
            > 
              <MenuItem value="" disabled>User Role</MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="2">User</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateUser}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update User
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

export default UpdateUser;
