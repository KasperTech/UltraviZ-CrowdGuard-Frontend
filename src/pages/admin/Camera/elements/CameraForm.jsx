import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid2 as Grid,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createCamera, updateCamera } from "../../../../services/cameraService";

const CameraForm = ({ camera, entrances, handleClose, onSuccess }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [roiExpanded, setRoiExpanded] = useState(false);
  const [locationExpanded, setLocationExpanded] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      entranceId: camera?.entrance?._id || "",
      deviceId: camera?.deviceId || "",
      name: camera?.name || "",
      streamUrl: camera?.streamUrl || "",
      roi: camera?.roi || { x: 0, y: 0, width: 0, height: 0 },
      isActive: camera?.isActive !== undefined ? camera.isActive : true,
      ipAddress: camera?.ipAddress || "",
      location: camera?.location || { latitude: "", longitude: "" },
      threshold: camera?.threshold || 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      if (camera) {
        await updateCamera(camera._id, data);
      } else {
        await createCamera(data);
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error submitting camera:", error);
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
        {camera ? "Edit Camera" : "Add New Camera"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="entranceId"
              control={control}
              rules={{ required: "Route is required" }}
              render={({ field }) => (
                <Autocomplete
                  options={entrances}
                  getOptionLabel={(option) => option.name}
                  value={entrances.find(e => e._id === field.value) || null}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue._id : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Route"
                      error={!!errors.entranceId}
                      helperText={errors.entranceId?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Controller
              name="deviceId"
              control={control}
              rules={{ required: "Device ID is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Device ID"
                  fullWidth
                  error={!!errors.deviceId}
                  helperText={errors.deviceId?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Camera name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Camera Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
          <Controller
            name="threshold"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Threshold"
                type="number"
                fullWidth
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                error={!!errors.threshold}
                helperText={errors.threshold?.message}
              />
            )}
          />
        </Grid>

          <Grid size={{ xs: 6 }}>
            <Controller
              name="ipAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="IP Address"
                  fullWidth
                  error={!!errors.ipAddress}
                  helperText={errors.ipAddress?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="streamUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stream URL"
                  fullWidth
                  error={!!errors.streamUrl}
                  helperText={errors.streamUrl?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Accordion expanded={roiExpanded} onChange={() => setRoiExpanded(!roiExpanded)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>ROI Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="roi.L1"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="L1 Value"
                          type="number"
                          fullWidth
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="roi.L2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="L2 Value"
                          type="number"
                          fullWidth
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Accordion expanded={locationExpanded} onChange={() => setLocationExpanded(!locationExpanded)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Location</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="location.latitude"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Latitude"
                          fullWidth
                          error={!!errors.latitude}
                          helperText={errors.latitude?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="location.longitude"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Longitude"
                          fullWidth
                          error={!!errors.longitude}
                          helperText={errors.longitude?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid size={{ xs: 12 }}>
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

export default CameraForm;