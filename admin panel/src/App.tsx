import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { Shell } from "./components/Shell";
import { BarbersPage } from "./pages/BarbersPage";
import { LoginPage } from "./pages/LoginPage";
import { ResourceByKeyPage } from "./pages/ResourceByKeyPage";
import { SlotsPage } from "./pages/SlotsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Shell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admins" replace />} />
          <Route path="admins" element={<ResourceByKeyPage resourceKey="admins" />} />
          <Route path="users" element={<ResourceByKeyPage resourceKey="users" />} />
          <Route path="salons" element={<ResourceByKeyPage resourceKey="salons" />} />
          <Route path="barbers" element={<BarbersPage />} />
          <Route path="services" element={<ResourceByKeyPage resourceKey="services" />} />
          <Route path="products" element={<ResourceByKeyPage resourceKey="products" />} />
          <Route path="slots" element={<SlotsPage />} />
          <Route path="bookings" element={<ResourceByKeyPage resourceKey="bookings" />} />
          <Route path="reviews" element={<ResourceByKeyPage resourceKey="reviews" />} />
          <Route path="cart-items" element={<ResourceByKeyPage resourceKey="cart-items" />} />
          <Route path="*" element={<Navigate to="/admins" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/admins" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
