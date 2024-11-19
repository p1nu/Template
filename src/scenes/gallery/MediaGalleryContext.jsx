
import React, { createContext, useContext, useState } from 'react';

const MediaGalleryContext = createContext();

export const MediaGalleryProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setOpen1(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);
  const handleClose2 = () => setOpen2(false);
  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <MediaGalleryContext.Provider
      value={{ open, open1, open2, value, handleOpen, handleOpen1, handleOpen2, handleClose, handleClose1, handleClose2, handleChange }}
    >
      {children}
    </MediaGalleryContext.Provider>
  );
};

export const useMediaGallery = () => useContext(MediaGalleryContext);