import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);
    setIsSubmitting(true);

    try {
        const result = await login(email, password);

        if (result.success) {
            // Redirect based on user role
            if (result.user.role === "admin") {
                navigate('/admin-dashboard');
            } else if (result.user.role === "staff") {
                navigate('/staff-dashboard');
            } else {
                navigate('/'); // Redirect to home if role is unknown
            }
        } else {
            if (result.errors) {
                setValidationErrors(Object.values(result.errors).flat());
            } else {
                setError(result.message || 'Invalid credentials');
            }
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred');
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('./images/bg.jpeg')] bg-center bg-cover">
      <div className="flex flex-col h-[400px] w-[400px] bg-[#FFFEC4] rounded-lg p-[40px]">
        <h1 className="text-center font-bold text-[25px] text-pink-700">Nuna's Restobar</h1>
        <form className="mt-5 mb-5" onSubmit={handleSubmit}>
          <label className="text-[14px] font-medium ml-2 text-[#B82132]">Email or Username*</label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-5 hover:border-[#B82132] hover:border-2"
            required
            disabled={isSubmitting}
          />

          <label className="text-[14px] font-medium ml-2 text-[#B82132]">Password*</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-7 hover:border-[#B82132] hover:border-2"
            required
            disabled={isSubmitting}
          />

          <button 
            type="submit" 
            className="h-[40px] w-full shadow-[0px_3px_4px_gray] bg-[#B82132] rounded-lg text-white cursor-pointer hover:bg-[#A31D1D] disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {validationErrors.length > 0 && <p className="text-red-600 text-[13px] text-center h-[40px] w-full">{validationErrors}</p>}

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <input type="checkbox" />
              <p className="text-[12px]">Remember me</p>
            </div>
            <a className="text-[12px] text-center cursor-pointer"><u>Forgot password?</u></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
