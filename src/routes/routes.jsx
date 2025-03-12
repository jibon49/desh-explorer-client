import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../assets/pages/Home/Home";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children:[
        {
          path:'/',
          element:<Home></Home>
        }
      ]
    },
  ]);