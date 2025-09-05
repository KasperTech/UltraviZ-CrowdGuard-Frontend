// App.js
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Routes
import { publicRoutes, demoRoutes, adminRoutes, userRoutes, cameraRoutes, entranceRoutes } from "./routes";

// Pages
import Login from "./pages/public/Auth/Login";
import NotFound from "./pages/public/NotFound";

import Dashboard from "./pages/demo/Dashboard";
import Fields from "./pages/demo/Forms/Fields";
import SimpleForm from "./pages/demo/Forms/SimpleForm";
import Users from "./pages/demo/Users";
import UserDetails from "./pages/demo/Users/UserDetails";
import Products from "./pages/demo/Products";
import Starter from "./pages/admin/Starter";
import User from "./pages/admin/User";
import Camera from "./pages/admin/Camera";
import Entrance from "./pages/admin/Entrance";
import CameraView from "./pages/admin/CameraView";

// Socket Context and Listener
import { SocketProvider } from "./context/SocketContext";
import AlertListener from "./components/AlertListener";

const App = () => {
  return (
    <>
      <SocketProvider>
        <Toaster />
        <AlertListener />
        <Routes>
          <Route path={publicRoutes.root} element={<PublicLayout />}>
            {/* Public Routes */}
            <Route index element={<Login />} />

            {/* Admin Routes */}
            <Route path={adminRoutes.root} element={<AdminLayout />}>
              <Route path={adminRoutes.starter} element={<Starter />} />
              <Route path={userRoutes.userList} element={<User />} />
              <Route path={cameraRoutes.cameraList} element={<Camera />} />
              <Route path={entranceRoutes.entranceList} element={<Entrance />} />
              <Route path={cameraRoutes.cameraView} element={<CameraView />} />

              {/* Demo Pages Routes */}
              <Route index element={<Dashboard />} />
              <Route path={demoRoutes.formFields} element={<Fields />} />
              <Route path={demoRoutes.formSimple} element={<SimpleForm />} />
              <Route path={demoRoutes.userList} element={<Users />} />
              <Route path={demoRoutes.addProduct} element={<Products />} />
            </Route>

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SocketProvider>
    </>
  );
};

export default App;