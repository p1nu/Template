import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // Ensure moment is installed

// Import components from other pages
import AddService from '../company/AddService';
import AddCompany from '../company/AddCompany';
import AddServiceByCompany from '../company/AddServiceByCompany';
import AddNews from '../news/AddNews';
import AddContact from '../contact/AddContact';
import AddCSR from '../csr/AddCSR';
// Import other necessary components as needed

import {
  Box,
  IconButton,
  Button,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Paper,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "react-data-table-component";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  return (
    <Box p={3}>
      <Homepage />
      <Footer />
    </Box>
  );
};

// Footer
const Footer = () => {
  const [footerData, setFooterData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedName, setEditedName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/footer`);
        setFooterData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingRow(item.id);
    setEditedContent(item.content);
    setEditedName(item.name);
    setOpenEditDialog(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/footer/${editingRow}`, {
        content: editedContent,
        name: editedName,
      });
      setFooterData(footerData.map(item => item.id === editingRow ? { ...item, content: editedContent, name: editedName, date: response.data.date } : item));
      setEditingRow(null);
      setOpenEditDialog(false);
      toast.success('Footer updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update footer');
    }
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setEditingRow(null);
  };

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
        </Box>
      ),
      wrap: true,
      width: "100px",
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => moment(row.date).format('DD-MM-YYYY'),
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Footer Section
      </Typography>
      <DataTable
        columns={columns}
        data={footerData}
        keyField="id"
        highlightOnHover
        pointerOnHover
        responsive
        pagination
      />
      <Dialog
        open={openEditDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Footer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <ReactQuill
            value={editedContent}
            onChange={setEditedContent}
            theme="snow"
            style={{ height: 300 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

const Homepage = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        About section Homepage
      </Typography>
      <Typography variant="body1">
        Welcome to the homepage section. Here you can find various information and updates.
      </Typography>
    </Paper>
  );
}

export default Dashboard;