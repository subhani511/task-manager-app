import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    checkAuth().then((user) => {
      if (mounted) {
        setAuthed(Boolean(user));
        setLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  if (loading) return <div>Checking auth...</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}
