import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    axios.get("https://capstone-1235.onrender.com/user", { withCredentials: true })
      .then(() => setValid(true))
      .catch(() => setValid(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  // check role from localStorage
  const role = localStorage.getItem("role");

  if (!valid || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}