import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../../Authproviders/Authproviders";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const axiosPublic = useAxiosPublic();
  const { createUser } = useContext(AuthContext);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const location = useLocation();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    const phone = data.phone;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    let photoUrl = "";

    try {
      if (data.photoUrl && data.photoUrl[0]) {
        const formData = new FormData();
        formData.append("image", data.photoUrl[0]);

        const res = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          photoUrl = res.data.data.display_url;
        }
      }

      const result = await createUser(email, password);
      const loggedUser = result.user;

      await updateProfile(loggedUser, {
        displayName: name,
        photoURL: photoUrl,
      });

      const userInfo = {
        userName: name,
        userMail: email,
        userPhoto: photoUrl,
        userPhone: phone,
        userJoined: loggedUser.metadata.creationTime,
        membership: "bronze",
        userRole: "member",
      };

      const resDb = await axiosPublic.post("/users", userInfo);

      if (resDb.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registered successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(location?.state || "/");
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        <div className="w-1/2 hidden md:block">
          <img
            src="https://storage.googleapis.com/a1aa/image/XOA0xnfK5bheEaiTM1RBUZ8NbBkcvmr0NbazCcpnzuo.jpg"
            alt="Side"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://storage.googleapis.com/a1aa/image/gP_VBxe9x_3cUja3QbhSibGcL71h37HZBIRBHCzy5F4.jpg"
              alt="Logo"
              className="mr-2 w-10 h-10"
            />
            <span className="text-2xl font-bold text-blue-600">Your Logo</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Sign up</h2>
          <p className="text-gray-600 mb-6">
            Let's get you all set up so you can access your personal account.
          </p>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="mb-4">
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                {...register("phone", { required: true })}
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                {...register("photoUrl")}
                type="file"
                className="w-full file-input file-input-bordered rounded-lg"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-gray-600">
                I agree to all the{" "}
                <a href="#" className="text-blue-600">
                  Terms and Privacy Policies
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition duration-300"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-600">
              Login
            </NavLink>
          </p>

          <div className="flex items-center justify-center mt-6">
            <span className="text-gray-600">Or sign up with</span>
          </div>
          {/* <div className="flex items-center justify-center mt-4 space-x-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-red-600" />
            </button>
          </div> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
