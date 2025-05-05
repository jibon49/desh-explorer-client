import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { app } from "../../Firebase/firebase.config";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Authproviders/AuthProviders";
import logo3 from "../../assets/logo3.png";
const auth = getAuth(app);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (data) => {
    const { email, password } = data;
    logIn(email, password)
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Login Success",
          icon: "success",
          confirmButtonText: "Cool",
        }).then(() => {
          navigate(from, { replace: true });
        });
      })
      .catch((error) => {
        toast.error(error.message);
        if (
          error.message === "Firebase: Error (auth/invalid-login-credentials)."
        ) {
          toast.error("Invalid Email or Password");
        }
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;

      const userInfo = {
        userName: user.displayName,
        userMail: user.email,
        userPhoto: user.photoURL,
        userJoined: user.metadata.creationTime,
        membership: "bronze",
        userRole: "member",
      };

      try {
        axiosPublic.post("/users", userInfo).then((res) => {
          if (res.data) {
            Swal.fire({
              title: "Success",
              text: "Login Success",
              icon: "success",
              confirmButtonText: "Cool",
            });
          }
          navigate(from, { replace: true });
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
            <i className="fas fa-globe text-blue-500 text-3xl mr-2"></i>
            <img className="w-24" src={logo3} alt="" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Login</h2>
          <p className="text-gray-600 mb-6">
            Login to access your travelwise account
          </p>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  Password is required
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 text-sm">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <NavLink to="/register" className="text-blue-500 font-medium">
              Sign up
            </NavLink>
          </p>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or login with</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-gray-100 transition">
              <i className="fab fa-facebook-f text-blue-600"></i>
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-red-600" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-gray-100 transition">
              <i className="fab fa-apple text-gray-800"></i>
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="https://storage.googleapis.com/a1aa/image/BBu7cRiiftQxvqnibt7n_0NEPGmLaqMM7RY0UgRdXrM.jpg"
            alt="Login background"
            className="w-full h-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
