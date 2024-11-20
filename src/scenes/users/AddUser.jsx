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
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token"); // Retrieve the token
  const [user, setUser] = useState({
    user_name: "",
    user_password: "",
    user_role_id: "",
  });
  const navegate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      if (!user.user_name || !user.user_password || !user.user_role_id) {
        toast.error("Please fill all fields");
        return;
      }
      await axios.post("http://localhost:3030/user/new", user, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      });
      toast.success("User added successfully");
      setUser({ user_name: "", user_password: "", user_role_id: "" }); // Reset form
      setTimeout(() => {
        navegate("/users");
      }, 3000); // Navigate to users page after 3 seconds
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user");
    }
  };

  return (
    <Box m={2}>
      <Header title="Add New User" subTitle="Create a new user" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="77vh"
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
          boxShadow={3}
          width="50%"
        >
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel
              htmlFor="user_name"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Username
            </InputLabel>
            <InputBase
              id="user_name"
              placeholder="Enter User name"
              name="user_name"
              value={user.user_name}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                mb: "10px",
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel
              htmlFor="user_password"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Password
            </InputLabel>
            <InputBase
              id="user_password"
              placeholder="Enter User Password"
              name="user_password"
              type="password"
              value={user.user_password}
              onChange={handleChange}
              sx={{
                padding: "10px",
                border: `1px solid #000`,
                borderRadius: "2px",
                backgroundColor: colors.grey[900],
                color: colors.grey[100],
                mb: "10px",
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" width="100%">
            <InputLabel
              htmlFor="user_role_id"
              sx={{ color: colors.grey[100], mb: "5px" }}
            >
              Role
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
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddUser}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add User
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddUser;
