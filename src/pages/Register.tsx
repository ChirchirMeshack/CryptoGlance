import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

interface Inputs {
  email: string;
  password: string;
  confirmPassword: string;
}
export default function Register() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from || "/";
  const handleRegister = async (data: Inputs) => {
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    const { email, password } = data;
    const response = await signUp(email, password);
    if (response.error) {
      enqueueSnackbar("Registration failed. Please try again.", {
        variant: "error",
        preventDuplicate: true,
      });
      return;
    }
    enqueueSnackbar(`Registration successful. Welcome ${response.user.displayName}`, {
      variant: "success",
      preventDuplicate: true,
    });
    navigate(from, { replace: true });
  };
  return (
    <div className="max-w-md mx-auto rounded-lg shadow-lg md:dark:bg-gray-800 dark:text-white px-4 py-2 ">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register for CryptoGlance
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
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
        <div>
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
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            {...register("confirmPassword")}
            required
          />
        </div>
        <div className="text-sm text-blue-500 flex justify-end">
          {showPassword ? (
            <span
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              Hide Passwords
            </span>
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              Show Passwords
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 py-2 rounded-md font-semibold cursor-pointer hover:bg-blue-800 transition"
        >
          Register
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
        to="/login"
        className="block text-center mt-4 text-sm text-blue-500 hover:underline"
      >
        Already have an account? Login here
      </Link>
    </div>
  );
}
