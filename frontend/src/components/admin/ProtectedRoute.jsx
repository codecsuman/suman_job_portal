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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">

                <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center">

                    <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Verifying Access
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Please wait while we verify your recruiter account...
                    </p>

                    <div className="flex justify-center mt-8">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>

                </div>

            </div>
        );
    }

    return children;
};

export default ProtectedRoute;