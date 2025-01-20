import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const GalleryContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const GalleryProvider = ({ children }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]); // Store all uploaded images
  const [insertImageCallback, setInsertImageCallback] = useState(null);

  const openGallery = (callback) => {
    setInsertImageCallback(() => callback);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setInsertImageCallback(null);
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/image/all`); // Adjust the URL accordingly
      const data = response.data;
      data.reverse();

      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Fetch images when the gallery opens
  useEffect(() => {
    if (isGalleryOpen) {
      fetchImages();
    }
  }, [isGalleryOpen]);

  const selectImage = (image) => {
    if (insertImageCallback) {
      const fullImageUrl = `${API_BASE_URL}/uploads/${image.il_path}`;
      insertImageCallback(fullImageUrl);
      setInsertImageCallback(null);
    }
    closeGallery();
  };

  return (
    <GalleryContext.Provider
      value={{
        isGalleryOpen,
        openGallery,
        closeGallery,
        images,
        selectImage,
        selectedImage,
        fetchImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);