import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import AuthProviders from "./Authproviders/AuthProviders";

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProviders>
      <div className="max-w-screen mx-auto font-main-font">
          <RouterProvider router={router} />
        </div>
      </AuthProviders>
    </QueryClientProvider>
  </StrictMode>
);
