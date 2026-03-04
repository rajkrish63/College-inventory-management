import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { FacilitiesPage } from "./pages/FacilitiesPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { BookingPage } from "./pages/BookingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { AddEquipmentPage } from "./pages/admin/AddEquipmentPage";
import { AddFacilityPage } from "./pages/admin/AddFacilityPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "facilities",    Component: FacilitiesPage },
      { path: "equipment",     Component: EquipmentPage },
      { path: "booking",       Component: BookingPage },
      { path: "login",         Component: LoginPage },
      { path: "register",      Component: RegisterPage },
      { path: "admin",         Component: AdminPage },
      { path: "admin/add-equipment", Component: AddEquipmentPage },
      { path: "admin/add-facility",  Component: AddFacilityPage },
    ],
  },
]);
