import { Box, Button, Grid2, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme.jsx";
import axios from "axios";
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Header from "../../components/Header.jsx";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Item from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MediaGallery = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState({
    il_name: "",
    il_desc: "",
    il_path: "",
    il_company_id: "",
  })

  const handleUpload = async (event) => {
    const formData = new FormData();
    for (let i = 0; i < event.length; i++) {
      formData.append('images', event[i]);
    }
    try {
      const response = await axios.post("http://localhost:3030/api/upload-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Files uploaded successfully");
      const {data} = response;
      setFiles(data.filename);
      console.log(files);
    } catch (error) {
      alert("Error uploading files");
      console.error(error);
    }
  }

  const handleChange = (e) => {
    setImage({ ...image, [e.target.name]: e.target.value });
  }


  const displayUpload = () => {
    if (files.length > 0) {
      return (
        <Box sx={
          {
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            marginTop: "20px"
          }
        }>
          <Grid container spacing={2}>
            {files.map((file, index) => (
              <Grid size={12}>
                <Box key={index} sx={
                  {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ccc",
                  }
                }>
                  <Box 
                    component={"img"}
                    src={`http://localhost:3030/uploads/${file}`}
                    alt={file}
                    sx={{
                      height: "233px",
                      width: "350px"
                    }}
                    contain
                  />
                  <TextField
                    sx={{ mb: 2 }}
                    label="Name"
                    name="il_name"
                    onChange={handleChange}
                    color="secondary"
                    variant="outlined"
                  />
                  <TextField
                    sx={{ mb: 2 }}
                    label="Description"
                    name="il_desc"
                    onChange={handleChange}
                    color="secondary"
                    variant="outlined"
                  />
                  <TextField
                    sx={{ mb: 2 }}
                    label="Company"
                    name="il_company_id"
                    onChange={handleChange}
                    color="secondary"
                    variant="outlined"
                  />
                  <Box 
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
                gap="20px"
                flexDirection="row"
                flex="1"
              >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      color: colors.primary[400],
                      width: "50%"
                    }}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await axios.post("http://localhost:3030/api/new-image", {
                          il_name: image.il_name,
                          il_desc: image.il_desc,
                          il_path: file,
                          il_company_id: image.il_company_id
                        });
                        alert("Image saved successfully");
                        setFiles(files.filter((img) => img !== file));
                      } catch (error) {
                        alert("Error saving image");
                        console.error(error);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="contained"
                    sx={{
                      backgroundColor: colors.redAccent[500],
                      color: colors.grey[100],
                      width: "50%"
                    }}
                    onClick={
                      async () => {
                        try {
                          const response = await axios.delete('http://localhost:3030/api/delete-images', {
                            data: {
                              il_path: file
                            }
                          })
                          alert("Image deleted successfully")
                          setFiles(files.filter((img) => img !== file))
                        } catch (error) {
                          alert("An error occurred")
                          console.error(error)
                        }
                      }
                    }
                  >
                    Cancel
                  </Button>
                </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    }
  }

  return (
    <>
      <Box m={"20px"}>
        <Header title="Media Gallery" />
        <Box>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[900]
              }}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={
                  event => handleUpload(event.target.files)
                }
                multiple
              />
            </Button>
          </Box>
          <Box>
            {displayUpload()}
          </Box>
        </Box>
      </Box>
    </>
  )
};

export default MediaGallery;