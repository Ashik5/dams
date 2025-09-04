"use client";
import { Stethoscope, Users, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { loginUser } from "../lib/apiService";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

type UserRole = "PATIENT" | "DOCTOR";

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { setUser, setToken } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormInputs) =>
      loginUser({ ...data, role: selectedRole }),
    onMutate: () => {
      toast.loading("Signing in...", { id: "login" });
    },
    onSuccess: (res) => {
      const { token, user: userData } = res.data.data;

      if (!token || !userData) {
        toast.error("Login failed: Invalid response from server.", { id: "login" });
        return;
      }

      setToken(token);
      setUser(userData);
      toast.success("Login successful! Redirecting...", { id: "login" });

      if (userData.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else if (userData.role === "DOCTOR") {
        router.push("/doctor/dashboard");
      } else {
        toast.error("Unknown user role.", { id: "login" });
        router.push("/");
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message: string })?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage, { id: "login" });
      setToken(null);
      setUser(null);
    },
  });

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-700 mt-2">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("PATIENT")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "PATIENT"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("DOCTOR")}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === "DOCTOR"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Stethoscope className="w-4 h-4 mx-auto mb-1" />
                Doctor
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((formData) => loginMutation.mutate(formData))}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 placeholder:text-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
