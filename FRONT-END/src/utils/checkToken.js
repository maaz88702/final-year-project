import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const checkToken=(token)=>{
 if (!token) {
      toast.error("Please login to continue");
      Navigate("/login");
    }
}
export default checkToken;