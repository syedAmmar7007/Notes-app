import { useForm } from "react-hook-form";
import { useAuth } from "../store/notes-app-store";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      let message = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
      }
      alert(message);
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
        Welcome Back
      </h1>
      <p className="text-center text-sm text-slate-400 mb-6">
        Log in to manage your notes
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Email Address
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="
                w-full px-4 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                focus:border-indigo-500
                transition-all duration-200
              "
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
              w-full py-3 rounded-xl font-medium text-slate-100
              ${loading ? "bg-indigo-400/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 transition"}
            `}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-400 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>

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

export default Login;
