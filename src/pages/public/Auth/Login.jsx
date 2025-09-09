import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminRoutes } from "../../../routes";

const Login = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      navigate(adminRoutes.starter);
    }
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(adminRoutes.starter);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to login"
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F0F0F0",
      }}
    >
      <Paper
        elevation={4}
        sx={{ p: { xs: 3, md: 6 }, width: "85%", maxWidth: 500 }}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 4 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h4" fontWeight={600} color="primary">
            Login
          </Typography>
          <Typography sx={{ mt: -3 }}>UltraviZ CrowdGuard Login!</Typography>

          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      component={IconButton}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />

          <Button
            variant="contained"
            type="submit"
            sx={{ height: "48px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
