import React, { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Button,
  Checkbox,
  TableSortLabel,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const ResponsiveTable = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  metaData,
  loading,
  data,
  columns,
  renderCard,
  selectable = false,
  multiSelect = false,
  onSelect = () => {},
  sortConfig = {},
  bulkActions = [],
  showActions = true,
  showMoreActions = true,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  // Handle Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Sorting
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  // Handle Selection
  const handleRowSelect = (row) => {
    if (multiSelect) {
      const newSelection = selectedRows.includes(row)
        ? selectedRows.filter((selected) => selected !== row)
        : [...selectedRows, row];
      setSelectedRows(newSelection);
      onSelect(newSelection);
    } else {
      setSelectedRows([row]);
      onSelect([row]);
    }
  };

  // "Select All" Checkbox
  const handleSelectAll = () => {
    const allSelected = selectedRows.length === paginatedData.length;
    const newSelection = allSelected ? [] : [...paginatedData];
    setSelectedRows(newSelection);
    onSelect(newSelection);
  };

  const getSortedData = () => {
    if (!sortBy || !sortConfig[sortBy]) return data;

    return data.sort((a, b) => {
      const orderMultiplier = sortOrder === "asc" ? 1 : -1;
      const compareFn = sortConfig[sortBy];
      return compareFn(a[sortBy], b[sortBy]) * orderMultiplier;
    });
  };
  const sortedData = getSortedData();
  const paginatedData = sortedData;

  return (
    <Fragment>
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Box mb={2} mx={4} display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">
            {selectedRows.length} selected
          </Typography>
          <Box>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="contained"
                color={action.color || "primary"}
                onClick={() => action.onClick(selectedRows)}
                sx={{ margin: 0.5 }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {isSmallScreen ? (
        paginatedData.map((row, index) => (
          <Card key={index} sx={{ margin: 2 }}>
            <CardContent>{renderCard(row)}</CardContent>
          </Card>
        ))
      ) : (
        <TableContainer>
          <Divider />
          <Table>
            <TableHead sx={{ background: "#f8f8f8" }}>
              <TableRow>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < paginatedData.length
                      }
                      checked={
                        selectedRows.length > 0 &&
                        selectedRows.length === paginatedData.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{ fontWeight: 600, fontSize: "1rem" }}
                    style={index === 0 ? { paddingLeft: "48px" } : {}}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortBy === column.key}
                        direction={sortOrder}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    rowSpan={5}
                    colSpan={
                      selectable ? columns.length + 2 : columns.length + 1
                    }
                    sx={{
                      p: 0,
                    }}
                  >
                    <Box
                      sx={{
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(row)}
                            onChange={() => handleRowSelect(row)}
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          style={colIndex === 0 ? { paddingLeft: "48px" } : {}}
                        >
                          {column.render
                            ? column.render(row)
                            : row[column.key] || ""}
                        </TableCell>
                      ))}
                      {showActions && (
                        <TableCell sx={{ display: "flex" }}>
                          {row.actions.map((action, actionIndex) => (
                            <Box key={actionIndex}>
                              {action.label ? (
                                <Button
                                  variant="contained"
                                  color={action.color || "primary"}
                                  onClick={action.onClick}
                                  sx={{ margin: 0.5 }}
                                  startIcon={action.icon && action.icon}
                                >
                                  {action.label}
                                </Button>
                              ) : (
                                <>
                                  {showMoreActions && (
                                    <Tooltip title="More" placement="right">
                                      <IconButton
                                        onClick={(e) => {
                                          setAnchorEl(e.currentTarget);
                                          setSelectedRow(row);
                                        }}
                                      >
                                        {action.icon}
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {/* More Actions */}
                                  <Menu
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                      vertical: "center",
                                      horizontal: "left",
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                  >
                                    <MenuItem disabled>More Actions</MenuItem>
                                    {action.moreActions.map((item, i) => (
                                      <MenuItem
                                        key={i}
                                        onClick={() => {
                                          item.onClick(selectedRow);
                                          setAnchorEl(null);
                                        }}
                                        sx={{
                                          background: item.color && item.color,
                                          m: 1,
                                          borderRadius: 2,
                                          boxShadow: 8,
                                          fontWeight: 600,
                                          "&:hover": {
                                            opacity: 0.8,
                                            background:
                                              item.color && item.color,
                                          },
                                        }}
                                      >
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Menu>
                                </>
                              )}
                            </Box>
                          ))}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={metaData?.count || data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Fragment>
  );
};

// Define prop types for the enhanced component
ResponsiveTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  renderCard: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  sortConfig: PropTypes.objectOf(PropTypes.func),
  filters: PropTypes.object,
  bulkActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      color: PropTypes.string,
    })
  ),
  searchFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    })
  ),
};

export default ResponsiveTable;
