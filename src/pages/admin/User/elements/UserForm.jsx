// components/User/elements/UserForm.js
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUser, updateUser } from "../../../../services/userService";

const UserForm = ({ user, handleClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNo: user?.phoneNo || "",
      password: "",
      role: user?.role || "user",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      if (user) {
        await updateUser(user._id, data);
      } else {
        await createUser(data);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error submitting user:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 500,
        maxWidth: "90%",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        {user ? "Edit User" : "Create New User"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="phoneNo"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="password"
              control={control}
              rules={user ? {} : { required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={user ? "New Password (leave blank to keep current)" : "Password"}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Role"
                  fullWidth
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitLoading}>
            {submitLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;