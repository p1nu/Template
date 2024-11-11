import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  TextField,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddCompany = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    company_name: "",
    company_acronym: "",
    company_value: "",
    company_vision: "",
    company_mission: "",
    company_desc: "",
    company_created_by_user_id: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
  };

  const handleQuillChange = (field, value) => {
    setCompany((prevCompany) => ({ ...prevCompany, [field]: value }));
  };

  const handleAddCompany = async () => {
    try {
      await axios.post("http://localhost:3030/company/new", company);
      setError("Company added successfully");
      setCompany({
        company_name: "",
        company_acronym: "",
        company_value: "",
        company_vision: "",
        company_mission: "",
        company_desc: "",
        company_created_by_user_id: "",
      }); // Reset form
      setTimeout(() => {
        navigate("/companies");
      }, 3000); // Navigate to companies page after 3 seconds
    } catch (error) {
      console.error("Error adding company:", error);
      setError("Error adding company");
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
      <Header title="Add New Company" subTitle="Create a new company" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={2}
        bgcolor={colors.grey[800]}
        sx={{
          "& .ql-container.ql-snow": {
            width: "100% !important",
            height: "84% !important",
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
          borderRadius="2px"
          width="100%"
          boxShadow={3}
        >
          <Box display="flex" justifyContent={"space-between"} width="100%" gap={"20px"}>
            <InputBase
              placeholder="Company Name"
              name="company_name"
              value={company.company_name}
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
            <InputBase
              placeholder="Company Acronym"
              name="company_acronym"
              value={company.company_acronym}
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
          </Box>
          <ReactQuill
            value={company.company_value}
            onChange={(value) => handleQuillChange("company_value", value)}
            theme="snow"
            placeholder="Enter company value..."
            style={{
              height: "250px",
              width: "100%",
              margin: "10px 0",
              border: `1px solid #000`,
            }}
          />
          <ReactQuill
            value={company.company_vision}
            onChange={(value) => handleQuillChange("company_vision", value)}
            theme="snow"
            placeholder="Enter company vision..."
            style={{
              height: "250px",
              width: "100%",
              margin: "10px 0",
              border: `1px solid #000`,
            }}
          />
          <ReactQuill
            value={company.company_mission}
            onChange={(value) => handleQuillChange("company_mission", value)}
            theme="snow"
            placeholder="Enter company mission..."
            style={{
              height: "250px",
              width: "100%",
              margin: "10px 0",
              border: `1px solid #000`,
            }}
          />
          <ReactQuill
            value={company.company_desc}
            onChange={(value) => handleQuillChange("company_desc", value)}
            theme="snow"
            placeholder="Enter company description..."
            style={{
              height: "250px",
              width: "100%",
              margin: "10px 0",
              border: `1px solid #000`,
            }}
          />
          <InputBase
            placeholder="Created By User ID"
            name="company_created_by_user_id"
            value={company.company_created_by_user_id}
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
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddCompany}
            sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
          >
            Add Company
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

export default AddCompany;
