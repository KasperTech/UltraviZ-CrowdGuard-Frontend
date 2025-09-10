import { Fragment, useState } from "react";
import {
  Box,
  Container,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Breadcrumbs from "../../../components/Breadcrumbs";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Forms" },
  { label: "Fields" },
];

const Fields = () => {
  // Options to be dynamically passed to components
  const singleSelectOptions = ["Option 1", "Option 2", "Option 3"];
  const multiSelectOptions = ["Option A", "Option B", "Option C"];
  const radioOptions = ["Option X", "Option Y", "Option Z"];
  const checkboxOptions = ["Check 1", "Check 2", "Check 3"];

  return (
    <Container maxWidth={1200} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Form Fields
      </Typography>
      <Breadcrumbs items={breadcrumbItems} />
      <Box component="main" sx={{ mt: 4 }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 0, md: 4 }, borderRadius: 5, border: "none" }}
        >
          <Grid container spacing={2} rowSpacing={6}>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* Password */}
              <PasswordField />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* Single Select */}
              <SingleSelectField
                label="Single Select"
                options={singleSelectOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* MultiSelect */}
              <MultiSelectField
                label="Multi Select"
                options={multiSelectOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* MultiSelect Tags */}
              <MultiSelectTagsField
                label="Multi Select Tags"
                options={multiSelectOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* Radio Buttons */}
              <RadioField label="Radio Options" options={radioOptions} />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* Single Checkbox */}
              <SingleCheckboxField
                label="Single Checkbox"
                options={checkboxOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              {/* Multi Checkbox */}
              <MultiCheckboxField
                label="Multi Checkbox"
                options={checkboxOptions}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Fields;

// Password Field Component
const PasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Fragment>
      <InputLabel htmlFor="password" sx={{ mb: 1 }}>
        Password
      </InputLabel>
      <TextField
        fullWidth
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              onClick={() => setShowPassword((prev) => !prev)}
              sx={{ cursor: "pointer" }}
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                width="1.2em"
                height="1.2em"
              />
            </InputAdornment>
          ),
        }}
      />
    </Fragment>
  );
};

// Single Select Component
const SingleSelectField = ({ label, options }) => {
  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <Select fullWidth>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Fragment>
  );
};

// Multi Select Component
const MultiSelectField = ({ label, options }) => {
  const [selected, setSelected] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <Select multiple value={selected} onChange={handleChange} fullWidth>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Fragment>
  );
};

// Multi Select with Tags Component
const MultiSelectTagsField = ({ label, options }) => {
  const [selected, setSelected] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  // Handle deleting an option from the selected list
  const handleDelete = (optionToDelete) => {
    setSelected((prevSelected) =>
      prevSelected.filter((option) => option !== optionToDelete)
    );
  };

  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        fullWidth
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Fragment>
  );
};

// Radio Button Component
const RadioField = ({ label, options }) => {
  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <RadioGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </Fragment>
  );
};

// Single Checkbox Component
const SingleCheckboxField = ({ label, options }) => {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    setSelected(event.target.name);
  };

  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selected === option}
                onChange={handleChange}
                name={option}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </Fragment>
  );
};

// Multi Checkbox Component
const MultiCheckboxField = ({ label, options }) => {
  const [selected, setSelected] = useState([]);

  const handleChange = (event) => {
    const value = event.target.name;
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Fragment>
      <InputLabel sx={{ mb: 1 }}>{label}</InputLabel>
      <FormGroup>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selected.includes(option)}
                onChange={handleChange}
                name={option}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </Fragment>
  );
};
