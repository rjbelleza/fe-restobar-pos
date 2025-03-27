import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Fetch users from API
      const response = await fetch('https://your-api-endpoint.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      
      // Validate credentials
      const foundUser = users.find((user) => 
        (email === user.email || username === user.username) && 
        pass === user.password
      );

      if (foundUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(foundUser));

        if (foundUser.role === "admin") {
          navigate("/adminDashboard");
        } else if (foundUser.role === "cashier") {
          navigate("/staffDashboard");
        }
      } else {
        setError("Invalid Credentials!");
      }
    } catch (error) {
      setError("Failed to connect to authentication service");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[url('./images/bg.jpeg')] bg-center bg-cover">
      <div className="flex flex-col h-[400px] w-[400px] bg-[#FFFEC4] rounded-lg p-[40px]">
        <h1 className="text-center font-bold text-[25px] text-pink-700">Nuna's Restobar</h1>
        <form className="mt-5 mb-5" onSubmit={handleValidate}>
          <label className="text-[14px] font-medium ml-2 text-[#B82132]">Email or Username*</label>
          <input
            type="text"
            onChange={(e) => { setEmail(e.target.value); setUsername(e.target.value) }}
            value={email}
            className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-5 hover:border-[#B82132] hover:border-2"
            required
          />

          <label className="text-[14px] font-medium ml-2 text-[#B82132]">Password*</label>
          <input
            type="password"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
            className="p-3 h-[40px] w-full bg-white border-1 border-gray-500 rounded-md mt-1 mb-7 hover:border-[#B82132] hover:border-2"
            required
          />

          <button 
            type="submit" 
            className="h-[40px] w-full shadow-[0px_3px_4px_gray] bg-[#B82132] rounded-lg text-white cursor-pointer hover:bg-[#A31D1D] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        {error && <p className="text-red-600 text-[13px] text-center h-[40px] w-full">{error}</p>}

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
