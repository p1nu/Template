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
import { MediaLibrary } from "../gallery/Index";
import { useParams } from "react-router-dom";
import { useMediaGallery } from "../gallery/MediaGalleryContext";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";

const BannerService = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const serviceId = useParams().id;

  const [banners, setBanners] = useState([]);
  const [message, setMessage] = useState("");

  const { open, handleOpen, handleClose } = useMediaGallery();

  // Fetch banners associated with the service
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/banner/service/${serviceId}`
      );
      setBanners(response.data[0]);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setMessage("Failed to load banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [serviceId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle image selection from Media Library
  const handleSelectImage = async (image) => {
    try {
      const payload = {
        banner_name: image.il_name,
        banner_service_id: serviceId,
        banner_image_id: image.il_id,
      };

      await axios.post("http://localhost:3030/banner/new", payload);

      fetchBanners(); // Refresh the banner list
      setMessage("Banner added successfully.");
    } catch (error) {
      console.error("Error adding banner:", error);
      setMessage("Failed to add banner.");
    }
  };

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
                onClick={() => {
                  window.open(
                    `http://localhost:3030/uploads/${banner.image_path}`
                  );
                }}
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
                          `http://localhost:3030/banner/delete/${banner.banner_id}`
                        );
                        setMessage("Image deleted successfully");
                        fetchBanners();
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
      </Box>

      {/* Display Feedback Message */}
      <Box display="flex" justifyContent="center" mt={2}>
        {message && (
          <Typography
            variant="body1"
            color={message.includes("successfully") ? "green" : "red"}
            mt={2}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BannerService;
