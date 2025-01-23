import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  InputBase,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const CSR = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [csr, setCSR] = useState([]);
  const [filteredCSR, setFilteredCSR] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCSR = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/csr/all`);
        setCSR(response.data);
        setFilteredCSR(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching CSR:", error);
        toast.error("Failed to load CSR");
      }
    };

    fetchCSR();
  }, [API_BASE_URL]);

  useEffect(() => {
    const results = csr.filter(
      (entry) =>
        entry.csr_name &&
        entry.csr_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCSR(results);
  }, [search, csr]);

  const handleDeleteCSR = async (csr_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/csr/delete/${csr_id}`);
      toast.success("CSR deleted successfully");
      setCSR((prevCSR) => prevCSR.filter((entry) => entry.csr_id !== csr_id));
      setFilteredCSR((prevFilteredCSR) =>
        prevFilteredCSR.filter((entry) => entry.csr_id !== csr_id)
      );
    } catch (error) {
      console.error("Error deleting CSR:", error);
      toast.error("Error deleting CSR");
    }
  };

  const handleEditCSR = (id) => {
    navigate(`/csr/${id}`);
  };

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <IconButton onClick={() => handleEditCSR(row.csr_id)}>
            <EditIcon sx={{ color: colors.blueAccent[400] }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteCSR(row.csr_id)}>
            <DeleteIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: "ID",
      selector: (row) => row.csr_id,
      sortable: true,
      wrap: true,
      width: "80px",
    },
    {
      name: "Cover Image",
      selector: (row) => row.image_path,
      sortable: true,
      wrap: true,
      width: "150px",
      cell: (row) => (
        <Box height={50} width={50}>
          {row.image_path ? (
            <img
              src={`${API_BASE_URL}/uploads/${row.image_path}`}
              alt={row.csr_name}
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
            />
          ) : (
            <Typography color={colors.grey[100]}>No Logo</Typography>
          )}
        </Box>
      ),
    },
    {
      name: "Title",
      selector: (row) => row.csr_name,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: 'Date',
    //   selector: (row) => new Date(row.csr_date).toLocaleDateString(),
    //   sortable: true,
    //   wrap: true,
    // },
  ];

  return (
    <Box m={2}>
      <Header title="CSR" subTitle="List of all CSR entries" />
      <Box display="flex" justifyContent="start" width="100%" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add-csr")}
          sx={{ backgroundColor: colors.blueAccent[200] }}
        >
          Add CSR
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
            placeholder="Search CSR"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              padding: "10px",
              border: "1px solid #000",
              borderRadius: "4px",
              backgroundColor: colors.grey[900],
              color: colors.grey[100],
              width: "30%",
            }}
          />
        </Box>
        <DataTable
          columns={columns}
          data={filteredCSR}
          keyField="csr_id"
          pageSize={csr.length > 10 ? 10 : csr.length}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default CSR;
