import { useContext } from "react";
import { AuthContext } from "../Authproviders/Authproviders";

const useRole = () => {
  const { role, loading } = useContext(AuthContext);
  return { role, loading };
};

export default useRole;
