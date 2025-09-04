import React, { useState } from "react";
import { Box, Typography, IconButton, InputLabel } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PresentationIcon from "@mui/icons-material/Slideshow";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";

const UploadFile = ({
  label,
  maxFiles = 1,
  maxFileSize = 2,
  maxTotalSize = 5,
  accept,
  multiple,
  onChange,
}) => {
  const [files, setFiles] = useState([]);

  const fileSizeInMB = (file) => file.size / (1024 * 1024);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    let totalSize = files.reduce((acc, file) => acc + fileSizeInMB(file), 0);
    let newFiles = [];

    rejectedFiles.forEach((file) => {
      if (file.errors[0].code === "file-invalid-type") {
        toast.error(`File type not accepted: ${file.file.name}`);
      }
    });

    acceptedFiles.forEach((file) => {
      if (fileSizeInMB(file) > maxFileSize) {
        toast.error(`File ${file.name} exceeds the ${maxFileSize}MB limit.`);
        return;
      }
      if (totalSize + fileSizeInMB(file) > maxTotalSize) {
        toast.error(`Total size exceeds the ${maxTotalSize}MB limit.`);
        return;
      }
      newFiles.push(file);
      totalSize += fileSizeInMB(file);
    });

    if (newFiles.length > 0 && files.length + newFiles.length > maxFiles) {
      toast.error(`Max file count of ${maxFiles} exceeded.`);
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    onChange([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    validator: (file) => {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      if (
        !acceptedTypes.some((type) =>
          file.type.match(new RegExp(type.replace(/\*/g, ".*")))
        )
      ) {
        return {
          code: "file-invalid-type",
          message: `File type not accepted: ${file.name}`,
        };
      }
      if (fileSizeInMB(file) > maxFileSize) {
        return {
          code: "file-too-large",
          message: `File is larger than ${maxFileSize}MB`,
        };
      }
      return null;
    },
  });

  const renderPreview = (file, index) => {
    const fileType = file.type.split("/")[1];
    const icon = () => {
      switch (fileType) {
        case "pdf":
          return <PictureAsPdfIcon color="error" />;
        case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "vnd.ms-excel":
          return <InsertChartIcon color="success" />;
        case "vnd.openxmlformats-officedocument.presentationml.presentation":
        case "vnd.ms-powerpoint":
          return <PresentationIcon color="warning" />;
        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "msword":
          return <DescriptionIcon color="primary" />;
        case "csv":
          return <AttachFileIcon color="success" />;
        default:
          return <InsertDriveFileIcon color="action" />;
      }
    };

    if (file.type.split("/")[0] === "image") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            background: "#F6F6F6",
            borderRadius: 2,
          }}
        >
          <Box
            component="img"
            src={URL.createObjectURL(file)}
            alt={file.name}
            sx={{
              height: 48,
              width: 48,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
          <Typography>
            {`${file.name} (${fileSizeInMB(file).toFixed(2)} MB)`}
          </Typography>
          <IconButton onClick={() => removeFile(index)}>
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            background: "#F6F6F6",
            borderRadius: 2,
          }}
        >
          {icon()}
          <Typography>
            {`${file.name} (${fileSizeInMB(file).toFixed(2)} MB)`}
          </Typography>
          <IconButton onClick={() => removeFile(index)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      );
    }
  };

  return (
    <Box>
      <InputLabel sx={{ mb: 1, mt: 1 }}>{label}</InputLabel>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
        }}
      >
        <input {...getInputProps()} accept={accept} />
        <CloudUploadIcon fontSize="large" />
        <Typography variant="body2">
          Drag 'n' drop some files here, or click to select files
        </Typography>
      </Box>

      <Box>
        {files.map((file, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            {renderPreview(file, index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadFile;
