import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default PublicLayout;
