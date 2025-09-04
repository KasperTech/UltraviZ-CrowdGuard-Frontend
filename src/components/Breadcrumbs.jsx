import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator=">">
      {items.map((item, index) =>
        item.link ? (
          <Link
            key={index}
            underline="hover"
            color="text.primary"
            onClick={() => navigate(item.link)}
            sx={{ cursor: "pointer" }}
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={index} color="inherit">
            {item.label}
          </Typography>
        )
      )}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
