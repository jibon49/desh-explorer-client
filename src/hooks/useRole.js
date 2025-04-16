import { useContext } from "react";
import { AuthContext } from "../Authproviders/AuthProviders";

const useRole = () => {
  const { role, loading } = useContext(AuthContext);
  return { role, loading };
};

export default useRole;
