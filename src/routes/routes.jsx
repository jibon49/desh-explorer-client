import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home/Home";
import Tour from "../pages/Tour/Tour";
import CustomTour from "../pages/CustomTour/CustomTour";
import Login from "../pages/Login/Login";

  export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children:[
        {
            path:'/',
            element:<Home></Home>
        },
        {
          path:'/tour',
          element:<Tour></Tour>
        },
        {
          path:'/custom-tour',
          element:<CustomTour></CustomTour>
        },
        {
          path:'/login',
          element:<Login></Login>
        }
      ]
    },
  ]);