import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Authproviders/AuthProviders";

const useMongoUser = () => {
  const { user } = useContext(AuthContext);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMongoUser = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`http://localhost:5000/users/${user.email}`);
          setMongoUser(res.data[0]);
        } catch (err) {
          console.error("MongoDB user fetch failed:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMongoUser();
  }, [user?.email]);

  return { mongoUser, loading, error };
};

export default useMongoUser;
