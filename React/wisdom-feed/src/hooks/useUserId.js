import { useContext } from "react";
import { UserIdContext } from "../Context/UserIdContext";

const useUserId = () => {
  return useContext(UserIdContext);
};

export default useUserId;
