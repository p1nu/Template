import React, { useCallback, useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../global/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const API_BASE_URL = process.env.APP_API_URL;

const Dropzone = ({ onDrop }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { open, open1, open2, handleClose, handleClose1, value, handleChange } = useMediaGallery();
  const { user } = useContext(AuthContext);

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
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleDrop = async (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
    setPreviewFiles([...acceptedFiles]);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("il_created_by_user_id", user?.user_id);

    try {
      await axios.post(`${API_BASE_URL}/image/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image uploaded successfully");
      fetchImages();
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/image/all`);
      const { data } = response;
      setImages(data);
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (previewFiles.length > 0) {
      toast(`${previewFiles.length} file(s) added to preview`)
    }
  }, [previewFiles]);

  const handleSelectImage = (image) => {
    if (onSelectImage) {
      onSelectImage(image); // Pass the image path and id back to the parent
      handleClose();
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
                  src={`${API_BASE_URL}/uploads/${item.il_path}`}
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
                            `${API_BASE_URL}/image/delete/${item.il_id}`
                          );
                          toast.success("Image deleted successfully");
                          setImages(
                            images.filter((img) => img.il_id !== item.il_id)
                          );
                        } catch (error) {
                          toast.error("An error occurred");
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
      <Box>
        <Modal
          open={open1}
          onClose={handleClose1}
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

function MediaGallery() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const onSelectImage = (image) => {
    console.log("Selected image: ", image);
  };

  const [images, setImages] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/image/all`);
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
                  src={`${API_BASE_URL}/uploads/${item.il_path}`}
                  alt={item.il_name}
                  loading="lazy"
                  onClick={() =>
                    window.open(
                      `${API_BASE_URL}/uploads/${item.il_path}`,
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
                            `${API_BASE_URL}/image/delete/${item.il_id}`
                          );
                          toast.success("Image deleted successfully");
                          setImages(
                            images.filter((img) => img.il_id !== item.il_id)
                          );
                        } catch (error) {
                          toast.error("An error occurred");
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
        </Box>
        <ToastContainer theme="colored" autoClose={2000}/>
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
