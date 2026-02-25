import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/notes-app-store";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      await signup(data);
      reset();
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already registered. Please login.");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else {
        alert("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div
        className="
          w-full max-w-md
          bg-slate-900/90
          border border-slate-800
          rounded-3xl
          shadow-2xl
          p-8
          animate-[fadeInUp_0.5s_ease-out]
        "
      >
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-1">
          Create Account
        </h1>
        <p className="text-center text-sm text-slate-400 mb-6">
          Manage your notes efficiently
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Full Name
            </label>
            <input
              placeholder="Full Name"
              type="text"
              {...register("name", { required: true })}
              className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
              className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
              className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Confirm Password
            </label>
            <input
              placeholder="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                validate: (v) => v === password || "Passwords do not match",
              })}
              className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-medium text-slate-100
              ${loading ? "bg-indigo-400/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 transition"}
            `}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
