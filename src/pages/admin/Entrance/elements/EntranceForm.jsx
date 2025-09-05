import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { createEntrance, updateEntrance } from "../../../../services/entranceService";

const EntranceForm = ({ entrance, handleClose, onSuccess }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: entrance?.name || "",
      description: entrance?.description || "",
      threshold: entrance?.threshold || 0, // Changed from thresholdMedium/thresholdHigh
      isActive: entrance?.isActive !== undefined ? entrance.isActive : true,
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      if (entrance) {
        await updateEntrance(entrance._id, data);
      } else {
        await createEntrance(data);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error submitting entrance:", error);
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
        width: 600,
        maxWidth: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        {entrance ? "Edit Entrance" : "Add New Entrance"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Entrance Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="threshold"
              control={control}
              rules={{ 
                required: "Threshold is required",
                min: { value: 0, message: "Threshold must be positive" }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Threshold"
                  type="number"
                  fullWidth
                  error={!!errors.threshold}
                  helperText={errors.threshold?.message}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Active"
                />
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

export default EntranceForm;