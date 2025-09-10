import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid2 as Grid,
  FormControlLabel,
  Checkbox,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  OutlinedInput,
  Chip,
  FormGroup,
  RadioGroup,
  Radio,
} from "@mui/material";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UploadFile from "../../../components/UploadFile";
import RichTextEditor from "../../../components/RichTextEditor"; // Import your RichTextEditor

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Products" },
  { label: "Add" },
];

const categoryOptions = [
  { value: "category1", label: "Category 1" },
  { value: "category2", label: "Category 2" },
];

const subCategoryOptions = [
  { value: "subcat1", label: "Sub Category 1" },
  { value: "subcat2", label: "Sub Category 2" },
];

const sizeOptions = [
  { value: "S", label: "Small (S)" },
  { value: "M", label: "Medium (M)" },
  { value: "L", label: "Large (L)" },
  { value: "XL", label: "Extra Large (XL)" },
];

const colorOptions = ["Red", "Blue", "Green", "Black", "White"];

const tagOptions = [
  { value: "new", label: "New" },
  { value: "popular", label: "Popular" },
  { value: "sale", label: "Sale" },
];

// Validation Schema using Yup
const schema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  smallDescription: yup.string().required("Small description is required"),
  mainDescription: yup.string().required("Main description is required"),
  productCategory: yup.string().required("Product category is required"),
  subCategory: yup.array().min(1, "Select at least one sub-category"),
  tags: yup.array().min(1, "Select at least one tag"),
  gender: yup.string().required("Gender is required"),
  sizes: yup.array().min(1, "Select at least one size"),
  productQuantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Product quantity is required"),
  productPrice: yup
    .number()
    .typeError("Product price must be a number")
    .required("Product price is required"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .min(0, "Discount can't be negative")
    .max(100, "Discount can't exceed 100%"),
});

