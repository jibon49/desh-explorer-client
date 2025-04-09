import { useContext } from 'react';
import { NavLink, useFormAction, useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../../Firebase/firebase.config';
import { AuthContext } from '../../Authproviders/Authproviders';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';




const auth = getAuth(app)


const Login = () => {
    const axiosPublic = useAxiosPublic();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()


    const { logIn } = useContext(AuthContext)


    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';
    const handleLogin = data => {

        const email = data.email
        const password = data.password

        logIn(email, password)
            .then(result => {
                console.log(result)
                Swal.fire({
                    title: 'Success',
                    text: 'Login Success',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                navigate(location?.state ? location.state : '/')



            })
            .catch(error => {
                console.error(error)
                if (error.message === 'Firebase: Error (auth/invalid-login-credentials).') {
                    toast.error('Invalid Email or Password')
                }

            })
    }

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                
                    let membership = 'bronze';
                    let userRole = 'member';
                    const userName = user.displayName;
                    const userMail = user.email;
                    const userPhoto = user.photoURL;
                    const userJoined = user.metadata.creationTime;
                    const userInfo = {
                        userName,
                        userMail,
                        userPhoto,
                        userJoined,
                        membership,
                        userRole,
                    };
                     try { axiosPublic.post('/users', userInfo)
                            .then(res => {
                                console.log(res.data)
                                if (res.data) {
                                    Swal.fire({
                                        title: 'Success',
                                        text: 'Login Success',
                                        icon: 'success',
                                        confirmButtonText: 'Cool',
                                    });
                                }
                                navigate(from, { replace: true })
                            })
                            
                    } catch (error) {
                        console.error(error);
                    }
            });
    };

    return (
        <div>
            <div className="className=mt-20 max-w-6xl mx-auto">
                <div className="hero-content flex-col lg:flex-row-reverse mb-20">
                    <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                        <form onSubmit={handleSubmit(handleLogin)} className="card-body text-[#403F3F]">
                            <div className="form-control">
                                <h1 className="text-center text-4xl font-semibold">Login your account</h1>
                                <hr className="my-12" />
                                <label className="label">
                                    <span className="text-xl font-semibold">Email</span>
                                </label>
                                <input type="email" {...register("email", { required: true })}

                                    name="email" placeholder="Enter your email" className="input input-bordered bg-[#F3F3F3]" required />
                                {errors.exampleRequired && <span>This field is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="text-xl font-semibold">Password</span>
                                </label>
                                <input type="password"
                                    {...register("password", { required: true })}
                                    name="password" placeholder="password" className="input input-bordered bg-[#F3F3F3]" required />
                                {errors.exampleRequired && <span>This field is required</span>}
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn bg-[#eb1c3a] text-white">Login</button>
                            </div>

                            <p className="font-semibold text-center mt-7">Don’t Have An Account ? <span className="text-[#eb1c3a]"><NavLink to='/register'>Register</NavLink></span></p>
                        </form>
                        <div className="p-10 w-2/3 mx-auto mt-6">
                            <button onClick={handleGoogleSignIn} className=" btn btn-outline md:text-lg w-full mb-2">
                                <FaGoogle className=' text-blue-500 text-lg'></FaGoogle>Login with
                                Google
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer></ToastContainer>
            </div>
        </div>
    );
};
export default Login;