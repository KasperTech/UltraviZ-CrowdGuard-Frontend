import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";

import Breadcrumbs from "../../../components/Breadcrumbs";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Form" },
  { label: "Simple Forms" },
];

const SimpleForm = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [modalSubmittedData, setModalSubmittedData] = useState(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    setSubmittedData(data);
    reset(); // Clear the form after submission
  };

  const onModalSubmit = (data) => {
    setModalSubmittedData(data);
  };

  return (
    <Container maxWidth="xl" sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Simple Forms
      </Typography>
      <Breadcrumbs items={breadcrumbItems} />
      <Box component="main" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* User Form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <UserForm
              register={register}
              handleSubmit={handleSubmit(onSubmit)}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 0, md: 4 },
                borderRadius: 5,
                border: "none",
                height: "100%",
              }}
            >
              {/* User Form Data */}
              <Box sx={{ height: "50%" }}>
                <Typography variant="h6">Form Data:</Typography>
                <Typography fontSize="1rem" mt={2} lineHeight={2}>
                  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </Typography>
              </Box>

              {/* Modal Form Data */}
              <Typography variant="h6">Modal Form Data:</Typography>
              <Typography fontSize="1rem" mt={2} lineHeight={2}>
                <pre>{JSON.stringify(modalSubmittedData, null, 2)}</pre>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SimpleForm;

const UserForm = ({ register, handleSubmit, errors }) => {
  const roles = ["Admin", "Manager", "Employee"];
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 0, md: 4 }, borderRadius: 5, border: "none" }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              User Form
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="firstName" sx={{ mb: 1 }}>
              First Name
            </InputLabel>
            <TextField
              fullWidth
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="lastName" sx={{ mb: 1 }}>
              Last Name
            </InputLabel>
            <TextField
              fullWidth
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="email" sx={{ mb: 1 }}>
              Email
            </InputLabel>
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="phone" sx={{ mb: 1 }}>
              Phone
            </InputLabel>
            <TextField
              fullWidth
              placeholder="Phone"
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="password" sx={{ mb: 1 }}>
              Password
            </InputLabel>
            <TextField
              fullWidth
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon
                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                        width="0.75em"
                        height="0.75em"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputLabel htmlFor="role" sx={{ mb: 1 }}>
              Role
            </InputLabel>
            <Select
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography color="textDisabled">Select Role</Typography>
                  );
                }
                return selected;
              }}
            >
              {roles.map((role, i) => (
                <MenuItem key={i} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => setOpen(true)}
            >
              Modal Form
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Modal Form */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            borderRadius: 5,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Modal Form
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="firstName" sx={{ mb: 1 }}>
                First Name
              </InputLabel>
              <TextField
                fullWidth
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="lastName" sx={{ mb: 1 }}>
                Last Name
              </InputLabel>
              <TextField
                fullWidth
                placeholder="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="email" sx={{ mb: 1 }}>
                Email
              </InputLabel>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="phone" sx={{ mb: 1 }}>
                Phone
              </InputLabel>
              <TextField
                fullWidth
                placeholder="Phone"
                type="tel"
                {...register("phone", { required: "Phone number is required" })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="password" sx={{ mb: 1 }}>
                Password
              </InputLabel>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <Icon
                          icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                          width="0.75em"
                          height="0.75em"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InputLabel htmlFor="role" sx={{ mb: 1 }}>
                Role
              </InputLabel>
              <Select
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography color="textDisabled">Select Role</Typography>
                    );
                  }
                  return selected;
                }}
              >
                {roles.map((role, i) => (
                  <MenuItem key={i} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Paper>
  );
};
