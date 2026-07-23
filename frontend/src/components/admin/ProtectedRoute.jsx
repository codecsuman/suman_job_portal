import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Don't render protected content while redirecting
  if (!user || user.role !== "recruiter") {
    return (
      <div
        className="min-h-screen font-body flex items-center justify-center px-4"
        style={{ background: "var(--paper)" }}
      >
        <div
          className="bg-white rounded-3xl border p-10 max-w-md w-full text-center shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(0,184,153,0.1)" }}
          >
            <ShieldCheck
              className="w-10 h-10"
              style={{ color: "var(--teal)" }}
            />
          </div>

          <h2
            className="font-display font-semibold text-2xl tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Verifying Access
          </h2>

          <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
            Please wait while we verify your recruiter account...
          </p>

          <div className="flex justify-center mt-8">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--teal)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
