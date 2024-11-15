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
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState({
    user_name: "",
    user_password: "",
    user_role_id: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using React Router v6
  const token = localStorage.getItem("token"); // Retrieve the token

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        });
        setUser({
          user_name: response.data.user_name,
          user_password: "",
          user_role_id: response.data.user_role_id,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details");
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
      // Prepare the data to be updated
      const updateData = {
        user_name: user.user_name,
        user_role_id: user.user_role_id,
      };

      // Include password only if it's been changed
      if (user.user_password.trim() !== "") {
        updateData.user_password = user.user_password;
      }

      await axios.put(
        `http://localhost:3030/user/update/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
          },
        }
      );
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
      <Header title="Update User" subTitle={`Update details for ${user.user_name}`} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
        bgcolor={colors.grey[800]}
        padding={2}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="2px"
          boxShadow={3}
          width="50%"
        >
          {/* User Name */}
          <Box display="flex" flexDirection="column" width="100%" mb={2}>
            <InputLabel
              htmlFor="user_name"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              User Name
            </InputLabel>
            <InputBase
              id="user_name"
              placeholder="Enter User Name"
              name="user_name"
              value={user.user_name}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* User Password */}
          <Box display="flex" flexDirection="column" width="100%" mb={2}>
            <InputLabel
              htmlFor="user_password"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              User Password
            </InputLabel>
            <InputBase
              id="user_password"
              type="password"
              placeholder="Enter User Password"
              name="user_password"
              value={user.user_password}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
              }}
            />
          </Box>

          {/* User Role */}
          <Box display="flex" flexDirection="column" width="100%" mb={2}>
            <InputLabel
              htmlFor="user_role_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              User Role
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="user_role_id"
                name="user_role_id"
                value={user.user_role_id}
                onChange={handleChange}
                displayEmpty
                sx={{
                  border: `1px solid #000`,
                  borderRadius: "2px",
                  backgroundColor: colors.grey[900],
                  color: colors.grey[100],
                }}
              >
                <MenuItem value="" disabled>
                  Select User Role
                </MenuItem>
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">User</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Update Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateUser}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Update User
          </Button>

          {/* Error/Success Message */}
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
