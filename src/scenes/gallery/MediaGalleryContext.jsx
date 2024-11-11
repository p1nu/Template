
import React, { createContext, useContext, useState } from 'react';

const MediaGalleryContext = createContext();

export const MediaGalleryProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <MediaGalleryContext.Provider
      value={{ open, handleOpen, handleClose, value, handleChange }}
    >
      {children}
    </MediaGalleryContext.Provider>
  );
};

export const useMediaGallery = () => useContext(MediaGalleryContext);