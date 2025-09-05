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
  CircularProgress,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
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
  cardVariant,
  selectable = false,
  multiSelect = false,
  onSelect = () => {},
  sortConfig = {},
  bulkActions = [],
  showActions = true,
  expandable = false,
  subTableProps = {},
  onRowExpand,
  rowStyle = () => ({}),
  disabled = false,
  showPagination = true,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedData, setExpandedData] = useState({});

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

  // Handle Row Selection
  const handleRowSelect = (row) => {
    if (disabled) return;
    if (multiSelect) {
      const isSelected = selectedRows.includes(row);
      const newSelectedRows = isSelected
        ? selectedRows.filter((selected) => selected !== row)
        : [...selectedRows, row];
      setSelectedRows(newSelectedRows);
      onSelect(newSelectedRows.map((r) => r.deviceId));
    } else {
      const newSelectedRow = [row];
      setSelectedRows(newSelectedRow);
      onSelect(newSelectedRow.map((r) => r.deviceId));
    }
  };

  // Handle Row Expansion
  const handleRowExpansion = async (rowId, rowData) => {
    if (disabled) return;
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));

    if (!expandedRows[rowId] && onRowExpand) {
      const fetchedData = await onRowExpand(rowData);
      setExpandedData((prev) => ({
        ...prev,
        [rowId]: fetchedData,
      }));
    }
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
  const hasActions = data.some((row) => row.actions && row.actions.length > 0);

  return (
    <Fragment>
      {selectedRows?.length > 0 && (
        <Box mb={2} mx={4} display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">
            {selectedRows?.length} selected
          </Typography>
          <Box>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="contained"
                color={action.color || "primary"}
                onClick={() =>
                  action.onClick(selectedRows.map((r) => r.deviceId))
                }
                sx={{ margin: 0.5 }}
                disabled={action.disabled || disabled}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {isSmallScreen ? (
        sortedData.map((row, index) => (
          <Card key={index} sx={{ margin: 1 }} variant={cardVariant}>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length + 3}>
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <CardContent>{renderCard(row)}</CardContent>
            )}
          </Card>
        ))
      ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{ background: "#f8f8f8" }}>
              <TableRow>
                {expandable && <TableCell />}
                {selectable && (
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selectedRows?.length > 0 &&
                        selectedRows?.length < data?.length
                      }
                      checked={
                        selectedRows?.length > 0 &&
                        selectedRows?.length === data?.length
                      }
                      onChange={(e) => {
                        if (disabled) return;
                        if (e.target.checked) {
                          setSelectedRows(data);
                          onSelect(data.map((r) => r.deviceId));
                        } else {
                          setSelectedRows([]);
                          onSelect([]);
                        }
                      }}
                      disabled={disabled}
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortBy === column.key}
                        direction={sortOrder}
                        onClick={() => handleSort(column.key)}
                        disabled={disabled}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {showActions && hasActions && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length + 3}>
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {sortedData?.length > 0 ? (
                  sortedData.map((row, index) => (
                    <Fragment key={index}>
                      <TableRow
                        style={{
                          ...rowStyle(row),
                          ...(disabled && {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }),
                        }}
                      >
                        {expandable && (
                          <TableCell>
                            <IconButton
                              onClick={() => handleRowExpansion(index, row)}
                              size="small"
                              disabled={disabled}
                            >
                              {expandedRows[index] ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>
                        )}
                        {selectable && (
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(row)}
                              onChange={() => handleRowSelect(row)}
                              disabled={disabled}
                            />
                          </TableCell>
                        )}
                        {columns.map((column, colIndex) => (
                          <TableCell key={colIndex}>
                            {column.render
                              ? column.render(row)
                              : row[column.key] === 0
                              ? "0"
                              : row[column.key] || ""}
                          </TableCell>
                        ))}
                        {showActions &&
                          hasActions &&
                          row.actions?.length > 0 && (
                            <TableCell
                              sx={{
                                display: "flex",
                                justifyContent: "flex-evenly",
                              }}
                            >
                              {row.actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  onClick={action.onClick}
                                  variant="contained"
                                  color={action.color || "primary"}
                                  sx={{ marginRight: 1 }}
                                  disabled={action.disabled || disabled}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </TableCell>
                          )}
                      </TableRow>
                      {expandable && (
                        <TableRow>
                          <TableCell colSpan={columns.length + 3}>
                            <Collapse
                              in={expandedRows[index]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={2}>
                                <ResponsiveTable
                                  {...subTableProps}
                                  data={expandedData[index] || []}
                                />
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 3} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}

      {showPagination && (
        <TablePagination
          component="div"
          count={metaData?.total_results || data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          disabled={disabled}
        />
      )}
    </Fragment>
  );
};

ResponsiveTable.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  metaData: PropTypes.object,
  loading: PropTypes.bool,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  renderCard: PropTypes.func,
  selectable: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  sortConfig: PropTypes.object,
  bulkActions: PropTypes.array,
  showActions: PropTypes.bool,
  expandable: PropTypes.bool,
  subTableProps: PropTypes.object,
  onRowExpand: PropTypes.func,
  rowStyle: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ResponsiveTable;
