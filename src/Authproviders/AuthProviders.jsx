import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";
import PropTypes from "prop-types";
import { app } from "../Firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAxiosSecure from "../hooks/useAxiosSecure"; // <-- import your secure axios

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      const userEmail = currentUser?.email;
      if (currentUser && userEmail) {
        try {
          
          const jwtRes = await axiosPublic.post("/jwt", { email: userEmail });
          if (jwtRes.data.token) {
            localStorage.setItem("access-token", jwtRes.data.token);
          }

          const userRes = await axiosSecure.get(`/users?email=${userEmail}`);
          const matchedUser = userRes.data.find((u) => u.userMail === userEmail);
          setRole(matchedUser?.userRole || "user");
        } catch (error) {
          console.error("Error getting user role or token:", error);
          setRole(null);
        }
      } else {
        setRole(null);
        localStorage.removeItem("access-token");
      }
    });

    return () => unsubscribe();
  }, [axiosPublic, axiosSecure]);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateProfile = (name, photoUrl) => {
    return firebaseUpdateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
  };

  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        setRole(null);
        setUser(null);
        localStorage.removeItem("access-token");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    updateProfile,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProviders;
