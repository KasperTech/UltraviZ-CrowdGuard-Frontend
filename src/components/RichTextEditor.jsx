import React, { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import { Button, Modal, Box, Typography } from "@mui/material";

// Props:
// - control: the control object from react-hook-form
// - name: the name of the field
// - showPreview: boolean, if true shows the preview button in the editor toolbar
// - editorOptions: object, to configure the editor options (toolbar buttons, image upload, etc.)
// - excludeButtons: array of strings, specifying buttons to exclude from the toolbar
// - editorHeight: string, to set the height of the editor (e.g., '300px', '100%')
// - imageUploadUrl: URL endpoint for uploading images to the server (if provided)
// - imageUploadHeaders: additional headers (optional), for example for authorization

const RichTextEditor = ({
  control,
  name,
  showPreview,
  editorOptions = {},
  excludeButtons = [],
  editorHeight = "300px",
  imageUploadUrl, // URL for image uploads (optional)
  imageUploadHeaders = {}, // Headers for image upload (optional)
}) => {
  const [open, setOpen] = useState(false);
  const editor = useRef(null);
  const contentRef = useRef(""); // Store editor content

  const handlePreviewOpen = () => setOpen(true);
  const handlePreviewClose = () => setOpen(false);

  // List of all available buttons in Jodit Editor
  const allButtons = [
    "bold",
    "italic",
    "underline",
    "|",
    "align",
    "strikethrough",
    "superscript",
    "subscript",
    "|",
    "paragraph",
    "font",
    "fontsize",
    "brush",
    "|",
    "ul",
    "ol",
    "|",
    "link",
    "image",
    "video",
    "file",
    "source",
    "table",
    "hr",
    "undo",
    "redo",
  ];

  // Determine the buttons to display based on excludeButtons and editorOptions
  const availableButtons = editorOptions?.buttons
    ? editorOptions.buttons.filter((button) => !excludeButtons.includes(button))
    : allButtons.filter((button) => !excludeButtons.includes(button));

  // Conditional uploader config based on whether an imageUploadUrl is provided
  const uploaderConfig = imageUploadUrl
    ? {
        url: imageUploadUrl, // URL to your image upload server
        method: "POST",
        headers: imageUploadHeaders, // Add any headers (like authorization)
        isSuccess: (response) => response.success, // Adjust according to your API response
        process: (response) => {
          return {
            files: response.files || response.url, // Adjust to extract the image URL
          };
        },
        defaultHandlerSuccess: true,
      }
    : {
        insertImageAsBase64URI: true, // Fallback to base64 if no upload URL is provided
      };

  return (
    <div
      style={{ position: "relative", width: "100%", boxSizing: "border-box" }}
    >
      {/* MUI Button positioned at the bottom-right corner of the editor */}
      {showPreview && (
        <Button
          variant="contained"
          onClick={handlePreviewOpen}
          style={{
            position: "absolute",
            bottom: "35px",
            right: "17.5px",
            zIndex: 10,
          }}
        >
          Show Preview
        </Button>
      )}

      {/* Jodit Editor */}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <JoditEditor
            ref={editor}
            config={{
              toolbarAdaptive: false,
              buttons: availableButtons,
              uploader: uploaderConfig, // Conditional uploader config
              minHeight: editorHeight,
              ...editorOptions,
            }}
            onBlur={() => {
              field.onChange(contentRef.current);
            }}
            onChange={(newContent) => {
              contentRef.current = newContent;
            }}
          />
        )}
      />

      {/* Modal to show the preview content */}
      <Modal
        open={open}
        onClose={handlePreviewClose}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="preview-modal-title"
            variant="h6"
            component="h2"
            color="lightgrey"
          >
            Preview
          </Typography>
          <Typography
            id="preview-modal-description"
            sx={{ mt: 2 }}
            dangerouslySetInnerHTML={{ __html: contentRef.current }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default RichTextEditor;
