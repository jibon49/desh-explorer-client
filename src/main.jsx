import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import AuthProviders from "./Authproviders/Authproviders";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProviders>
    <div className="max-w-screen mx-auto font-main-font">
        <RouterProvider router={router} />
    </div>
    </AuthProviders>
  </StrictMode>
);
