import { useCallback, useEffect, useMemo, useState } from "react";
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
  Typography,
  Hidden,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import BasicMenu from "src/components/date-menu";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { styled } from "@mui/styles";
import axios from "axios";

import { useAuth } from "../../contexts/AuthUserContext";

const columns = [
  "Name",
  "MID",
  "Term Date",
  "MCC",
  "Tenure years",
  "Volume",
  "Revenue",
  "Risk",
  "Reason",
  "Suggestion",
  "Action",
];

const dbColumnMap = {
  Name: "name",
  MID: "merchant_id",
  "Term Date": "term_date",
  MCC: "mcc",
  "Tenure years": "tenure_years",
  Volume: "volume",
  Revenue: "revenue",
  Risk: "risk",
  Reason: "reason",
  Action: "action",
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

const CustomerTable = ({ update, month, office }) => {
  const { authUser, loading: authLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("MID");
  const [rows, setRows] = useState([]);
  const [riskFilter, setRiskFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [contactedFilter, setContactedFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyMerchants = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${authUser.companyId}/current-merchants-at-risk?termdate=${month}&office=${office}`
        )
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            console.log(res.data.merchants);
            setMerchants(res.data.merchants);
            setRows(res.data.merchants);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if ((!authLoading && authUser && month != "") || undefined) {
      fetchCompanyMerchants();
    }
  }, [authLoading, authUser, month]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const updateCheck = (index) => {
    console.log(index, document.getElementById(index).checked);
    if (document.getElementById(index).checked === true) {
      document.getElementById(index).removeAttribute("checked");
    }

    if (document.getElementById(index).checked === false) {
      document.getElementById(index).setAttribute("checked", "checked");
    }
  };

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
        return rowValue?.reason?.toUpperCase() === reasonFilter;
      });
    }

    // Reason filtering
    if (contactedFilter !== "") {
      filteredCustomers = filteredCustomers.filter((rowValue) => {
        console.log(rowValue.contacted);
        return rowValue.contacted === contactedFilter;
      });
    }

    setRows(filteredCustomers);
    console.log(filteredCustomers);
  }, [riskFilter, reasonFilter, contactedFilter]);

  function resolveAndDownloadBlob(response) {
    let filename = month + "_report.csv";
    filename = decodeURI(filename);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  const exportFunction = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/export/${authUser.companyId}?termdate=${month}`,
        { method: "POST", responseType: "blob" }
      )
      .then((res) => resolveAndDownloadBlob(res));
  };

  useEffect(() => {
    handleSearchText();
  }, [handleSearchText]);

  useEffect(() => {
    filterRows();
  }, [filterRows]);

  useEffect(() => {}, [orderBy]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - merchants.length) : 0;

    const setHighlight = (index) => {
      document.getElementById(index).setAttribute("style","background-color:lightGray")

    }

    const copy = (index) => {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($('#' + index).text()).select();
        document.execCommand("copy");
        $temp.remove();
        return false;
    }

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
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                mr: "auto",
                mb: 1,
                ml: 1,
                mt: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <BasicMenu callback={update} month={month} />
            </Box>
            <Hidden smDown={true}>
              <TextField
                id="search-by-MID"
                label="Search by MID"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={async () =>
                  await axios
                    .get(
                      `${process.env.NEXT_PUBLIC_API_URL}/searchByMID?company=${authUser.companyId}`
                    )
                    .then((res) => {
                      if (res.data.error) {
                        console.log(res.data.error);
                      }
                    })
                }
              />
            </Hidden>
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
                  <MenuItem value={"LOW"}>Low</MenuItem>
                  <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                  <MenuItem value={"HIGH"}>High</MenuItem>
                </Select>
              </FormControl>
            </Hidden>
            {/* <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="risk-filter-label">Contacted</InputLabel>
                <Select
                  labelId="contacted-filter-label"
                  id="contacted-filter"
                  value={contactedFilter}
                  onChange={(e) => setContactedFilter(e.target.value)}
                  // onFocus={async () =>
                  //   await axios
                  //     .get(
                  //       `${process.env.NEXT_PUBLIC_API_URL}/filterByRisk?company=${authUser.companyId}`
                  //     )
                  //     .then((res) => {
                  //       if (res.data.error) {
                  //         console.log(res.data.error);
                  //       }
                  //     })
                  // }
                  label="contacted"
                >
                  <MenuItem value={true}>Contacted</MenuItem>
                  <MenuItem value={false}> Uncontacted</MenuItem>
                </Select>
              </FormControl> */}
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
              <a onClick={() => exportFunction()}>
                <ExportButton startIcon={<FileDownloadIcon />}>
                  <Hidden smDown={true}>
                    <Typography>Export Report</Typography>
                  </Hidden>
                </ExportButton>
              </a>
            </Box>
          </Box>
          <Card {...month}>
            <PerfectScrollbar>
              <TableContainer sx={{ minWidth: 800, maxHeight: 550 }}>
                <Table stickyHeader key={order}>
                  <TableHead>
                    <TableRow>
                      {columns.map((columnName) => (
                        <TableCell
                          align={columnName === "Contacted" ? "center" : "left"}
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
                              onClick={() =>
                                handleSort(dbColumnMap[columnName])
                              }
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
                      .map((singleCustomer, index) => {
                        const term = new Date(singleCustomer.term_date);
                        const year = term.getUTCFullYear();
                        const fetchMonth =
                          term.getUTCMonth() + 1 < 10
                            ? "0" + (term.getUTCMonth() + 1)
                            : term.getUTCMonth() + 1;
                        const day = "01";
                        const join = [year, fetchMonth].join("-");
                        return (
                          <TableRow hover key={singleCustomer.merchant_id} id={index}>

                            
                            {/* @dev use something like this for checkbox to show contacted
                            
                            {singleCustomer.contacted === true ?

                              <TableCell align="center" padding="checkbox" >
                              <input type="checkbox" id={index.toString}
                              checked onClick={() => document.getElementById(index.toString).checked = !document.getElementById(index.toString).checked}/></TableCell>:
                              <TableCell align="center" padding="checkbox" >
                              <input type="checkbox" id={index.toString}
                              /></TableCell> */}

                            <TableCell>{singleCustomer.name}</TableCell>

                         
                            <TableCell>
                             <a href="www.any-website.com" onClick={() => copy(index + "mid")}>  style={{textDecoration:"underline", cursor:"copy"}} id={index + "mid"}> {singleCustomer.merchant_id}</a>
                            
                              </TableCell>
                            <TableCell>{join}</TableCell>

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
                                color={
                                  riskMap[singleCustomer.risk.toUpperCase()]
                                }
                              >
                                {singleCustomer.risk.toUpperCase()}
                              </SeverityPill>
                            </TableCell>
                            <TableCell>
                              {singleCustomer?.reason?.toUpperCase() ===
                              undefined
                                ? "N/A"
                                : singleCustomer?.reason?.toUpperCase()}
                            </TableCell>
                            <TableCell>
                              {singleCustomer.suggested.toUpperCase()}
                            </TableCell>
                            <TableCell>
                              <FormControl
                                variant="outlined"
                                sx={{ m: 1, minWidth: 120 }}
                              >
                                   <InputLabel id="action-label">Action</InputLabel>
                                <Select
                                  labelId="action-label"
                                  id="action-tabs"
                                  // value={riskFilter}
                                   onChange={() => setHighlight(index)}
                                  label="Action"
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem value={"Email"}>EMAIL</MenuItem>
                                  <MenuItem value={"Call"}>CALL</MenuItem>
                                  <MenuItem value={"Send_Agent"}>
                                    SEND AGENT
                                  </MenuItem>
                                  <MenuItem value={"New_Pos"}>
                                   NEW POS
                                  </MenuItem>
                                  <MenuItem value={"MCA/Loan"}>
                                   MCA/LOAN
                                  </MenuItem>
                                  <MenuItem value={"Lower_Rate"}>
                                    LOWER RATE
                                  </MenuItem>
                                  <MenuItem value={"Surcharge/CD"}>
                                    SURCHARGE/CD
                                  </MenuItem>
                                  <MenuItem value={"CB_Mitigation"}>
                                    CB MITIGATION
                                  </MenuItem>
                                  <MenuItem value={"Other"}>
                                   OTHER
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
