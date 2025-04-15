import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setValidationErrors([]);
      setIsSubmitting(true);

        try {
          const user = await login(formData.username, formData.password);
          
          // Redirect based on user role after successful login
          if (user?.role === "admin") {
              navigate('/admin-dashboard');
          } else if (user?.role === "staff") {
              navigate('/new-sales');
          } else {
              navigate('/'); // Default redirect if role is unknown
          }
      } catch (err) {
          console.error('Login error:', err);
          if (err.response?.data?.errors) {
              setValidationErrors(Object.values(err.response.data.errors).flat());
          } else {
              setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
          }
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: value
      }));
      // Clear errors when user starts typing
      if (error || validationErrors.length) {
          setError('');
          setValidationErrors([]);
      }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('./images/bg.jpeg')] bg-center bg-cover">
      <div className="flex flex-col h-[400px] w-[400px] bg-[#FFFEC4] rounded-lg p-[40px]">
        <h1 className="text-center font-bold text-[25px] text-pink-700">Nuna's Restobar</h1>
        <form className="mt-5 mb-5" onSubmit={handleSubmit}>
          <label className="text-[14px] font-medium ml-2 text-[#B82132]">Email or Username*</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            type="text"
            className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-5 hover:border-[#B82132] hover:border-2"
            required
            disabled={isSubmitting}
          />

          <div className="relative">
            <label className="text-[14px] font-medium ml-2 text-[#B82132]">Password*</label>
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type={showPassword ? "text" : "password"}
              className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-7 hover:border-[#B82132] hover:border-2"
              required
              disabled={isSubmitting}
              autoComplete="current-password"
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                )}
            </button>
          </div>

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
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isSubmitting}
              />
              <label className="text-[12px]">Remember me</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
