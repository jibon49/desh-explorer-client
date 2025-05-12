import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home/Home";
import Tour from "../pages/Tour/Tour";
import CustomTour from "../pages/CustomTour/CustomTour";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import TourDetails from "../pages/Tour/TourDetails";
import UserDashboard from "../pages/userDashboard/userDashboard";
import GroupTour from "../pages/GroupTour/GroupTour";
import ComplainForm from "../pages/ComplainForm/ComplainForm";
import AboutUs from "../pages/AboutUs/AboutUs";
import Payments from "../pages/Payments/Payments";
import CheckOut from "../pages/Payments/CheckOut";
import Reviews from "../pages/BlogsReview/Reviews";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

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
        },
        {
          path:'/register',
          element:<Register></Register>
        },
        {
          path:'/tourDetails/:id',
          element:<TourDetails></TourDetails>
        },
        {
          path:'/userDashboard',
          element:<UserDashboard></UserDashboard>
        },
        {
          path:'/group-tour',
          element:<GroupTour></GroupTour>
        },
        {
          path:'complain-form',
          element:<PrivateRoute><ComplainForm></ComplainForm></PrivateRoute>
        },
        {
          path:'review',
          element:<PrivateRoute><Reviews></Reviews></PrivateRoute>
        },
        {
          path:"aboutus",
          element:<AboutUs></AboutUs>
        },
        {
          path:"checkout",
          element:<PrivateRoute><CheckOut></CheckOut></PrivateRoute>
        },
      ]
    },
  ]);