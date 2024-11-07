import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  InputBase,
} from "@mui/material";
import DataTable from "react-data-table-component";
import { tokens } from "../../theme";
import axios from "axios";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

// Example styled-component using transient props
const StyledBox = styled.div`
  display: flex;
  justify-content: ${({ $align }) => $align || "flex-start"};
  align-items: center;
  text-align: center;
  width: 100%;
`;

const Company = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/company/all");
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const result = companies.filter((company) => {
      return (
        company.company_name &&
        company.company_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredCompanies(result);
  }, [search, companies]);

  const columns = [
    { name: "ID", selector: (row) => row.company_id, sortable: true, width: "100px" },
    { name: "Company Name", selector: (row) => row.company_name, sortable: true, width: "20%" },
    { name: "Acronym", selector: (row) => row.company_acronym, sortable: true, width: "100"},
    {
      name: "Active Status",
      selector: (row) => row.company_status_id,
      sortable: true,
      width: "50%",
      cell: (row) => {
        let status;

        if (row.company_status_id === 1) {
          status = "Active";
        } else if (row.company_status_id === 2) {
          status = "Inactive";
        } else {
          status = "Holding";
        }

        return (
          <StyledBox $align="space-between">
            <Typography color={colors.grey[100]}>{status}</Typography>
            <Link to={`/user/${row.user_id}`} style={{ marginLeft: "auto" }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="outlined" color="error" sx={{ ml: 1 }}>
              Delete
            </Button>
          </StyledBox>
        );
      },
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        // backgroundColor: colors.grey[700], // Set your desired background color here
        // color: colors.grey[100], // Set your desired text color here
        borderTop: `1px solid ${colors.grey[800]}`,
      },
    },
    // subHeader: {
    //   style: {
    //     backgroundColor: colors.grey[700], // Set your desired background color here
    //   },
    // },
  };

  return (
    <Box m="20px">
      <Header title="Company" subTitle="Manage companies" />
      <Box
        m="10px 0 0 0"
        height="auto"
        border={`1px solid ${colors.grey[700]}`}
      >
        <DataTable
          columns={columns}
          data={filteredCompanies}
          pagination
          highlightOnHover
          pointerOnHover
          responsive
          striped
          subHeader
          subHeaderComponent={
            <InputBase
              placeholder={`Search Name`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                ml: 2,
                border: "1px solid",
                borderColor: colors.grey[700],
                borderRadius: "4px",
                width: "150px",
                height: "35px",
                padding: "10px",
                color: colors.grey[100],
                bgcolor: colors.grey[900],
              }}
            />
          }
          customStyles={customStyles}
        />
      </Box>
    </Box>
  );
};

export default Company;
