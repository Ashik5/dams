"use client";
import React, { use, useState } from "react";
import { User, LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

// Type definitions
interface User {
  id?: number;
  name: string;
  email?: string;
  role: UserRole;
  specialization?: string;
  photo_url?: string;
}

type UserRole = "PATIENT" | "DOCTOR";
const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, setToken } = useUserStore();
  const router = useRouter();
  const logout = (): void => {
    setUser(null);
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MedCare</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/patient/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                href="/patient/appointments"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                My Appointments
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default PatientLayout;
