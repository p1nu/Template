import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  InputBase,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../global/AuthContext";
import { useGallery } from "../gallery/GalleryContext";
import Gallery from "../gallery/Gallery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddJob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [job, setJob] = useState({
    job_name: "",
    job_desc: "",
    job_schedule: "",
    job_start_date: "",
    job_end_date: "",
    job_created_by_user_id: user?.user_id || "",
  });
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { openGallery } = useGallery();

  const editorRef = useRef(null);

  // Fetch companies if needed
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/companies/all`);
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, [API_BASE_URL]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  // Handle description changes with TinyMCE
  const handleDescriptionChange = (content) => {
    setJob((prevJob) => ({ ...prevJob, job_desc: content }));
  };

  // Handle form submission to add job
  const handleAddJob = async () => {
    // Basic validation
    if (
      !job.job_name ||
      !job.job_desc ||
      !job.job_schedule ||
      !job.job_start_date ||
      !job.job_end_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/job/new`, job);
      toast.success("Job added successfully");
      setJob({
        job_name: "",
        job_desc: "",
        job_schedule: "",
        job_start_date: "",
        job_end_date: "",
        job_created_by_user_id: user?.user_id || "",
      });
      // Navigate after a short delay to allow the toast to display
      setTimeout(() => {
        navigate("/jobs"); // Navigate to the jobs list or another appropriate page
      }, 3000);
    } catch (error) {
      console.error("Add Job Error:", error);
      toast.error(error.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  const editorSettings = {
    apiKey: import.meta.env.VITE_TINYMCE_API_KEY,
    onInit: (evt, editor) => (editorRef.current = editor),
    value: job.job_desc,
    init: {
      height: 500,
      menubar: true,
      plugins: [
        "anchor",
        "autolink",
        "charmap",
        "codesample",
        "emoticons",
        "image",
        "link",
        "lists",
        "media",
        "searchreplace",
        "table",
        "visualblocks",
        "wordcount",
      ],
      toolbar:
        "undo redo | formatselect | bold italic underline | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | image | help",
      image_title: true,
      automatic_uploads: false,
      file_picker_types: "image",
      file_picker_callback: function (cb, value, meta) {
        openGallery((imageUrl) => {
          cb(imageUrl, { alt: "Selected Image" });
        });
      },
    },
    onEditorChange: handleDescriptionChange,
  };

  return (
    <Box m={2}>
      <Header title="Add New Job" subTitle="Create a new job posting" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={2}
        bgcolor={colors.grey[800]}
        sx={{
          "& .mce-container": {
            width: "100% !important",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          bgcolor={colors.grey[900]}
          borderRadius="8px"
          width="100%"
          boxShadow={3}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
            gap={2}
          >
            {/* Job Information Section */}
            <Box width="55%">
              {/* Job Name, Schedule, and Dates on the same line */}
              <Box display="flex" flexDirection="row" gap={2} width="100%">
                {/* Job Name */}
                <Box display="flex" flexDirection="column" margin="10px 0" width="30%">
                  <InputLabel htmlFor="job_name" sx={{ color: colors.grey[100], mb: "5px" }}>
                    Job Name
                  </InputLabel>
                  <InputBase
                    id="job_name"
                    placeholder="Job Name"
                    name="job_name"
                    value={job.job_name}
                    onChange={handleChange}
                    sx={{
                      padding: "10px",
                      border: "1px solid #000",
                      borderRadius: "4px",
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                    }}
                  />
                </Box>

                {/* Job Schedule */}
                <Box display="flex" flexDirection="column" margin="10px 0" width="30%">
                  <InputLabel htmlFor="job_schedule" sx={{ color: colors.grey[100], mb: "5px" }}>
                    Job Schedule
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="job_schedule"
                      name="job_schedule"
                      value={job.job_schedule}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        border: "1px solid #000",
                        borderRadius: "4px",
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        "&:hover": {
                          border: "1px solid #000 !important",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Schedule
                      </MenuItem>
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                      <MenuItem value="Part-Time">Part-Time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Job Start and End Date */}
                <Box display="flex" flexDirection="row" gap={2} width="40%">
                  {/* Job Start Date */}
                  <Box display="flex" flexDirection="column" margin="10px 0" width="50%">
                    <InputLabel htmlFor="job_start_date" sx={{ color: colors.grey[100], mb: "5px" }}>
                      Start Date
                    </InputLabel>
                    <InputBase
                      id="job_start_date"
                      name="job_start_date"
                      type="date"
                      value={job.job_start_date}
                      onChange={handleChange}
                      sx={{
                        padding: "10px",
                        border: "1px solid #000",
                        borderRadius: "4px",
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                      }}
                    />
                  </Box>

                  {/* Job End Date */}
                  <Box display="flex" flexDirection="column" margin="10px 0" width="50%">
                    <InputLabel htmlFor="job_end_date" sx={{ color: colors.grey[100], mb: "5px" }}>
                      End Date
                    </InputLabel>
                    <InputBase
                      id="job_end_date"
                      name="job_end_date"
                      type="date"
                      value={job.job_end_date}
                      onChange={handleChange}
                      sx={{
                        padding: "10px",
                        border: "1px solid #000",
                        borderRadius: "4px",
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Job Description with TinyMCE */}
          <Box display="flex" flexDirection="column" margin="10px 0" width="100%">
            <InputLabel htmlFor="job_desc" sx={{ color: colors.grey[100], mb: "5px" }}>
              Job Description
            </InputLabel>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={job.job_desc}
              init={editorSettings.init}
              onEditorChange={handleDescriptionChange}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddJob}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: colors.blueAccent[200],
              "&:hover": { backgroundColor: colors.blueAccent[400] },
            }}
          >
            {loading ? "Adding Job..." : "Add Job"}
          </Button>
        </Box>
      </Box>
      <ToastContainer theme="colored" autoClose={2000} />
    </Box>
  );
};

export default AddJob;
