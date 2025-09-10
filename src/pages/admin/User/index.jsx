import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Modal,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Loader from "../../../components/Loader";
import ResponsiveTable from "../../../components/ResponsiveTable";
import DeleteRestoreModal from "./elements/RemoveUser";
import { getUsers, deleteUser, restoreUser } from "../../../services/userService";
import UserForm from "./elements/UserForm";
import RenderCard from "./elements/RenderCard";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Users" },
];

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const User = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDeleteRestoreModal, setOpenDeleteRestoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    role: "all",
    status: "all"
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter === "all" ? "" : statusFilter === "active";
      const roleParam = roleFilter === "all" ? "" : roleFilter;

      const res = await getUsers(
        page + 1,
        limit,
        debouncedSearchTerm,
        roleParam,
        statusParam
      );

      const data = res.data.map((user) => {
        const actions = [
          {
            label: "Edit",
            onClick: () => handleUserModal(user),
            color: "primary",
          },
        ];

        if (user.isDeleted) {
          actions.push({
            label: "Restore",
            onClick: () => handleDeleteRestore(user, "restore"),
            color: "success",
          });
        } else {
          actions.push({
            label: "Delete",
            onClick: () => handleDeleteRestore(user, "delete"),
            color: "error",
          });
        }

        return {
          ...user,
          createdAt: new Date(user.createdAt).toLocaleString(),
          updatedAt: new Date(user.updatedAt).toLocaleString(),
          actions,
        };
      });

      setUserData(data);
      setMetaData(res.metadata);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (openFilterModal) {
      setModalFilters({
        role: roleFilter,
        status: statusFilter
      });
    }
  }, [openFilterModal, roleFilter, statusFilter]);

  const handleUserModal = (user = null) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };

  const handleDeleteRestore = (user, action) => {
    setSelectedUser({ ...user, action });
    setOpenDeleteRestoreModal(true);
  };

  const handleDeleteRestoreConfirm = async () => {
    try {
      if (selectedUser.action === "delete") {
        await deleteUser(selectedUser._id);
      } else {
        await restoreUser(selectedUser._id);
      }
      fetchUsers();
      setOpenDeleteRestoreModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilterReset = () => {
    setModalFilters({
      role: "all",
      status: "all"
    });
  };

  const handleApplyFilters = () => {
    setRoleFilter(modalFilters.role);
    setStatusFilter(modalFilters.status);
    setOpenFilterModal(false);
  };

  const columns = [
    { label: "Name", key: "name", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "Phone No.", key: "phoneNo", sortable: true },
    { label: "Role", key: "role", sortable: true },
    { label: "Status", key: "isDeleted", sortable: true, format: (value) => value ? "Deleted" : "Active" },
    { label: "Created At", key: "createdAt", sortable: true },
  ];

  return (
    <Container maxWidth={1200} sx={{ p: { xs: 2, sm: 4 } }}>
      <Box>
        <Typography variant="h5" fontWeight={600} mb={2}>
          User Management
        </Typography>
        <Breadcrumbs items={breadcrumbItems} />
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <Paper sx={{ my: 4, p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Typography variant="h5" fontWeight={600}>
              Users
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Name, Email or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 400 }}
              />
              <Button variant="contained" color="primary" onClick={() => handleUserModal(null)}>
                Create User
              </Button>
              <IconButton onClick={() => setOpenFilterModal(true)}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>

          {loading ? (
            <Loader />
          ) : (
            <ResponsiveTable
              page={page}
              setPage={setPage}
              rowsPerPage={limit}
              setRowsPerPage={setLimit}
              metaData={metaData}
              data={userData}
              columns={columns}
              renderCard={(row) => <RenderCard row={row} />}
            />
          )}
        </Paper>
      </Box>

      <Modal open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <UserForm
          user={selectedUser}
          handleClose={() => setOpenUserModal(false)}
          onSuccess={fetchUsers}
        />
      </Modal>

      <Modal open={openDeleteRestoreModal} onClose={() => setOpenDeleteRestoreModal(false)}>
        <DeleteRestoreModal
          user={selectedUser}
          handleClose={() => setOpenDeleteRestoreModal(false)}
          onConfirm={handleDeleteRestoreConfirm}
        />
      </Modal>

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Filter Users
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ flexDirection: "column", mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                size="medium"
                variant="outlined"
                label="Role"
                value={modalFilters.role}
                onChange={(e) => setModalFilters({ ...modalFilters, role: e.target.value })}
                fullWidth
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                {/* Add other roles as needed */}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                size="medium"
                variant="outlined"
                label="Status"
                value={modalFilters.status}
                onChange={(e) => setModalFilters({ ...modalFilters, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="deleted">Deleted</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset}>Reset Filters</Button>
          <Button onClick={() => setOpenFilterModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default User;