const Products = () => {
  const [brochure, setBrochure] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [publishStatus, setPublishStatus] = useState("unpublish");
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  // Watch price and discount to calculate discounted price
  const productPrice = watch("productPrice");
  const discount = watch("discount");

  useEffect(() => {
    if (productPrice && discount) {
      const newDiscountedPrice = productPrice - (productPrice * discount) / 100;
      setDiscountedPrice(newDiscountedPrice);
      setValue("discountedPrice", newDiscountedPrice);
    }
  }, [productPrice, discount, setValue]);

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data); // Check the data being submitted
    if (Object.keys(errors).length > 0) {
      console.log("There are errors in the form:", errors);
    }

    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("smallDescription", data.smallDescription);
    formData.append("mainDescription", data.mainDescription);
    formData.append("productCategory", data.productCategory);
    formData.append("subCategory", data.subCategory);
    formData.append("quantity", data.productQuantity);
    formData.append("price", data.productPrice);
    formData.append("discount", data.discount);
    formData.append("gender", data.gender);
    formData.append("sizes", data.sizes);
    formData.append("color", data.color);
    formData.append("published", publishStatus);

    // Append brochure and images to FormData
    if (brochure.length > 0) formData.append("brochure", brochure[0]);
    productImages.forEach((file, index) =>
      formData.append(`productImages[${index}]`, file)
    );

    console.log("Submitted FormData:", Object.fromEntries(formData.entries()));

    // Display a success message
    toast.success("Product successfully added!");
  };

  const onError = (errors) => {
    console.error("Validation errors:", errors);
  };

  const handleBrochureChange = (files) => {
    setBrochure(files);
  };

  const handleProductImagesChange = (files) => {
    setProductImages(files);
  };

  const handleToggleChange = (event, newValue) => {
    setPublishStatus(newValue);
  };

  return (
    <Container maxWidth={1200} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Add Product
      </Typography>
      <Breadcrumbs items={breadcrumbItems} />
      <Box component="main" sx={{ mt: 4 }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 0, md: 4 }, borderRadius: 5, border: "none" }}
        >
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Grid container spacing={2}>
              {/* Detail Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6">Details Section</Typography>
              </Grid>
              {/* Name */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="productName" sx={{ mb: 1 }}>
                  Product Name
                </InputLabel>
                <TextField
                  placeholder="Product Name"
                  id="productName"
                  fullWidth
                  {...register("productName")}
                  error={!!errors.productName}
                  helperText={errors.productName?.message}
                />
              </Grid>

              {/* Category - Select */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="productCategory" sx={{ mb: 1 }}>
                  Product Category
                </InputLabel>
                <FormControl fullWidth error={!!errors.productCategory}>
                  <Controller
                    name="productCategory"
                    id="productCategory"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        displayEmpty
                        value={value || ""}
                        onChange={(event) => onChange(event.target.value)}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                Select Category
                              </span>
                            );
                          }
                          const selectedOption = categoryOptions.find(
                            (option) => option.value === selected
                          );
                          return selectedOption ? selectedOption.label : "";
                        }}
                      >
                        <MenuItem disabled value="">
                          Select Category
                        </MenuItem>
                        {categoryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.productCategory && (
                    <Typography color="error">
                      {errors.productCategory.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Sub-category - Multiselect */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="subCategory" sx={{ mb: 1 }}>
                  Sub Category
                </InputLabel>
                <FormControl fullWidth error={!!errors.subCategory}>
                  <Controller
                    name="subCategory"
                    id="subCategory"
                    control={control}
                    defaultValue={[]} // Ensuring the default value is an array
                    render={({ field: { onChange, value } }) => (
                      <Select
                        multiple
                        displayEmpty
                        value={value || []}
                        onChange={(event) => onChange(event.target.value)}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                Select Sub-categories
                              </span>
                            );
                          }
                          return selected
                            .map((selectedValue) => {
                              const selectedOption = subCategoryOptions.find(
                                (option) => option.value === selectedValue
                              );
                              return selectedOption ? selectedOption.label : "";
                            })
                            .join(", ");
                        }}
                      >
                        <MenuItem disabled value="">
                          Select Sub-categories
                        </MenuItem>
                        {subCategoryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.subCategory && (
                    <Typography color="error">
                      {errors.subCategory.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Small Description */}
              <Grid size={{ xs: 12 }}>
                <InputLabel htmlFor="smallDescription" sx={{ mb: 1 }}>
                  Small Description
                </InputLabel>
                <TextField
                  id="smallDescription"
                  placeholder="Small Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("smallDescription")}
                  error={!!errors.smallDescription}
                  helperText={errors.smallDescription?.message}
                />
              </Grid>

              {/* Main Description - Rich Text Editor */}
              <Grid size={12}>
                <InputLabel sx={{ mb: 1 }}>Main Description</InputLabel>
                {/* For Cases with Image Handling API */}
                {/* 
                <RichTextEditor
                  control={control}
                  name="content"
                  imageUploadUrl="/api/upload-image" // Your server's image upload URL
                  imageUploadHeaders={{ Authorization: "Bearer YOUR_TOKEN" }} // Optional headers
                  showPreview
                /> */}
                <RichTextEditor
                  control={control}
                  name="mainDescription"
                  showPreview={true}
                  editorHeight="400px"
                  excludeButtons={["video", "file"]}
                  editorOptions={{
                    uploader: { insertImageAsBase64URI: true },
                  }}
                />
                {errors.mainDescription && (
                  <Typography color="error">
                    {errors.mainDescription.message}
                  </Typography>
                )}
              </Grid>

              {/* Quantity */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="quantity" sx={{ mb: 1 }}>
                  Quantity
                </InputLabel>
                <TextField
                  type="number"
                  id="quantity"
                  fullWidth
                  {...register("productQuantity")}
                  error={!!errors.productQuantity}
                  helperText={errors.productQuantity?.message}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              {/* Color - Single Select */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="color" sx={{ mb: 1 }}>
                  Color
                </InputLabel>
                <FormControl fullWidth error={!!errors.color}>
                  <Controller
                    name="color"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        displayEmpty
                        value={value || ""}
                        onChange={(event) => onChange(event.target.value)}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                Select Color
                              </span>
                            );
                          }
                          return selected;
                        }}
                      >
                        <MenuItem disabled value="">
                          Select Color
                        </MenuItem>
                        {colorOptions.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.color && (
                    <Typography color="error">
                      {errors.color.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Tags - Multi-Select */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="tags" sx={{ mb: 1 }}>
                  Tags
                </InputLabel>
                <FormControl fullWidth error={!!errors.tags}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        multiple
                        value={value || []}
                        onChange={(event) => onChange(event.target.value)}
                        input={<OutlinedInput id="tags" placeholder="Tags" />}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={
                                  tagOptions.find((tag) => tag.value === value)
                                    ?.label || value
                                }
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {tagOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.tags && (
                    <Typography color="error">{errors.tags.message}</Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Gender - Radio Button Group */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="gender" sx={{ mb: 1 }}>
                  Gender
                </InputLabel>
                <FormControl component="fieldset" error={!!errors.gender}>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue="" // Set default value as an empty string
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup value={value} onChange={onChange}>
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="ratherNotSay"
                          control={<Radio />}
                          label="Rather Not Say"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && (
                    <Typography color="error">
                      {errors.gender.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Sizes - Multi-checkbox */}
              <Grid item xs={12} md={4}>
                <InputLabel htmlFor="sizes" sx={{ mb: 1 }}>
                  Sizes
                </InputLabel>
                <FormControl fullWidth error={!!errors.sizes}>
                  <Controller
                    name="sizes"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value = [] } }) => (
                      <FormGroup>
                        {sizeOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox
                                checked={value.includes(option.value)}
                                onChange={(e) => {
                                  const newSizeValue = e.target.checked
                                    ? [...value, option.value]
                                    : value.filter(
                                      (size) => size !== option.value
                                    );
                                  onChange(newSizeValue);
                                }}
                                inputProps={{ "aria-label": option.label }}
                              />
                            }
                            label={option.label}
                            {...{ item: undefined }} // Ensure no unintended boolean props are passed
                          />
                        ))}
                      </FormGroup>
                    )}
                  />
                  {errors.sizes && (
                    <Typography color="error">
                      {errors.sizes.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Pricing Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" mt={3}>
                  Pricing Section
                </Typography>
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="productPrice" sx={{ mb: 1 }}>
                  Product Price
                </InputLabel>
                <TextField
                  placeholder="1000"
                  id="productPrice"
                  type="number"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    },
                  }}
                  {...register("productPrice")}
                  error={!!errors.productPrice}
                  helperText={errors.productPrice?.message}
                />
              </Grid>

              {/* Discount */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="discount" sx={{ mb: 1 }}>
                  Discount
                </InputLabel>
                <TextField
                  id="discount"
                  placeholder="10"
                  type="number"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    },
                  }}
                  {...register("discount")}
                  error={!!errors.discount}
                  helperText={errors.discount?.message}
                />
              </Grid>

              {/* Final Price */}
              <Grid size={{ xs: 12, md: 4 }}>
                <InputLabel htmlFor="discountPrice" sx={{ mb: 1 }}>
                  Discounted Price
                </InputLabel>
                <TextField
                  id="discountPrice"
                  placeholder="Discounted Price"
                  type="number"
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    },
                  }}
                  value={discountedPrice}
                />
              </Grid>

              {/* Uploads Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" mt={3}>
                  Uploads Section
                </Typography>
              </Grid>

              {/* Brochure Upload */}
              <Grid size={12}>
                <UploadFile
                  label="Brochure Upload"
                  maxFiles={1}
                  maxFileSize={5} // Max size for each file in MB
                  maxTotalSize={5} // Max total size in MB (since only 1 file, this can be the same as maxFileSize)
                  accept="application/pdf"
                  multiple={false}
                  onChange={handleBrochureChange}
                />
              </Grid>

              {/* Images Upload */}
              <Grid size={12}>
                <UploadFile
                  label="Product Images"
                  maxFiles={5}
                  maxFileSize={2} // Max size for each file in MB
                  maxTotalSize={15} // Max total size in MB
                  accept="image/*"
                  multiple={true}
                  onChange={handleProductImagesChange}
                />
              </Grid>

              {/* Publish Button - Toggle Button */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{ mt: 4, textAlign: { xs: "right", sm: "left" } }}
              >
                <ToggleButtonGroup
                  value={publishStatus}
                  exclusive
                  onChange={handleToggleChange}
                >
                  <ToggleButton
                    value="publish"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "white",
                        "&:hover": {
                          backgroundColor: "darkblue",
                        },
                      },
                    }}
                  >
                    Publish
                  </ToggleButton>
                  <ToggleButton
                    value="unpublish"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "darkred",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "darkred",
                        },
                      },
                    }}
                  >
                    Unpublish
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Submit Button */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{
                  mt: { xs: 2, sm: 4 },
                  textAlign: "right",
                }}
              >
                <Button
                  disableElevation
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  sx={{ height: "48px", width: "175px" }}
                >
                  Submit Form
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Products;
