import { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  TextField,
  Hidden
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { styled } from "@mui/styles";
import axios from "axios";

import { useAuth } from "../../contexts/AuthUserContext";

const columns = [
  "MID",
  "MCC",
  "Tenure years",
  "Volume",
  "Revenue",
  "Risk",
  "Reason",
];

const dbColumnMap = {
  MID: "merchant_id",
  MCC: "mcc",
  "Tenure years": "tenure_years",
  Volume: "volume",
  Revenue: "revenue",
  Risk: "risk",
  Reason: "reason",
};

const riskMap = {
  HIGH: "error",
  MEDIUM: "attention",
  LOW: "warning",
};

const numFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ExportButton = styled(Button)({
  textDecoration: "none",
});

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const CustomerTable = (props) => {
  const { authUser, loading: authLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("MID");
  const [rows, setRows] = useState([]);
  const [riskFilter, setRiskFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyMerchants = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${authUser.companyId}/merchants-at-risk`
        )
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            setMerchants(res.data.merchants);
            setRows(res.data.merchants);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (!authLoading && authUser) {
      fetchCompanyMerchants();
    }
  }, [authLoading, authUser]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleSearchText = useCallback(() => {
    let filteredCustomers = merchants;

    // Search filtering
    if (searchText !== "") {
      filteredCustomers = merchants.filter((rowValue) => {
        return rowValue.merchant_id
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }

    setRows(filteredCustomers);
  }, [searchText]);

  const filterRows = useCallback(() => {
    let filteredCustomers = merchants;

    // Risk filtering
    if (riskFilter !== "") {
      filteredCustomers = filteredCustomers.filter((rowValue) => {
        return rowValue.risk.toUpperCase() === riskFilter;
      });
    }

    // Reason filtering
    if (reasonFilter !== "") {
      filteredCustomers = filteredCustomers.filter((rowValue) => {
        return rowValue.reason === reasonFilter;
      });
    }

    setRows(filteredCustomers);
  }, [riskFilter, reasonFilter]);

  useEffect(() => {
    handleSearchText();
  }, [handleSearchText]);

  useEffect(() => {
    filterRows();
  }, [filterRows]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - merchants.length) : 0;

  return (
    <>
      {loading ? (
        <p>Loading merchants...</p>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              mb: 1,
            }}
          >
            <Box sx={{ mr: "auto", mb: 1, ml: 1, mt: 1 }}>
              <TextField
                id="search-by-MID"
                label="Search by MID"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>

            <Hidden smDown={true}>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="risk-filter-label">Risk</InputLabel>
                <Select
                  labelId="risk-filter-label"
                  id="risk-filter"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  onFocus={async () =>
                    await axios
                      .get(
                        `${process.env.NEXT_PUBLIC_API_URL}/filterByRisk?company=${authUser.companyId}`
                      )
                      .then((res) => {
                        if (res.data.error) {
                          console.log(res.data.error);
                        }
                      })
                  }
                  label="Risk"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"low"}>Low</MenuItem>
                  <MenuItem value={"medium"}>Medium</MenuItem>
                  <MenuItem value={"high"}>High</MenuItem>
                </Select>
              </FormControl>
            </Hidden>

            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="reason-filter-label">Reason</InputLabel>
              <Select
                labelId="reason-filter-label"
                id="reason-filter"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                onFocus={async () =>
                  await axios
                    .get(
                      `${process.env.NEXT_PUBLIC_API_URL}/filterByReason?company=${authUser.companyId}`
                    )
                    .then((res) => {
                      if (res.data.error) {
                        console.log(res.data.error);
                      }
                    })
                }
                label="Reason"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"SERVICE"}>Service</MenuItem>
                <MenuItem value={"ECONOMY"}>Economy</MenuItem>
                <MenuItem value={"AGENT"}>Agent</MenuItem>
                <MenuItem value={"PRODUCT"}>Product</MenuItem>
                <MenuItem value={"PRICING"}>Pricing</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 1 }}>
              <a href="/static/MARS_May_2022.xlsx" download>
                <ExportButton startIcon={<FileDownloadIcon />}>
                  Export Report
                </ExportButton>
              </a>
            </Box>
          </Box>
          <Card {...props}>
            <PerfectScrollbar>
              <TableContainer sx={{ minWidth: 800, maxHeight: 550 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((columnName) => (
                        <TableCell
                          sortDirection="desc"
                          key={dbColumnMap[columnName]}
                        >
                          <Tooltip
                            enterDelay={300}
                            title={`Sort ${columnName}`}
                          >
                            <TableSortLabel
                              active={orderBy === dbColumnMap[columnName]}
                              direction={
                                orderBy === dbColumnMap[columnName]
                                  ? order
                                  : "asc"
                              }
                              onClick={createSortHandler(
                                dbColumnMap[columnName]
                              )}
                            >
                              {columnName}
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice()
                      .sort(getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((singleCustomer) => (
                        <TableRow hover key={singleCustomer.merchant_id}>
                          <TableCell>{singleCustomer.merchant_id}</TableCell>
                          <TableCell>{singleCustomer.mcc}</TableCell>
                          <TableCell>{singleCustomer.tenure_years}</TableCell>
                          <TableCell>
                            {numFormatter.format(singleCustomer.volume)}
                          </TableCell>
                          <TableCell>
                            {numFormatter.format(singleCustomer.revenue)}
                          </TableCell>
                          <TableCell>
                            <SeverityPill
                              color={riskMap[singleCustomer.risk.toUpperCase()]}
                            >
                              {singleCustomer.risk}
                            </SeverityPill>
                          </TableCell>
                          <TableCell>{singleCustomer.reason}</TableCell>
                        </TableRow>
                      ))}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </PerfectScrollbar>
            <TablePagination
              rowsPerPageOptions={[50, { value: -1, label: "All" }]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default CustomerTable;
