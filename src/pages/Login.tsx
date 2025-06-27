import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

interface Inputs {
  email: string;
  password: string;
}
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from || "/";
  const { login } = useAuth();
  const handleForm = async (data: Inputs) => {
    const response = await login(data.email, data.password);
    if (response.error) {
      enqueueSnackbar(response.message, {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    enqueueSnackbar("Login successful", {
      variant: "success",
      preventDuplicate: true,
    });
    navigate(from, { replace: true });
  };
  return (
    <div className="max-w-md mx-auto rounded-lg shadow-md md:dark:bg-gray-800 dark:text-white px-3 py-2 md:border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login to CryptoGlance
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit(handleForm)}>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            {...register("email")}
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            {...register("password")}
            required
          />
          <div className="absolute top-9 right-3 flex items-center cursor-pointer">
            {showPassword ? (
              <FaRegEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className="size-4"
              />
            ) : (
              <FaRegEye
                onClick={() => setShowPassword(!showPassword)}
                className="size-4"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="text-white w-full bg-blue-500 py-2 rounded-md font-semibold cursor-pointer hover:bg-blue-800 transition"
        >
          Login
        </button>
      </form>
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="mx-3 text-sm">or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition hover:text-gray-700"
      >
        <img src="/google-96.png" alt="Google Icon" className="w-5 h-5" />
        <span className="font-medium">Sign in with Google</span>
      </button>
      <Link
        to="/register"
        state={{ from: from }}
        className="block text-center mt-4 text-sm text-blue-500 hover:underline"
      >
        Don't have an account? Register here
      </Link>
    </div>
  );
}
