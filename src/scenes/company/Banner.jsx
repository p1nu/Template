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
} from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { MediaLibrary } from "../gallery/Index"; // Adjust the import path as needed
import { useParams } from "react-router-dom";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { set } from "date-fns";

const Banner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const companyId = useParams().id;

  const [banners, setBanners] = useState([]);
  const [openMediaLibrary, setOpenMediaLibrary] = useState(false);

  const { open, handleOpen, handleClose } = useMediaGallery();

  // Fetch banners associated with the company
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/banner/company/${companyId}`
      );
      setBanners(response.data[0]);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [companyId]);

  // Handle image selection from Media Library
  const handleSelectImage = async (image) => {
    try {
      const payload = {
        banner_name: image.il_name,
        banner_company_id: companyId,
        banner_image_id: image.il_id,
      };

      await axios.post("http://localhost:3030/banner/new", payload);

      fetchBanners(); // Refresh the banner list
      toast.success("Banner added successfully.");
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Failed to add banner.");
    }
  };

  // Add these new state variables
  const [openSliderModal, setOpenSliderModal] = useState(false);
  const [openValueModal, setOpenValueModal] = useState(false);
  const [openMissionModal, setOpenMissionModal] = useState(false);
  const [openVisionModal, setOpenVisionModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [openTodo, setOpenTodo] = useState(false);

  // Function to handle image click
  const handleImageSelect = (banner) => {
    setSelectedBanner(banner);
    setOpenTodo(true);
  };

  // Function to handle adding banner to slider
  const handleAddToSlider = async () => {
    try {
      await axios.put(
        `http://localhost:3030/banner/${selectedBanner.banner_id}/add-to-slider`
      );
      toast.success("Banner updated to show in slider.");
      setOpenSliderModal(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner.");
    }
  };

  // Function to handle adding to value
  const handleAddToValue = async () => {
    try {
      await axios.put(
        `http://localhost:3030/banner/${selectedBanner.banner_id}/add-to-value`
      );
      toast.success("Banner added to value.");
      setOpenValueModal(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  }

  // Function to handle adding to mission
  const handleAddToMission = async () => {
    try {
      await axios.put(
        `http://localhost:3030/banner/${selectedBanner.banner_id}/add-to-mission`
      );
      toast.success("Banner added to mission.");
      setOpenMissionModal(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  }

  // Function to handle adding to vision
  const handleAddToVision = async () => {
    try {
      await axios.put(
        `http://localhost:3030/banner/${selectedBanner.banner_id}/add-to-vision`
      );
      toast.success("Banner added to vision.");
      setOpenVisionModal(false);
      fetchBanners(); // Refresh banners if needed
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  }

  const handleCloseTodo = () => {
    setOpenTodo(false);
    setSelectedBanner(null);
  };

  // Function to open slider modal
  const handleOpenSlider = () => {
    setOpenTodo(false);
    setOpenSliderModal(true);
  };

  // Function to open value modal
  const handleOpenValue = () => {
    setOpenTodo(false);
    setOpenValueModal(true);
  };

  // Function to open mission modal
  const handleOpenMission = () => {
    setOpenTodo(false);
    setOpenMissionModal(true);
  };

  // Function to open vision modal
  const handleOpenVision = () => {
    setOpenTodo(false);
    setOpenVisionModal(true);
  };

  // Function to close value modal without action
  const handleCloseValueModal = () => {
    setOpenValueModal(false);
    setSelectedBanner(null);
  };

  // Function to close mission modal without action
  const handleCloseMissionModal = () => {
    setOpenMissionModal(false);
    setSelectedBanner(null);
  };

  // Function to close vision modal without action
  const handleCloseVisionModal = () => {
    setOpenVisionModal(false);
    setSelectedBanner(null);
  };

  // Function to close modal without action
  const handleCloseSliderModal = () => {
    setOpenSliderModal(false);
    setSelectedBanner(null);
  };

  return (
    <Box m="20px">
      <Header title="Banner Images" />

      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: colors.blueAccent[200] }}
        onClick={handleOpen}
      >
        Add Banner Image
      </Button>

      {/* Media Library Modal */}
      <Modal open={open} onClose={handleClose}>
        <MediaLibrary onSelectImage={handleSelectImage} />
      </Modal>

      {/* Display Banner Images */}
      <Box mt={2} height="60vh">
        <ImageList sx={{ width: "100%", height: "inherit" }} cols={3} gap={16}>
          {banners.toReversed().map((banner) => (
            <ImageListItem
              key={banner.banner_id}
              sx={{
                cursor: "pointer",
                border: `2px solid ${colors.grey[800]}`,
                "&:hover": {
                  border: `2px solid ${colors.primary[500]}`,
                },
              }}
            >
              <img
                src={`http://localhost:3030/uploads/${banner.image_path}`}
                alt={`Banner ${banner.banner_id}`}
                loading="lazy"
                style={{ width: "100%", height: "auto" }}
                onClick={() => handleImageSelect(banner)}
              />
              <ImageListItemBar
                title={banner.banner_name}
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    aria-label={`info about ${banner.banner_name}`}
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:3030/banner/delete/${banner.banner_id}`
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
            </ImageListItem>
          ))}
        </ImageList>
        {/* Other components and JSX */}

        {/* Modal Component */}
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
              <Button variant="contained" onClick={handleOpenValue}>Add to Value</Button>
              <Button variant="contained" onClick={handleOpenMission}>Add to Mission</Button>
              <Button variant="contained" onClick={handleOpenVision}>Add to Vision</Button>
              <Button variant="contained" onClick={handleOpenSlider}>Add to Slider</Button>
            </Box>
          </Box>
        </Modal>
        {/* Modal Value */}
        <Modal open={openValueModal} onClose={handleCloseValueModal}>
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
              Add this banner to value section?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseValueModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToValue}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Modal Mission */}
        <Modal open={openMissionModal} onClose={handleCloseMissionModal}>
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
              Add this banner to mission section?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseMissionModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToMission}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Modal Vision */}
        <Modal open={openVisionModal} onClose={handleCloseVisionModal}>
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
              Add this banner to vision section?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseVisionModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToVision}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* Modal Slider */}
        <Modal open={openSliderModal} onClose={handleCloseSliderModal}>
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
              Add this banner to the slider?
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseSliderModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddToSlider}>
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

export default Banner;
