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
import Header from "../../components/Header";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const Banner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const companyId = useParams().id;

  const [banners, setBanners] = useState([]);
  const [openMediaLibrary, setOpenMediaLibrary] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Failed to load banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [companyId]);

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
        banner_company_id: companyId,
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.5)"
        >
          <Box
            bgcolor={colors.grey[900]}
            boxShadow={24}
            p={4}
            borderRadius="10px"
            width="80%"
            maxHeight="80vh"
            overflow="auto"
          >
            <MediaLibrary onSelectImage={handleSelectImage} />
          </Box>
        </Box>
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
                    aria-label={`info about ${banner.banner_name}`}
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

export default Banner;