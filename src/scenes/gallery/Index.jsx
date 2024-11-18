import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme.jsx";
import axios from "axios";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { useDropzone } from "react-dropzone";
import Header from "../../components/Header.jsx";
import { MediaGalleryProvider, useMediaGallery } from "./MediaGalleryContext";

const Dropzone = ({ onDrop }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAccepted,
    accept: "image/*",
    multiple: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed",
        borderColor: colors.primary[500],
        borderRadius: "10px",
        padding: "15%",
        textAlign: "center",
        cursor: "pointer",
        bgcolor: isDragActive ? colors.grey[700] : colors.grey[800],
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 50, color: colors.primary[500] }} />
      <Typography variant="h6" color={colors.primary[500]}>
        {isDragActive
          ? "Drop the images here ..."
          : "Drag & drop some images here, or click to select images"}
      </Typography>
    </Box>
  );
};

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const MediaLibrary = ({ onSelectImage }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { open, handleClose, value, handleChange } = useMediaGallery();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "80%",
    bgcolor: colors.grey[900],
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    color: colors.primary[500],
  };

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleDrop = async (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
    setPreviewFiles([...acceptedFiles]);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post("http://localhost:3030/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Image uploaded successfully");
      fetchImages();
    } catch (error) {
      setMessage("An error occurred");
      console.error(error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3030/image/all");
      const { data } = response;
      setImages(data);
    } catch (error) {
      setMessage("An error occurred");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
    if (previewFiles.length > 0) {
      const timer = setTimeout(() => {
        setPreviewFiles([]);
      }, 3000); // Clear preview files after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message, previewFiles]);

  const handleSelectImage = (image) => {
    if (onSelectImage) {
      onSelectImage(image.il_path); // Pass the image path back to the parent
      handleClose(); // Close the modal after selection
    }
  };

  const displayImages = () => {
    if (images.length > 0) {
      return (
        <>
          <ImageList sx={{ width: "100%", height: "inherit" }} cols={3}>
            {images.toReversed().map((item) => (
              <ImageListItem
                key={item.il_id}
                sx={{
                  cursor: "pointer",
                  border: `2px solid ${colors.grey[800]}`,
                  "&:hover": {
                    border: `2px solid ${colors.primary[500]}`,
                  },
                }}
              >
                <img
                  src={`http://localhost:3030/uploads/${item.il_path}`}
                  alt={item.il_name}
                  loading="lazy"
                  onClick={() => handleSelectImage(item)}
                />
                <ImageListItemBar
                  title={item.il_name}
                  subtitle={item.il_desc}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${item.il_name}`}
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:3030/image/delete/${item.il_id}`
                          );
                          setMessage("Image deleted successfully");
                          setImages(
                            images.filter((img) => img.il_id !== item.il_id)
                          );
                        } catch (error) {
                          setMessage("An error occurred");
                          console.error(error);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
          {message === "Image uploaded successfully" ? (
            <Typography
              sx={{
                color: colors.greenAccent[600],
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {message}
              <CheckIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "2rem",
                  marginLeft: "10px",
                }}
              />
            </Typography>
          ) : (
            <Typography
              sx={{
                color: colors.redAccent[500],
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {message}
              {message && (
                <DeleteIcon
                  sx={{
                    color: colors.redAccent[500],
                    fontSize: "2rem",
                    marginLeft: "10px",
                  }}
                />
              )}
            </Typography>
          )}
        </>
      );
    }
  };

  return (
    <>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: colors.grey[600] }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Gallery"
                    {...a11yProps(0)}
                    sx={{
                      bgcolor:
                        value === 0 ? colors.grey[700] : colors.grey[700],
                      borderRadius: "10px 10px 0 0",
                      color: colors.primary[500],
                      "&.Mui-selected": {
                        bgcolor: colors.primary[500],
                        color: colors.grey[900],
                      },
                    }}
                  />
                  <Tab
                    label="Upload"
                    {...a11yProps(1)}
                    sx={{
                      bgcolor:
                        value === 0 ? colors.grey[700] : colors.grey[700],
                      borderRadius: "10px 10px 0 0",
                      color: colors.primary[500],
                      "&.Mui-selected": {
                        bgcolor: colors.primary[500],
                        color: colors.grey[900],
                      },
                    }}
                  />
                </Tabs>
              </Box>

              <CustomTabPanel value={value} index={0}>
                <Box mt={2} height={"50vh"}>
                  {displayImages()}
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Dropzone onDrop={handleDrop} />
                <Box mt={2}>
                  {message === "Image uploaded successfully" ? (
                    <Typography
                      sx={{
                        color: colors.greenAccent[600],
                        fontSize: "1.5rem",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {message}
                      <CheckIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "2rem",
                          marginLeft: "10px",
                        }}
                      />
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        color: colors.redAccent[500],
                        fontSize: "1.5rem",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {message && (
                        <DangerousIcon
                          sx={{
                            color: colors.redAccent[500],
                            fontSize: "2rem",
                            marginLeft: "10px",
                          }}
                        />
                      )}
                    </Typography>
                  )}
                  {previewFiles.length > 0 && (
                    <Box
                      mt={2}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      {previewFiles.map((file, index) => (
                        <Typography key={index} variant="h5">
                          {file.name}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </CustomTabPanel>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

const MediaGallery = () => {
  const onSelectImage = (image) => {
    console.log("Selected image: ", image);
  };

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:3030/image/all");
      const { data } = response;
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Box m={"20px"}>
      <Header title="Media Gallery" />
      {OpenMediaButton()}
      {MediaLibrary(onSelectImage)}
      <>
        <Box height="70vh">
          <ImageList sx={{ width: "100%", height: "inherit" }} cols={3}>
            {images.toReversed().map((item) => (
              <ImageListItem
                key={item.il_id}
                sx={{
                  cursor: "pointer",
                  border: `2px solid ${colors.grey[800]}`,
                  "&:hover": {
                    border: `2px solid ${colors.primary[500]}`,
                  },
                }}
              >
                <img
                  src={`http://localhost:3030/uploads/${item.il_path}`}
                  alt={item.il_name}
                  loading="lazy"
                  onClick={() =>
                    window.open(
                      `http://localhost:3030/uploads/${item.il_path}`,
                      "_blank"
                    )
                  }
                />
                <ImageListItemBar
                  title={item.il_name}
                  subtitle={item.il_desc}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${item.il_name}`}
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:3030/image/delete/${item.il_id}`
                          );
                          setMessage("Image deleted successfully");
                          setImages(
                            images.filter((img) => img.il_id !== item.il_id)
                          );
                        } catch (error) {
                          setMessage("An error occurred");
                          console.error(error);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
          {message === "Image uploaded successfully" ? (
            <Typography
              sx={{
                color: colors.greenAccent[600],
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {message}
              <CheckIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "2rem",
                  marginLeft: "10px",
                }}
              />
            </Typography>
          ) : (
            <Typography
              sx={{
                color: colors.redAccent[500],
                fontSize: "1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {message}
              {message && (
                <DeleteIcon
                  sx={{
                    color: colors.redAccent[500],
                    fontSize: "2rem",
                    marginLeft: "10px",
                  }}
                />
              )}
            </Typography>
          )}
        </Box>
      </>
    </Box>
  );
};

const OpenMediaButton = () => {
  const { handleOpen } = useMediaGallery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Button
        component="label"
        tabIndex={-1}
        onClick={handleOpen}
        variant="contained"
        sx={{
          backgroundColor: colors.primary[400],
          color: colors.grey[900],
        }}
        startIcon={<BrokenImageOutlinedIcon />}
      >
        Open Media
      </Button>
    </>
  );
};

export { MediaGallery, OpenMediaButton, MediaLibrary };
