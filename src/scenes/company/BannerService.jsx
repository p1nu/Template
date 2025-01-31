import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  ImageList,
  ImageListItem,
  Modal,
  ImageListItemBar,
  IconButton,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { MediaLibrary } from "../gallery/Index";
import { useParams } from "react-router-dom";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { set } from "date-fns";
// const API_BASE_URL = process.env.APP_API_URL;

const BannerService = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const serviceId = useParams().id;

  const [banners, setBanners] = useState([]);

  const { open, handleOpen, handleClose } = useMediaGallery();

  const [openTodo, setOpenTodo] = useState(false);
  const [openPreview1, setOpenPreview1] = useState(false);
  const [openPreview2, setOpenPreview2] = useState(false);
  const [openPreview3, setOpenPreview3] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // Fetch banners associated with the service
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/banner/service/${serviceId}`
      );
      setBanners(response.data[0]);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [serviceId]);

  // Handle image selection from Media Library
  const handleSelectImage = async (image) => {
    try {
      const payload = {
        banner_name: image.il_name,
        banner_service_id: serviceId,
        banner_image_id: image.il_id,
      };

      await axios.post(`${API_BASE_URL}/banner/new`, payload);

      fetchBanners(); // Refresh the banner list
      toast.success("Banner added successfully.");
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Failed to add banner.");
    }
  };

  // function to handle selected banner and open todo modal
  const handleSelectedBanner = (banner) => {
    setSelectedBanner(banner);
    setOpenTodo(true);
  }

  // function close todo modal if nothing is selected
  const handleCloseTodo = () => {
    setSelectedBanner(null);
    setOpenTodo(false);
  }

  // function to open preview modal 1
  const handleOpenPreview1 = () => {
    setOpenPreview1(true);
    setOpenTodo(false);
  }

  // function to close preview modal 1
  const handleClosePreview1 = () => {
    setOpenPreview1(false);
    setSelectedBanner(null);
  }

  // function to open preview modal 2
  const handleOpenPreview2 = () => {
    setOpenPreview2(true);
    setOpenTodo(false);
  }

  // function to close preview modal 2
  const handleClosePreview2 = () => {
    setOpenPreview2(false);
    setSelectedBanner(null);
  }

  // function to open preview modal 3
  const handleOpenPreview3 = () => {
    setOpenPreview3(true);
    setOpenTodo(false);
  }

  // function to close preview modal 3
  const handleClosePreview3 = () => {
    setOpenPreview3(false);
    setSelectedBanner(null);
  }

  // function add banner to preview 1
  const handleAddToPreview1= async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/banner/${selectedBanner.banner_id}/add-to-preview1`
      );
      toast.success("Banner added to preview1.");
      setOpenPreview1(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
      console.log(error);
    }
  }

  // function add banner to preview 2
  const handleAddToPreview2= async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/banner/${selectedBanner.banner_id}/add-to-preview2`
      );
      toast.success("Banner added to preview2.");
      setOpenPreview2(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  }

  // function add banner to preview 3
  const handleAddToPreview3= async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/banner/${selectedBanner.banner_id}/add-to-preview3`
      );
      toast.success("Banner added to preview3.");
      setOpenPreview3(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  }

  return (
    <Box m="20px">
      <Header title="Service Banner Images" />

      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
        onClick={handleOpen}
      >
        Add Service Banner Image
      </Button>

      {/* Media Library Modal */}
      <Modal open={open} onClose={handleClose}>
        <MediaLibrary onSelectImage={handleSelectImage} />
      </Modal>

      {/* Display Banner Images */}
      <Box mt={2} height="60vh" overflow="auto">
        <Grid container spacing={2}>
          {banners.toReversed().map((banner) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={banner.banner_id}>
              <Box
                sx={{
                  position: "relative",
                  border: `2px solid ${colors.grey[800]}`,
                  "&:hover": {
                    border: `2px solid ${colors.primary[500]}`,
                  },
                  height: "200px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${API_BASE_URL}/uploads/${banner.image_path}`}
                  alt={`Banner ${banner.banner_id}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "scale-down" }}
                  onClick={() => handleSelectedBanner(banner)}
                />
                <ImageListItemBar
                  title={banner.banner_name}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`delete ${banner.banner_name}`}
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${API_BASE_URL}/banner/delete/${banner.banner_id}`
                          );
                          toast.success("Image deleted successfully");
                          fetchBanners();
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
              </Box>
            </Grid>
          ))}
        </Grid>
        {/* Todo Modal */}
        <Modal open={openTodo} onClose={handleCloseTodo}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              width: 300,
            }}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              flexDirection={"column"}
              gap={2}
            >
              <Button variant="contained" onClick={handleOpenPreview1}>Add to Preview1</Button>
              <Button variant="contained" onClick={handleOpenPreview2}>Add to Preview2</Button>
              <Button variant="contained" onClick={handleOpenPreview3}>Add to Preview3</Button>
            </Box>
          </Box>
        </Modal>
        {/* Preview1 Modal */}
        <Modal open={openPreview1} onClose={handleClosePreview1}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              width: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add this banner to preview 1?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleClosePreview1} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToPreview1}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Preview2 Modal */}
        <Modal open={openPreview2} onClose={handleClosePreview2}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              width: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add this banner to preview 2?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleClosePreview2} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToPreview2}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Preview3 Modal */}
        <Modal open={openPreview3} onClose={handleClosePreview3}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              width: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add this banner to preview 3?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleClosePreview3} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToPreview3}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>

      {/* Display Feedback Message */}
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default BannerService;
