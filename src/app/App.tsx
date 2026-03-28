import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}

export const metadata = {
  icons: {
    icon: "src/app/favicons/favicon.png",
  },
};

const link = document.createElement("link");
link.rel = "icon";
link.href = "src/app/favicons/favicon.png";
document.head.appendChild(link);