import { createBrowserRouter } from "react-router";
import { Root } from "./components/root";
import { Home } from "./components/home";
import { Events } from "./components/events";
import { EventDetail } from "./components/event-detail";
import { FanTools } from "./components/fan-tools";
import { KPIDashboard } from "./components/kpi-dashboard";
import { NotFound } from "./components/not-found";
import { ContactUs } from "./components/contact-us";
import { AdminRestore } from "./components/admin-restore";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "events", Component: Events },
      { path: "events/:id", Component: EventDetail },
      { path: "fan-tools", Component: FanTools },
      { path: "kpi-dashboard", Component: KPIDashboard },
      { path: "contact-us", Component: ContactUs },
      { path: "admin-restore", Component: AdminRestore }, // Admin only - restore tool
      { path: "*", Component: NotFound },
    ],
  },
]);
